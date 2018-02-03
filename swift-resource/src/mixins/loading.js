import { mapGetters } from 'vuex'

const defaults = {
  get: '加载中',
  list: '加载中',
  save: '正在保存',
  delete: '正在删除'
}

var _loadingStatus_ = new Set()

export default function ({module, method, key, property, text, onlyIfEmpty}) {
  var getter
  switch (method) {
    case 'get':
      getter = 'getLoadingById'
      break
    case 'list':
      getter = 'getListLoadingByTag'
      break
    case 'save':
      getter = 'getSaveLoadingById'
      break
    case 'delete':
      getter = 'getDeleteLoadingById'
      break
  }
  text = text || defaults[method]
  var tagIdentical = ''
  if (property) {
    tagIdentical = 'property_' + property
  } else if (key) {
    tagIdentical = 'key_' + key
  }
  const mapName = ['_loading', module, method, tagIdentical].join('_')
  const tagName = [mapName, 'tag'].join('_')
  const propertyName = [mapName, 'property'].join('_')
  const listMapName = [mapName, 'list'].join('_')
  return {
    computed: {
      ...mapGetters(module, {
        [mapName]: getter,
        [listMapName]: 'getListByTag'
      }),
      [tagName] () {
        var tag = ''
        if (property) {
          tag = this[property]
        } else if (key) {
          tag = '' + key
        }
        return tag
      },
      [propertyName] () {
        return this[mapName](this[tagName])
      }
    },
    watch: {
      [propertyName] (loading) {
        if (loading) {
          if (onlyIfEmpty === true) {
            const list = this[listMapName](this[tagName])
            if (list.length > 0) {
              return
            }
          }
          _loadingStatus_.add(propertyName)
          this.$jui.loading.show({
            text: text
          })
        } else {
          _loadingStatus_.delete(propertyName)
          if (_loadingStatus_.size === 0) {
            this.$jui.loading.hide()
          }
        }
      }
    },
    deactivated () {
      this.$jui.loading.hide()
    },
    beforeDestroy () {
      this.$jui.loading.hide()
    }
  }
}
