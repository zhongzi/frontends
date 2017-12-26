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

  CanvasRenderingContext2D.prototype.setFontSize = function (size) {
    var fontArgs = this.font.split(' ')
    this.font = size + 'px ' + fontArgs[fontArgs.length - 1]
  }
}
