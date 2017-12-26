module.exports = {
  compile: function (template, variable) {
    return Object.assign({}, template, {
      text: variable
    })
  },
  draw: function(ctx, config) {
    return new Promise(function (resolve) {
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
        var text = config.text
        const x = config.x
        var y = config.y
        var lines = text.split('\n')
        var limtedLine = []
        lines.map(function (line) {
          if (config.limit && line.length > config.limit) {
            if (config.line) {
              for (var i = 0; i + 1 < config.line; i += 1) {
                var limitedLine = line.substr(0, config.limit)
                limtedLine.push(limitedLine)
                line = line.substr(config.limit)
                if (line.length < config.limit) {
                  break
                }
              }
            }
            if (line.length > config.limit) {
              line = line.substr(0, config.limit - 1) + '...' 
            }
            limtedLine.push(line)
          } else {
            limtedLine.push(line)
          }
        })
        
        limtedLine.map(function (line) {
          ctx.fillText(line, x, y)
          y += config.size + (config.space||0)
        })
      }
      resolve()
    })
  }
}
