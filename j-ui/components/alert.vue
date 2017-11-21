<template>
<j-dialog v-model="showValue" @on-hide="$emit('on-hide')" @on-show="$emit('on-show')">
  <div class="weui-dialog__hd">
    <strong class="weui-dialog__title">{{title}}</strong>
  </div>
  <div class="weui-dialog__bd">
    <slot>
      <div v-html="content"></div>
    </slot>
  </div>
  <div class="weui-dialog__ft">
    <a href="javascript:;"
    class="weui-dialog__btn weui-dialog__btn_primary"
    @click="_onHide">{{buttonText}}</a>
  </div>
</j-dialog>
</template>

<script>
import JDialog from './dialog'

export default {
  components: {
    JDialog
  },
  created () {
    if (typeof this.value !== 'undefined') {
      this.showValue = this.value
    }
  },
  props: {
    value: Boolean,
    title: String,
    content: String,
    buttonText: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      showValue: false
    }
  },
  methods: {
    _onHide () {
      this.showValue = false
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less">
</style>
