const qiniuClean = require('./index')

function QiniuCleaner(options) {
  this.options = options
}

QiniuCleaner.prototype.apply = function(compiler) {
  const self = this
  compiler.plugin('done', function(stats) {
    if (stats.hasErrors()) {
      return;
    }
    qiniuClean(self.options)
  })
}

module.exports = QiniuCleaner
