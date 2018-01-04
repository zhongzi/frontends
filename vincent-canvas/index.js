var image = require('./image')
var rect = require('./rect')
var text = require('./text')

var drawers = {
  image: image,
  rect: rect,
  text: text
}

var inMiniApp = (typeof wx !== 'undefined')
if (!inMiniApp) {
  var patch = require('./patch')
  patch()
}

module.exports = {
  compile: function (template, variables, overrides, scale) {
    var compileds = []
    template.components.map(function (component) {
      var drawer = drawers[component.type]
      if (!drawer) {
        return
      }

      var compiled
      var variable = variables[component.name]
      var override = overrides[component.name]
      if (drawer.compile && variable) {
        compiled = drawer.compile(component, variable)
      } else {
        compiled = Object.assign({}, component)
      }

      if (override) {
        compiled = Object.assign(compiled, override)
      }

      if (scale > 1) {
        compiled.x = compiled.x * scale
        compiled.y = compiled.y * scale
        if (compiled.width) {
          compiled.width = compiled.width * scale
        }
        if (compiled.height) {
          compiled.height = compiled.height * scale
        }
        if (compiled.size) {
          compiled.size = compiled.size * scale
        }
      }
      
      compileds.push(compiled)
    })
    return {
      components: compileds
    }
  },
  generate: function (ctx, template, variables, overrides, scale, success, fail, wait) {
    scale = scale || 1
    var config = this.compile(template, variables, overrides, scale)
    var currentPromise = null
    config.components.map(function (component) {
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
      if (inMiniApp && wx.canvasToTempFilePath) {
        ctx.draw()
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: ctx.canvasId,
            success: function (res) {
              success(res.tempFilePath)
            },
            fail: fail
          })
        }, wait || 0)
      } else {
        success(ctx.canvas.toDataURL())
      }
    }).catch(fail)
  }
}
