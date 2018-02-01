var image = require('./image')
var rect = require('./rect')
var text = require('./text')
var utils = require('./utils')

if (!utils.inMiniApp) {
  var patch = require('./patch')
  patch()
}

var drawers = {
  image: image,
  rect: rect,
  text: text
}

module.exports = {
  compile: function (ctx, template, variables, overrides, scale) {
    var compileds = []
    template.components.forEach(function (component, index) {
      var drawer = drawers[component.type]
      if (!drawer) {
        return
      }

      var compiled
      var variable = variables[component.name]
      var override = overrides[component.name]
      if (drawer.compile && variable != undefined) {
        compiled = drawer.compile(ctx, component, variable, scale)
      } else {
        compiled = Object.assign({}, component)
      }

      if (override) {
        compiled = Object.assign(compiled, override)
      }

      var x = 0
      var y = 0
      if (index > 0) {
        var previsouCompiled = compileds[index - 1]
        x = previsouCompiled.x + previsouCompiled.width
        y = previsouCompiled.y + previsouCompiled.height
      }
      if (compiled.x != undefined) {
        compiled.x = compiled.x * scale
      } else if (compiled.offsetX != undefined) {
        compiled.x = x + compiled.offsetX * scale
      }
      if (compiled.y != undefined) {
        compiled.y = compiled.y * scale
      } else if (compiled.offsetY != undefined) {
        compiled.y = y + compiled.offsetY * scale
      }
      if (compiled.width != undefined) {
        compiled.width = compiled.width * scale
      } else if (compiled.measureWidth != undefined) {
        compiled.width = compiled.measureWidth
      }
      if (compiled.height != undefined) {
        compiled.height = compiled.height * scale
      } else if (compiled.measureHeight != undefined) {
        compiled.height = compiled.measureHeight
      }
      if (compiled.size != undefined) {
        compiled.size = compiled.size * scale
      }
      compileds.push(compiled)
    })
    return {
      components: compileds
    }
  },
  generate: function (ctx, template, variables, overrides, scale, success, fail, options) {
    if (!options) {
      options = {}
    }
    scale = scale || 1
    var config = this.compile(ctx, template, variables, overrides, scale)
    var currentPromise = null
    config.components.forEach(function (component) {
      var drawer = drawers[component.type]
      if (!drawer) {
        return
      }
      if (currentPromise) {
        currentPromise = currentPromise.then(function () {
          return drawer.draw(ctx, component)
        })
      } else {
        currentPromise = drawer.draw(ctx, component)
      }
    })

    currentPromise.then(function () {
      if (utils.inMiniApp && wx.canvasToTempFilePath) {
        ctx.draw()
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: ctx.canvasId,
            success: function (res) {
              success(res.tempFilePath)
            },
            fail: fail
          }, options.this)
        }, options.wait || 0)
      } else {
        success(ctx.canvas.toDataURL())
      }
    }).catch(fail)
  }
}
