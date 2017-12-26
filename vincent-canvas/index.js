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
  compile: function (template, variables, scale) {
    var compileds = []
    template.components.map(function (component) {
      var drawer = drawers[component.type]
      if (!drawer) {
        return
      }
      var location = {}
      if (scale > 1) {
        location = {
          x: component.x * scale,
          y: component.y * scale
        }
        if (component.width) {
          location.width = component.width * scale
        }
        if (component.height) {
          location.height = component.height * scale
        }
        if (component.size) {
          location.size = component.size * scale
        }
      }

      var compiled
      var variable = variables[component.name]
      if (drawer.compile && variable) {
        compiled = drawer.compile(component, variable)
        compiled = Object.assign(compiled, location)
      } else {
        compiled = Object.assign({}, component, location)
      }
      compileds.push(compiled)
    })
    return {
      components: compileds
    }
  },
  generate: function (ctx, template, variables, scale, success, fail, wait) {
    scale = scale || 1
    var config = this.compile(template, variables, scale)
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
