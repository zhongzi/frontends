var ScpClient = require('scp2').Client;
var fs = require('fs');
var path = require('path');
var os = require('os');

function SimpleSftpWebpackPlugin(options) {
  this.options = options;
}

function recursionFile(_path, arr) {
  var type = fs.statSync(_path);
  if (type.isDirectory()) {
    var list = fs.readdirSync(_path);
    list.forEach(function(item, index, array) {
      recursionFile(path.resolve(_path, item), arr);
    });
  } else if (type.isFile()) {//文件
    arr.push(_path);
  }
  return arr;
}

SimpleSftpWebpackPlugin.prototype.apply = function (compiler) {
  var self = this;

  compiler.plugin('done', function (stats) {
    if (stats.hasErrors()) {
      return;
    }
    var privateKey = self.options.privateKey;
    if (!privateKey) {
      var homedir = os.homedir();
      var possibleLocs = [
        path.join(homedir, '.ssh/id_rsa'),
        path.join(homedir, '.ssh/id_dsa')
      ];
      possibleLocs = possibleLocs.filter(function (possibleLoc) {
        return fs.existsSync(possibleLoc);
      });
      if (possibleLocs.length > 0) {
        privateKey = possibleLocs[0];
      }
    }
    if (privateKey && privateKey.length > 0) {
      privateKey = fs.readFileSync(privateKey);
    } else {
      privateKey = undefined;
    }
    var srcs = self.options.src;
    if( Object.prototype.toString.call( srcs ) !== '[object Array]' ) {
      srcs = [srcs];
    }
    var client = new ScpClient({
      host: self.options.host,
      port: self.options.port || '22',
      username: self.options.username,
      password: self.options.password,
      privateKey: privateKey
    });
    var relative = self.options.base || './dist';
    var dest = self.options.path;
    client.mkdir(dest, { mode: 0755 }, function (err) {
      if (err) {
        throw err;
      }
      var files = []
      srcs.forEach(function (src) {
        recursionFile(src, files);
      });
      var promises = files.map(function (src) {
        return new Promise(function (resolve, reject) {
          var srcName = path.relative(relative, src);
          client.upload(
            src, path.join(dest, srcName), function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      });
      Promise.all(promises).then(function () {
        console.log('Uploaded Files: ' + srcs + '->' + self.options.path);
        client.close();
      }).catch(function (err) {
        console.log('Upload Failed: ' + err + '\n' + err.stack);
        client.close();
      });
    });
  });
};

module.exports = SimpleSftpWebpackPlugin;
