var res = require('res')

var densities = [1, 2, 3]

function bestDensity () {
  var systemDppx = res.dppx() || 1
  var currentDistance = 1000
  var bestDensity = 1
  densities.forEach(function (density) {
    var distance = Math.abs(density - systemDppx)
    if (distance < currentDistance) {
      bestDensity = density
      currentDistance = distance
    }
  })
  return bestDensity
}

module.exports = {
  install (Vue, options = {}) {
    Object.defineProperty(Vue.prototype, '$density', {
      get () {
        return bestDensity()
      }
    })

    Object.defineProperty(Vue.prototype, '$densityStr', {
      get () {
        var density = bestDensity()
        if (density === 3) {
          return ''
        }
        return '@' + density + 'x'
      }
    })
  }
}
