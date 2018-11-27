const querystring = require('querystring')
const weixin = require('weixin-js-sdk')

let shareMenus = ['menuItem:share:appMessage',
  'menuItem:share:timeline',
  'menuItem:share:qq',
  'menuItem:share:weiboApp',
  'menuItem:share:facebook',
  'menuItem:share:QZone']
const defaultJsApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'showMenuItems',
  'hideMenuItems',
  'openLocation',
  'getLocation',
  'previewImage',
  'chooseWXPay',
  'scanQRCode']

export default {
  jsapi: weixin,
  signer: null,
  isInWeixin () {
    if (!weixin) {
      return false
    }
    return /micromessenger/.test(window.navigator.userAgent.toLowerCase())
  },
  login (next, to, {
    relativePath,
    redirectUri,
    wechatAppid,
    state = ''}, scope = 'snsapi_base') {
    // 构建登录后的跳转页面地址
    let query = to.query || {}
    delete query['code']
    query = querystring.stringify(query || {})
    let nextPath = relativePath + '#' + to.path
    if (query && query.length > 0) {
      nextPath += '?' + query
    }

    // 微信回调不支持 hash 模式, 将回调跳转到后端, 由后端完成跳转
    redirectUri = redirectUri + 'next=' + encodeURIComponent(nextPath)

    // 使用微信登录
    next(false)
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize' +
      '?appid=' + wechatAppid +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&response_type=code' +
      '&scope=' + scope +
      '&state=' + state +
      '#wechat_redirect'
  },
  loginGuard (next, to, validator, callback, configs) {
    let code = to.query.code
    if (code && code.length > 0) {
      validator(code).then((res) => {
        const scope = callback(res)
        if (scope) {
          this.login(next, to, configs, 'snsapi_userinfo')
        } else {
          let query = to.query || {}
          delete query['code']
          next({
            name: to.name,
            query: query,
            params: to.params
          })
        }
      }).catch((err) => {
        console.error(err)
        next(false)
      })
    } else {
      this.login(next, to, configs)
    }
  },
  config (callback, withHash = false, debug = false, jsApiList = defaultJsApiList) {
    if (!this.isInWeixin()) {
      return
    }
    if (!this.signer) {
      throw new Error('没有配置微信签名接口')
    }
    weixin.ready(callback)
    weixin.error(callback)
    let url
    if (withHash) {
      url = window.location.href
    } else {
      url = window.location.href.split('#')[0]
    }
    let args = []
    if (arguments.length > 3) {
      args = [...arguments].splice(3)
    }
    this.signer(url, args).then((response) => {
      let config = response.data
      config.debug = debug
      config.jsApiList = jsApiList
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
    this.enableShare()
    weixin.onMenuShareTimeline(config)
    weixin.onMenuShareAppMessage(config)
    weixin.onMenuShareQQ(config)
    weixin.onMenuShareWeibo(config)
    weixin.onMenuShareQZone(config)
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
