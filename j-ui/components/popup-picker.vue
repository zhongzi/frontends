<template>
<j-popup class="j-ui-popup-picker" position='bottom' :closable="closable" :header="true" :on-confirm="onConfirm" v-model="currentShow">
  <j-picker v-model="currentValue" :autoInit="false" :data="data" :textKey="textKey" ref="picker" />
</j-popup>
</template>

<script>
import { VModelMixinNoEmit } from '../mixins/v-model.js'
import JPopup from './popup'
import JPicker from './picker'

export default {
  mixins: [VModelMixinNoEmit],
  components: {
    JPopup,
    JPicker
  },
  props: {
    value: Array,
    show: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    header: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    data: {
      type: Array,
      required: true
    },
    textKey: String
  },
  data () {
    return {
      currentShow: false
    }
  },
  watch: {
    show (val) {
      this.currentShow = val
      if (!val) {
        return
      }
      let picker = this.$refs.picker
      if (!picker) {
        return
      }
      picker.refresh(0)
    },
    currentShow (val) {
      this.$emit(val ? 'on-show' : 'on-hide')
    }
  },
  methods: {
    onConfirm () {
      let picker = this.$refs.picker
      if (picker) {
        picker.update()
      }
      this.$emit('input', this.currentValue)
      this.currentShow = false
    }
  }
}
</script>

<style lang="less">
.j-ui-popup-picker {
  .j-ui-picker {
    background-color: #eeeeee;
  }
}
</style>
