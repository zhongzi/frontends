<template>
<j-popup class="j-ui-popup-calendar" position='bottom' :closable="closable" :header="true" :on-confirm="onConfirm" v-model="currentShow">
  <calendar :lunar="lunar" v-model="currentValue" :range="true" />
</j-popup>
</template>

<script>
import { VModelMixinNoEmit } from '../mixins/v-model.js'

import Calendar from 'vue-calendar/src/calendar.vue'
import JPopup from './popup'

export default {
  mixins: [VModelMixinNoEmit],
  components: {
    JPopup,
    Calendar
  },
  props: {
    value: Array,
    range: {
      type: Boolean,
      default: false
    },
    lunar: {
      Boolean,
      default: false
    },
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
    }
  },
  data () {
    return {
      currentShow: false
    }
  },
  watch: {
    show (val) {
      this.currentShow = val
    },
    currentShow (val) {
      this.$emit(val ? 'on-show' : 'on-hide')
    }
  },
  methods: {
    onConfirm () {
      this.$emit('input', this.currentValue)
      this.currentShow = false
    }
  }
}
</script>

<style lang="less">
</style>
