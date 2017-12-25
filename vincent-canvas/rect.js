export default {
  compile: function (template, variable) {
    return Object.assign(template, {
      color: variable
    })
  },
  draw: function (ctx, config) {
    if (config.color) {
      ctx.setFillStyle(config.color)
      ctx.fillRect(config.x, config.y, config.width, config.height)
    }
    if (config.stroke) {
      ctx.setStrokeStyle(config.stroke)
      ctx.strokeRect(config.x, config.y, config.width, config.height)
    }
  }
}
