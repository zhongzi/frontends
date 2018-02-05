let weixin = require('weixin-js-sdk')

let shareMenus = ['menuItem:share:appMessage',
  'menuItem:share:timeline',
  'menuItem:share:qq',
  'menuItem:share:weiboApp',
  'menuItem:share:facebook',
  'menuItem:share:QZone']

export default {
  jsapi: weixin,
  signer: null,
  isInWeixin () {
    if (!weixin) {
      return false
    }
    return /micromessenger/.test(window.navigator.userAgent.toLowerCase())
  },
  config (callback, withHash = false,
    permissions=['openLocation', 'previewImage', 'chooseWXPay']) {
    if (!this.isInWeixin()) {
      return
    }
    weixin.ready(() => {
      callback()
    })
    weixin.error((res) => {
      console.log('[Weixin]error ' + JSON.stringify(res))
    })
    let url
    if (withHash) {
      url = window.location.href
    } else {
      url = window.location.href.split('#')[0]
    }
    if (!this.signer) {
      throw new Error('没有配置微信签名接口')
    }
    this.signer(url).then((response) => {
      let config = response.data
      config.debug = process.env.NODE_ENV !== 'production'
      config.jsApiList = ['onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'showMenuItems',
        'hideMenuItems'] + permissions
      weixin.config(config)
    })
  },
  disableShare () {
    weixin.hideMenuItems({
      menuList: shareMenus
    })
  },
  enableShare () {
    weixin.showMenuItems({
      menuList: shareMenus
    })
  },
  configShare (config) {
    // 分享
    weixin.onMenuShareTimeline(config)
    weixin.onMenuShareAppMessage(config)
    weixin.onMenuShareQQ(config)
    weixin.onMenuShareWeibo(config)
    weixin.onMenuShareQZone(config)
    this.enableShare()
  },
  clearShare () {
    this.configShare({})
  },
  // 打开微信地图
  openLocation (config) {
    weixin.openLocation({
      latitude: config.latitude, // 纬度，浮点数，范围为90 ~ -90
      longitude: config.longitude, // 经度，浮点数，范围为180 ~ -180。
      name: config.name, // 位置名
      address: config.address, // 地址详情说明
      scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    })
  },
  previewImage (curUrl, urls) {
    weixin.previewImage({
      current: curUrl, // 当前图片路径
      urls: urls // 图片路径集合(Json)
    })
  }
}
