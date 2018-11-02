const qiniu = require('qiniu')
const pathUtil = require('path')

const min = 3

class QiniuCleaner {
  constructor ({
    ACCESS_KEY,
    SECRET_KEY,
    bucket,
    path,
    days
  }) {
    if (!ACCESS_KEY || !SECRET_KEY) {
      throw new Error('ACCESS_KEY and SECRET_KEY must be provided');
    }
    if (!bucket) {
      throw new Error('bucket must be provided')
    }
    if (!path || path.length < min) {
      throw new Error('path must be provided')
    }

    const mac = new qiniu.auth.digest.Mac(
      ACCESS_KEY, SECRET_KEY)
    const config = new qiniu.conf.Config
    this.bucketManager = new qiniu.rs.BucketManager(mac, config)
    this.bucket = bucket
    this.path = path
    this.days = parseInt(days, 10)
  }

  apply (compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const path = this.path.replace('[hash]', compilation.hash)
      const assets = compilation.assets
      const fileNames = Object.keys(assets).filter((fileName) => {
        return assets[fileName].emitted
      }).reduce((current, fileName) => {
        current[pathUtil.join(path, fileName)] = true
        return current
      }, {})
      this.cleanIfNot(fileNames, path, undefined, callback)
    })
  }

  cleanIfNot (fileNames, path, marker, callback) {
    this.bucketManager.listPrefix(this.bucket, {
      prefix: path,
      marker: marker,
      limit: 1000
    }, (err, respBody, respInfo) => {
      if (err) {
        callback(err)
        return
      }
      if (respInfo.statusCode === 200) {
        const items = respBody.items
        const operations = items.reduce((current, item) => {
          if (fileNames[item.key] !== true) {
            if (this.days > 0) {
              current.push(qiniu.rs.deleteAfterDaysOp(
                this.bucket, item.key, this.days))
            } else if (this.days === 0) {
              current.push(qiniu.rs.deleteOp(
                this.bucket, item.key))
            }
          }
          return current
        }, [])

        const nextMarker = respBody.marker
        if (operations.length > 0) {
          this.bucketManager.batch(operations, (err, respBody, respInfo) => {
            if (err) {
              callback(err)
              return
            }
            if (parseInt(respInfo.statusCode / 100) === 2) {
              if (nextMarker) {
                this.cleanIfNot(name, days, nextMarker, callback)
              } else {
                callback()
              }
            } else {
              callback(new Error(JSON.stringify(respBody)))
            }
          })
        } else {
          if (nextMarker) {
            this.cleanIfNot(fileNames, path, nextMarker, callback)
          } else {
            callback()
          }
        }
      } else {
        callback(new Error(respBody))
      }
    })
  }
}

module.exports = QiniuCleaner
