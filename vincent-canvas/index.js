import image from './image'
import rect from './rect'
import text from './text'

var drawers = {
  image: image,
  rect: rect,
  text: text
}

export default {
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
  generate: function (ctx, template, variables, success, fail) {
    var config = this.compile(template, variables)
    var promises = []
    config.components.map(function (component) {
      var drawer = drawers[component.type]
      if (!drawer) {
        return
      }
      var promise = drawer.draw(ctx, component)
      if (promise) {
        promises.push(promise)
      }
    })
    Promise.all(promises).then(function () {
      ctx.draw()
      if (wx.canvasToTempFilePath) {
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: ctx.canvasId,
            success: function (res) {
              success(res.tempFilePath)
            },
            fail: fail
          })
        }, 1000)
      } else {
        success(ctx.canvas.toDataURL())
      }
    }).catch(fail)
  }
}
