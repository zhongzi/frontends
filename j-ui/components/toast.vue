<template>
  <div class="j-ui-toast">
    <div class="weui-mask_transparent" v-show="isShowMask && show"></div>
    <transition :name="currentTransition">
      <div class="weui-toast" :class="toastClass" :style="toastStyle" v-show="show">
        <i class="iconfont weui-icon_toast" :class="icon" v-if="icon"></i>
        <p class="weui-toast__content" v-if="text" :class="contentClass" v-html="text"></p>
        <p class="weui-toast__content" v-else><slot></slot></p>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    time: {
      type: Number,
      default: 2000
    },
    icon: String,
    color: {
      type: String,
      default: '#fff'
    },
    transition: String,
    width: {
      type: String,
      default: '7.6em'
    },
    isShowMask: {
      type: Boolean,
      default: false
    },
    text: String,
    position: String
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    if (this.value) {
      this.show = true
    }
  },
  computed: {
    currentTransition () {
      if (this.transition) {
        return this.transition
      }
      if (this.position === 'top') {
        return 'j-ui-slide-from-top'
      }
      if (this.position === 'bottom') {
        return 'j-ui-slide-from-bottom'
      }
      return 'j-ui-fade'
    },
    toastClass () {
      if (this.position === 'top') {
        return 'j-ui-toast-top'
      }
      if (this.position === 'bottom') {
        return 'j-ui-toast-bottom'
      }
      return 'weui-toast_text'
    },
    toastStyle () {
      let style = {
        width: this.width,
        color: this.color
      }
      if (!this.icon) {
        style['min-height'] = 0
      }
      return style
    },
    contentClass () {
      if (this.icon) {
        return 'j-ui-toast-top'
      }
      if (this.width === 'auto') {
        return 'j-ui-toast-auto'
      }
      return 'j-ui-toast-center'
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$emit('input', true)
        this.$emit('on-show')
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.show = false
          this.$emit('input', false)
          this.$emit('on-hide')
        }, this.time)
      }
    },
    value (val) {
      this.show = val
    }
  }
}
</script>

<style lang="less">
@import '~weui/src/style/widget/weui-tips/weui-toast.less';
@import '../styles/transitions/slide.less';

.j-ui-toast {
  .weui-toast {
    transform: translateX(-50%);
    margin-left: 0 !important;
  }
  .j-ui-toast-top {
    top: 10px;
  }
  .j-ui-toast-bottom {
    top: auto;
    bottom: 10px;
    transform: translateX(-50%);
  }
  i.iconfont {
    font-size: 50px;
  }
  .j-ui-toast-center {
    margin: auto;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 15px;
  }
  .j-ui-toast-top {
    margin-top: 10px;
  }
  .j-ui-toast-auto {
    padding: 10px;
  }
}
</style>
