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
  compile: function (template, variables) {
    var compileds = []
    template.components.map(function (component) {
      var drawer = drawers[component.type]
      if (!drawer) {
        return
      }
      var compiled
      var variable = variables[component.name]
      if (drawer.compile && variable) {
        compiled = drawer.compile(component, variable)
      } else {
        compiled = component
      }
      compileds.push(compiled)
    })
    return {
      components: compileds
    }
  },
  generate: function (ctx, template, variables, success, fail, wait) {
    var config = this.compile(template, variables)
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
