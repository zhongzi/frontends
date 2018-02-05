export default {
  install (Vue, options = {}) {
    const vue = new Vue()
    const toast = {
      info (text, options) {
        options = Object.assign({
          text: text,
          width: '95%',
          position: 'top'
        }, options)
        vue.$jui.toast.show(options)
      },
      error (errOrText, fallback) {
        if (errOrText.response && errOrText.response.data && errOrText.response.data.message) {
          errOrText = errOrText.response.data.message
        }
        if (errOrText.message) {
          errOrText = errOrText.message
        }
        if (!errOrText || errOrText.length === 0) {
          errOrText = fallback || '请稍后重试'
        }
        vue.$jui.toast.show({
          text: errOrText,
          color: '#F43530',
          width: '95%',
          position: 'top'
        })
      },
      hide () {
        if (this.$jui && this.$jui.toast) {
          this.$jui.toast.hide()
        }
      }
    }
    Vue.toast = toast
    Vue.prototype.$toast = toast
  }
}
