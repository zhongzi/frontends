<template>
<div class="j-ui-cell-popup-picker">
  <j-cell-input :title="title" :value="text" :height="height" :required="required" :readonly="true" :disabled="true" :placeholder="placeholder" @click.native="onPopupPicker">
    <i slot="right" class="iconfont icon-next"></i>
  </j-cell-input>
  <j-popup-picker :show='popupVisible' @on-hide="popupVisible = false" :data="[data]" :textKey="textKey" v-model="selectedIndexes"></j-popup-picker>
</div>
</template>

<script>
import JCellInput from './cell-input'
import JPopupPicker from './popup-picker'
export default {
  components: {
    JCellInput,
    JPopupPicker
  },
  props: {
    title: String,
    value: {
      type: [Object, String],
      default: null
    },
    textKey: String,
    data: {
      type: Array,
      default: []
    },
    height: {
      type: String,
      default: '1.5em'
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  data () {
    return {
      popupVisible: false,
      selectedIndex: null
    }
  },
  computed: {
    text () {
      let currentValue = this.currentValue
      if (!currentValue) {
        return ''
      }
      if (this.textKey && this.textKey.length > 0) {
        return currentValue[this.textKey]
      }
      return currentValue
    },
    selectedIndexes: {
      get () {
        if (!this.selectedIndex) {
          return []
        }
        return ['' + this.selectedIndex]
      },
      set (val) {
        if (val && val.length > 0) {
          this.selectedIndex = parseInt(val[0])
        } else {
          this.selectedIndex = 0
        }
      }
    },
    currentValue () {
      if (this.selectedIndex === null) {
        return null
      }
      return this.data[this.selectedIndex]
    },
    onPopupPicker () {
      if (this.readonly) {
        return
      }
      this.popupVisible = true
    }
  },
  methods: {
    valueChanged (val) {
      let index = null
      if (val) {
        index = this.data.indexOf(val)
        if (index < 0) {
          index = 0
        }
      }
      this.selectedIndex = index
    }
  },
  watch: {
    value (val) {
      this.valueChanged(val)
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  created () {
    this.valueChanged(this.value)
  },
  mounted () {
    this.$emit('input', this.currentValue)
  }
}
</script>

<style lang="less">
</style>
