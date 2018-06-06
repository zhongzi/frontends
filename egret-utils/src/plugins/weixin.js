import weixin from '../weixin'

export default {
  install (Vue) {
    Vue.prototype.$weixin = weixin
    Vue.$weixin = weixin
  },
  $weixin: weixin
}
