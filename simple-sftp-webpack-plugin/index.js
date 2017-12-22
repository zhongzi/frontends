const client = require('scp2');
const fs = require('fs');
const path = require('path');
const os = require('os');

function SimpleSftpWebpackPlugin(options) {
  this.options = options;
}

SimpleSftpWebpackPlugin.prototype.apply = function (compiler) {
  var self = this;

  compiler.plugin('done', function (stats) {
    if (stats.hasErrors()) {
      return
    }
    var privateKey = self.options.privateKey;
    if (!privateKey) {
      const homedir = os.homedir();
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
    const dest = {
      host: self.options.host,
      port: self.options.port || '22',
      username: self.options.username,
      password: self.options.password,
      path: self.options.path,
      privateKey: privateKey
    };
    const src = self.options.src;
    client.scp(
      src, dest, function (err) {
        if (err) {
          throw err
        }
        console.log('Uploaded File: ' + src + '->' + self.options.path);
      }
    );
  });
};

module.exports = SimpleSftpWebpackPlugin;
