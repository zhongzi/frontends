export default {
  compile: function (template, variable) {
    return Object.assign(template, {
      src: variable
    })
  },
  draw: function (ctx, config) {
    if (!config.src || config.src.length === 0) {
      return
    }
    if (wx.downloadFile && config.src.indexOf('http') === 0) {
      return new Promise(function(resolve, reject) {
        wx.downloadFile({
          url: config.src,
          success: function (res) {
            ctx.drawImage(res.tempFilePath, config.x, config.y, config.width, config.height)
            resolve()
          },
          fail: reject
        })
      })
    } else {
      ctx.drawImage(config.src, config.x, config.y, config.width, config.height)
    }
  }
}
