const path = require('path')
const fs = require('fs')
const klaw = require('klaw')
const gm = require('gm')

module.exports = function (callback, baseDensity=3, densities = [1, 2], dir='src/assets/') {
  var promises = []
  klaw(dir).on('data', function (item) {
    if (item.stats.isDirectory()) {
      return
    }
    const file = item.path
    if (file.indexOf('@') >= 0) {
      return
    }
    densities.forEach(function (density) {
      const promise = new Promise(function (resolve, reject) {
        const img = gm(file)
        img.size(function (err, size) {
          if (err) {
            resolve()
            return
          }
          const width = parseInt(size.width / baseDensity * density, 10)
          const ext = path.extname(file)
          const fileName = path.basename(file, ext) + '@' + density + 'x' + ext
          const filePath = path.join(path.dirname(file), fileName)
          if (fs.existsSync(filePath)) {
            resolve()
            return 
          }
          img.resize(
            width, null).write(filePath, function (err) {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
        })
      })
      promises.push(promise)
    })
  }).on('end', function () {
    Promise.all(promises).then(callback).catch(function (err) {
      throw err
    })
  })
}
