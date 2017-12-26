var fontSizeTag = 'px'
var fontWeightTags = ['normal', 'bold', 'lighter', 'bolder']

function isInt(value) {
  var x
  if (isNaN(value)) {
    return false
  }
  x = parseFloat(value)
  return (x | 0) === x
}

module.exports = function () {
  CanvasRenderingContext2D.prototype.setFillStyle = function (color) {
    this.fillStyle = color
  }

  CanvasRenderingContext2D.prototype.setStrokeStyle = function (color) {
    this.strokeStyle = color
  }

  CanvasRenderingContext2D.prototype.setTextBaseline = function (baseline) {
    this.textBaseline = baseline
  }

  CanvasRenderingContext2D.prototype.setTextAlign = function (textAlign) {
    this.textAlign = textAlign
  }

  CanvasRenderingContext2D.prototype.setFontWeight = function (weight) {
    var fontArgs = this.font.split(' ')
    var index = fontArgs.findIndex(function (fontArg) {
      return fontWeightTags.indexOf(fontArg) != -1 || isInt(fontArg)
    })
    if (index === -1) {
      fontArgs.splice(0, 0, weight + '')
    } else {
      fontArgs[index] = weight + ''
    }
    this.font = fontArgs.join(' ')
  }

  CanvasRenderingContext2D.prototype.setFontSize = function (size) {
    var fontArgs = this.font.split(' ')
    var index = fontArgs.findIndex(function (fontArg) {
      return fontArg.indexOf(fontSizeTag) === fontArg.length - fontSizeTag.length
    })
    if (index === -1) {
      return
    }
    fontArgs[index] = size + 'px'
    this.font = fontArgs.join(' ')
  }
}
