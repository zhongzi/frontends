import { mapGetters } from 'vuex'

export default function ({module, method, key, property, text, onlyIfEmpty}) {
  var getter
  switch (method) {
    case 'get':
      getter = 'getErrorById'
      break
    case 'list':
      getter = 'getListErrorByTag'
      break
    case 'save':
      getter = 'getSaveErrorById'
      break
    case 'delete':
      getter = 'getDeleteErrorById'
      break
  }
  text = text || '请稍后重试 ...'
  var tagIdentical = ''
  if (property) {
    tagIdentical = 'property_' + property
  } else if (key) {
    tagIdentical = 'key_' + key
  }
  const mapName = ['_error', module, method, tagIdentical].join('_')
  const tagName = [mapName, 'tag'].join('_')
  const propertyName = [mapName, 'property'].join('_')
  return {
    computed: {
      ...mapGetters(module, {
        [mapName]: getter
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
      [propertyName] (err) {
        if (err) {
          this.$toast.error(err, text)
        } else {
          this.$toast.hide()
        }
      }
    },
    deactivated () {
      this.$toast.hide()
    },
    beforeDestroy () {
      this.$toast.hide()
    }
  }
}
