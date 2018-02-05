export default {
  install (Vue, options) {
    const bus = new Vue()
    Vue.bus = bus
    Vue.prototype.$bus = bus
  }
}
