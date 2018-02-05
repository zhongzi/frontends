function destroyWatcher () {
  this._unwatch$route && this._unwatch$route()
  this._unwatch$route = null
}

function install (Vue) {
  if (install.installed) return
  install.installed = true

  Vue.config.optionMergeStrategies.fetchRouteData = function (toVal, fromVal) {
    if (!toVal) return fromVal
    if (!fromVal) return toVal
    return function () {
      toVal.apply(this)
      return fromVal.apply(this)
    }
  }

  const mixin = {
    created: initWatcher,
    beforeDestroy: destroyWatcher,
    activated: initWatcher,
    deactivated: destroyWatcher
  }
  Vue.mixin(mixin)

  function initWatcher () {
    if (this.$options.fetchRouteData && !this._unwatch$route) {
      this._unwatch$route = this.$watch(
        '$route',
        function () {
          var promise = this.$options.fetchRouteData.apply(this, arguments)
          if (promise) {
            Vue.set(this, 'loadingRouteData', true)
            Promise.resolve(promise).then(() => Vue.set(this, 'loadingRouteData', false))
          }
        }, { immediate: true }
      )
    }
  }
}

export default {
  install
}
