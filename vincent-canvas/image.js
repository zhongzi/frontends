module.exports = {
  compile: function(template, variable) {
    return Object.assign(template, {
      src: variable
    })
  },
  draw: function(ctx, config) {
    return new Promise(function(resolve, reject) {
      if (!config.src || config.src.length === 0) {
        resolve()
        return
      }
      var inMiniApp = typeof wx !== 'undefined'
      if (inMiniApp && wx.downloadFile && config.src.indexOf('http') === 0) {
        wx.downloadFile({
          url: config.src,
          success: function(res) {
            ctx.drawImage(res.tempFilePath, config.x, config.y, config.width, config.height)
            resolve()
          },
          fail: reject
        })
      } else {
        if (inMiniApp) {
          ctx.drawImage(config.src, config.x, config.y, config.width, config.height)
          resolve()
        } else {
          var img = new Image
          img.onload = function() {
            ctx.drawImage(img, config.x, config.y, config.width, config.height)
            resolve()
          }
          img.onerror = function(e) {
            resolve(e)
          }
          img.setAttribute('crossOrigin', 'anonymous');
          img.src = config.src
        }
      }
    })
  }
}
