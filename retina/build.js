const path = require('path')
const fs = require('fs')
const glob = require('glob')
const sharp = require('sharp')

module.exports = function (callback, baseDensity=3, densities = [1, 2], dir='src/assets/', ext='.png') {
  glob(dir + '*' + ext, {}, function (er, files) {
    const promises = files.reduce(function (promises, file) {
      if (file.indexOf('@') >= 0) {
        return promises
      }
      densities.forEach(function (density) {
        const promise = new Promise(function (resolve, reject) {
          const img = sharp(file)
          img.metadata().then(function (metadata) {
            const width = parseInt(metadata.width / baseDensity * density, 10)
            const fileName = path.basename(file, ext) + '@' + density + 'x' + ext
            const filePath = path.join(path.dirname(file), fileName)
            if (fs.existsSync(filePath)) {
              resolve()
              return 
            }
            img.clone().resize(
              width, null).toFile(filePath).then(resolve).catch(reject)
          }).catch(reject)
        })
        promises.push(promise)
      })
      return promises
    }, [])
    Promise.all(promises).then(callback).catch(function (err) {
      throw err
    })
  })
}
