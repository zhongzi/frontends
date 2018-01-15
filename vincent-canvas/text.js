var utils = require('./utils')

module.exports = {
  compile: function (ctx, template, variable, scale) {
    var compiled = Object.assign({}, template, {
      text: variable
    })
    // 计算宽度 / 高度
    if (!utils.inMiniApp) {
      if (template.size) {
        ctx.setFontSize(template.size * scale)
      }
      if (template.weight && ctx.setFontWeight) {
        ctx.setFontWeight(template.weight)
      }
      var size = ctx.measureText(compiled.text)
      compiled.measureWidth = size.width
      compiled.height = compiled.size
    }
    return compiled
  },
  draw: function(ctx, config) {
    return new Promise(function (resolve) {
      var x = config.x
      var y = config.y
      var limtedLines = []
      if (config.text) {
        if (config.size) {
          ctx.setFontSize(config.size)
        }
        if (config.weight && ctx.setFontWeight) {
          ctx.setFontWeight(config.weight)
        }
        ctx.setFillStyle(config.color || '#00000')
        ctx.setTextBaseline(config.baseline || 'top')
        ctx.setTextAlign(config.align || 'left')
        var text = config.text + ''
        var lines = text.split('\n')
        lines.some(function (line) {
          if (config.limit && line.length > config.limit) {
            if (config.line) {
              for (var i = 0; i + 1 < config.line; i += 1) {
                var limtedLine = line.substr(0, config.limit)
                limtedLines.push(limtedLine)
                line = line.substr(config.limit)
                if (line.length < config.limit) {
                  break
                }
              }
            }
            if (line.length > config.limit) {
              line = line.substr(0, config.limit - 1) + '...' 
            }
            limtedLines.push(line)
          } else {
            limtedLines.push(line)
          }
          return config.line && limtedLines.length >= config.line
        })
        
        limtedLines.map(function (line) {
          var needRestore = false
          if (config.shadow && !utils.inMiniApp) {
            ctx.save()
            var shadow = config.shadow
            ctx.shadowColor=shadow.color
            ctx.shadowOffsetX = shadow.offsetX || 0
            ctx.shadowOffsetY = shadow.offsetY || 0
            ctx.shadowBlur=shadow.blur
            needRestore = true
          }
          ctx.fillText(line, x, y)
          if (needRestore) {
            ctx.restore()
          }
          y += config.size + (config.space||0)
        })
      }
      resolve()
    })
  }
}
