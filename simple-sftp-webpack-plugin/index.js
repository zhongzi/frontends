var client = require('scp2');
var fs = require('fs');
var path = require('path');
var os = require('os');

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
    client.defaults({
      host: self.options.host,
      port: self.options.port || '22',
      username: self.options.username,
      password: self.options.password,
      privateKey: privateKey
    });
    var src = self.options.src;
    var dest = self.options.path;
    client.mkdir(dest, { mode: 0755 }, function (err) {
      client.scp(
        src, { path: dest }, client, function (err) {
          if (err) {
            throw err
          }
          console.log('Uploaded File: ' + src + '->' + self.options.path);
        }
      );
    })
  });
};

module.exports = SimpleSftpWebpackPlugin;
