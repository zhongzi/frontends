const path = require('path')
const fs = require('fs')
const glob = require('glob')
const gm = require('gm')

module.exports = function (callback, baseDensity=3, densities = [1, 2], dir='src/assets/', ext='.png') {
  glob(dir + '*' + ext, {}, function (err, files) {
    const promises = files.reduce(function (promises, file) {
      if (file.indexOf('@') >= 0) {
        return promises
      }
      densities.forEach(function (density) {
        const promise = new Promise(function (resolve, reject) {
          const img = gm(file)
          img.size(function (err, size) {
            if (err) {
              reject(err)
              return
            }
            const width = parseInt(size.width / baseDensity * density, 10)
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
      return promises
    }, [])
    Promise.all(promises).then(callback).catch(function (err) {
      throw err
    })
  })
}
