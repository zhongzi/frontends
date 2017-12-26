module.exports = {
  compile: function(template, variable) {
    return Object.assign({}, template, {
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
      var isRemote = (config.src.indexOf('http://') === 0 || config.src.indexOf('https://') === 0)
      if (inMiniApp && wx.downloadFile && isRemote) {
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
            var width = config.width
            if (!width && config.height) {
              width = config.height/img.height*img.width
            }
            var height = config.height
            if (!height && config.width) {
              height = config.width/img.width*img.height
            }
            if (width && height) {
              var canvasAspect = width/height
              var imageAspect = img.width/img.height
              var scale
              if (canvasAspect < imageAspect) {
                scale = height/img.height
              } else {
                scale = width/img.width
              }
              var imgWidth = width/scale
              var imgHeight = height/scale
              ctx.drawImage(img,
                (img.width - imgWidth) * 0.5,
                (img.height - imgHeight) * 0.5,
                imgWidth, imgHeight,
                config.x, config.y, width, height)
            } else {
              ctx.drawImage(img, config.x, config.y)
            }
            resolve()
          }
          img.onerror = function(e) {
            resolve(e)
          }
          img.setAttribute('crossOrigin', 'anonymous')
          img.src = config.src
        }
      }
    })
  }
}
