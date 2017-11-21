<template>
  <div class="j-ui-popup" :class="{'j-ui-popup-show': currentValue}">
    <div class="j-ui-popup-mask" @click="hidePopup"></div>
    <transition :name=position>
      <div class="j-ui-popup-pannel" v-show="currentValue" :class="[position]">
        <div v-if="header" class="j-ui-popup-header j-ui-flexbox j-ui-flex-row">
          <div class="j-ui-flexbox-item j-ui-popup-header-cancel" @click="hidePopup" v-if="closable">{{ cancelText }}</div>
          <div class="j-ui-flexbox-item j-ui-popup-header-confirm" @click="onConfirm" v-if="onConfirm">{{ confirmText  }}</div>
        </div>
        <div class="j-ui-popup-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { VModelMixinNoEmit } from '../mixins/v-model.js'

export default{
  mixins: [VModelMixinNoEmit],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'bottom'
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
    onConfirm: Function
  },
  methods: {
    hidePopup () {
      if (this.closable) {
        this.currentValue = false
      }
    }
  },
  watch: {
    currentValue (val) {
      this.$emit(val ? 'on-show' : 'on-hide')
      this.$emit('input', val)
    }
  }
}
</script>

<style lang='less' scoped>
@import "../styles/variables/color.less";
@import "../styles/variables/z-index.less";
@import '../styles/layouts/flex.less';

.j-ui-popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: -1;
  transition: all .5s;
  &.j-ui-popup-show {
    display: block;
    z-index: @popup-z-index;
    opacity: 1;
  }
  .j-ui-popup-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }
  .j-ui-popup-pannel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: .44rem;
    background-color: #fff;
    &.top {
      top: 0;
    }
    &.bottom {
      bottom: 0;
      top: auto;
    }
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
      left: auto;
    }
    .j-ui-popup-header {
      height: 48px;
      border-bottom: 1px solid @lineColorLighter;
      background-color: @bgColorHeader;
    
      .j-ui-popup-header-cancel {
        padding-left: 15px;
        color: @textColorLighter;
      }
      .j-ui-popup-header-confirm {
        padding-right: 15px;
        text-align: right;
        color: #04BE02;
      }
    }
    .j-ui-popup-content {
      -webkit-transform: translateZ(0);
      -webkit-transform: translate3d(0,0,0);
      -webkit-perspective: 1000;
    }
  }
}
.top-enter-active,
.top-leave-active,
.bottom-enter-active,
.bottom-leave-active,
.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
    transition: all .5s;
}
.top-enter,
.top-leave-active {
    transform: translateY(-100%);
}
.bottom-enter,
.bottom-leave-active {
    transform: translateY(100%);
}
.left-enter,
.left-leave-active {
    transform: translateX(-100%);
}
.right-enter,
.right-leave-active {
    transform: translateX(100%);
}
@media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5){
    .border-1px{
      &::after, &::before{
        transform: scaleY(.7);
      }
      &::after{
        -webkit-transform-origin: left bottom;
      }
    }
}
@media (min-device-pixel-ratio: 2){
  .border-1px{
    &::after, &::before{
      transform: scaleY(.5);
    }
  }
}
</style>
