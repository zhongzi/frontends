<template>
  <div class="j-ui-dialog" @touchmove="onTouchMove">
    <transition :name="maskTransition">
      <div class="weui-mask" @click="hideOnBlur && (currentValue = false)" v-show="currentValue" :style="maskStyleWithZIndex"></div>
    </transition>
    <transition :name="dialogTransition">
      <div class="weui-dialog" v-show="currentValue" :style="dialogStyleWithZIndex">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: null
    },
    maskTransition: {
      type: String,
      default: 'j-ui-mask'
    },
    dialogTransition: {
      type: String,
      default: 'j-ui-transition-dialog'
    },
    hideOnBlur: Boolean,
    dialogStyle: Object,
    maskStyle: Object,
    scroll: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.currentValue = val
      },
      immediate: true
    },
    currentValue (val) {
      this.$emit(val ? 'on-show' : 'on-hide')
      this.$emit('input', val)
    }
  },
  data () {
    return {
      currentValue: false
    }
  },
  computed: {
    dialogStyleWithZIndex () {
      let style = this.dialogStyle
      if (!style) {
        if (!this.zIndex) {
          return null
        }
        style = {}
      }
      if (this.zIndex) {
        style['zIndex'] = this.zIndex
      }
      return style
    },
    maskStyleWithZIndex () {
      let style = this.maskStyle
      if (!style) {
        if (!this.zIndex) {
          return null
        }
        style = {}
      }
      if (this.zIndex) {
        style['zIndex'] = this.zIndex - 1
      }
      return style
    }
  },
  methods: {
    onTouchMove: function (event) {
      !this.scroll && event.preventDefault()
    }
  }
}
</script>

<style lang="less">
@import '~weui/src/style/widget/weui-tips/weui-mask.less';
@import '~weui/src/style/widget/weui-tips/weui-dialog.less';
@import '../styles/transitions/mask.less';
@import "../styles/variables/z-index.less";

.j-ui-transition-dialog-enter-active, .j-ui-transition-dialog-leave-active {
  opacity: 1;
  transition-duration: 400ms;
  transform: translate(-50%, -50%) scale(1)!important;
  transition-property: transform, opacity!important;
}
.j-ui-transition-dialog-leave-active {
  transition-duration: 300ms;
}
.j-ui-transition-dialog-enter {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.185)!important;
}
.j-ui-transition-dialog-leave-active {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.85)!important;
}
.j-ui-dialog {
  .weui-mask {
    z-index: (@dialog-z-index - 1)
  }
  .weui-dialog {
    z-index: @dialog-z-index;
  }
}
</style>
