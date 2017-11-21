import qiniu from 'qiniu';
import Promise from 'promise';
import { join } from 'path';
import slash from 'slash';

var mac = null;

class QiniuCleannerPlugin {
  constructor(options) {
    if (!options || !options.ACCESS_KEY || !options.SECRET_KEY) {
      throw new Error('ACCESS_KEY and SECRET_KEY must be provided');
    }
    this.options = Object.assign({}, options);
    mac = new qiniu.auth.digest.Mac(this.options.ACCESS_KEY, this.options.SECRET_KEY);
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const { assets, hash } = compilation;
      const {
        bucket,
        include,
      } = this.options;
      let {
        path = '[hash]',
      } = this.options;

      // 获取前缀
      let prefix = path.replace('[hash]', '');
      prefix = prefix.replace('//', '/');
      if (prefix.length <= 1 || prefix[prefix.length - 1] !== '/') {
        callback();
        return;
      }

      path = path.replace('[hash]', hash);

      const excludes = Object.keys(assets).filter((fileName) => {
        let valid = assets[fileName].emitted;
        if (include) {
          valid = valid
            && include.some((includeFileName) => {
              if (includeFileName instanceof RegExp) {
                return includeFileName.test(fileName);
              }
              return includeFileName === fileName;
            });
        }
        return valid;
      }).map(fileName => slash(join(path, fileName)));

      // 空间管理器
      const config = new qiniu.conf.Config();
      const bucketManager = new qiniu.rs.BucketManager(mac, config);

      // 列文件
      bucketManager.listPrefix(bucket, {
        limit: 1000,
        prefix
      }, (err, respBody, respInfo) => {
        if (err) {
          callback(err);
          return;
        }
        if (respInfo.statusCode !== 200) {
          callback();
          return;
        }
        const { items } = respBody;
        const tobeDeleteds = [];
        const deleteOps = items
          .filter(item => excludes.indexOf(item.key) === -1)
          .map((item) => {
            tobeDeleteds.push(item.key);
            return qiniu.rs.deleteOp(bucket, item.key);
          });

        if (deleteOps.length === 0) {
          callback();
          return;
        }

        const limit = 1000;
        const subDeleteOps = [];
        while (deleteOps.length > 0) {
          subDeleteOps.push(deleteOps.splice(0, limit));
        }

        const promises = subDeleteOps.map(subDeleteOp => new Promise((resolve, reject) => {
          bucketManager.batch(subDeleteOp, (e) => {
            if (!err) {
              resolve();
            } else {
              reject(e);
            }
          });
        }));

        Promise.all(promises)
          .then(() => {
            console.log(tobeDeleteds);
            callback();
          })
          .catch((e) => {
            callback(e);
          });
      });
    });
  }
}

export default QiniuCleannerPlugin;
