<template>
  <transition :name="transition">
    <div class="j-ui-loading weui-loading_toast" v-show="show">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast" :style="{ position: position }">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">
          {{text}}
          <slot></slot>
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中'
    },
    position: String,
    transition: {
      type: String,
      default: 'j-ui-mask'
    }
  },
  created () {
    this.show = this.value
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less">
@import '~weui/src/style/widget/weui-tips/weui-toast.less';
@import '~weui/src/style/widget/weui-loading/weui-loading.less';
@import '../styles/transitions/mask.less';

.j-ui-loading {
  .weui-toast {
    .weui-loading {
      display: inline-block !important;
    }
  }  
}
</style>
