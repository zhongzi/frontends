<template>
  <j-dialog
  v-model="showValue"
  mask-transition="j-ui-fade"
  :hide-on-blur="hideOnBlur"
  :zIndex="zIndex"
  @on-hide="$emit('on-hide')"
  @on-show="$emit('on-show')">
    <div class="weui-dialog__hd" v-if="!!title"><strong class="weui-dialog__title">{{title}}</strong></div>
    <div class="weui-dialog__bd" v-if="!showInput">
      <slot>
        <div v-html="content"></div>
      </slot>
    </div>
    <div v-else class="j-ui-prompt">
      <input class="j-ui-prompt-msgbox" v-model="msg" :placeholder="placeholder" ref="input"/>
    </div>
    <div class="weui-dialog__ft">
      <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="_onCancel">{{cancelText}}</a>
      <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="_onConfirm">{{confirmText}}</a>
    </div>
  </j-dialog>
</template>

<script>
import JDialog from './dialog'

export default {
  components: {
    JDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: null
    },
    showInput: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'ios'
    },
    hideOnBlur: {
      type: Boolean,
      default: false
    },
    title: String,
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    maskTransition: {
      type: String,
      default: 'j-ui-fade'
    },
    dialogTransition: {
      type: String,
      default: 'j-ui-transition-dialog'
    },
    content: String,
    closeOnConfirm: {
      type: Boolean,
      default: true
    }
  },
  created () {
    if (this.value) {
      this.showValue = this.value
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
      if (val && this.showInput) {
        this.msg = ''
        setTimeout(() => {
          if (this.$refs.input) {
            this.$refs.input.focus()
          }
        }, 300)
      }
    }
  },
  data () {
    return {
      msg: '',
      showValue: false
    }
  },
  methods: {
    _onConfirm () {
      if (this.closeOnConfirm) {
        this.showValue = false
      }
      this.$emit('on-confirm', this.msg)
    },
    _onCancel () {
      this.showValue = false
      this.$emit('on-cancel')
    }
  }
}
</script>

<style lang="less">
@import '../styles/transitions/fade.less';

.j-ui-prompt {
  padding-bottom: 1.6em;
  .j-ui-prompt-msgbox {
    width: 80%;
    border: 1px solid #dedede;
    border-radius: 5px;
    padding: 4px 5px;
    appearance: none;
    outline: none;
    font-size: 16px;
  }
}
</style>
