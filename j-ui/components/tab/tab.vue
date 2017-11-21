<template>
  <div class="j-ui-tab" :class="{'j-ui-tab-no-animate': !animate}">
    <slot></slot>
    <div v-if="animate" class="j-ui-tab-ink-bar" :class="barClass" :style="barStyle">
      <span class="j-ui-tab-bar-inner" :style="innerBarStyle" v-if="customBarWidth"></span>
    </div>
  </div>
</template>

<script>
import { parentMixin } from '../../mixins/multi-items'

export default {
  mixins: [parentMixin],
  mounted () {
    // stop bar anmination on first loading
    this.$nextTick(() => {
      setTimeout(() => {
        this.hasReady = true
      }, 0)
    })
  },
  props: {
    lineWidth: {
      type: Number,
      default: 3
    },
    activeColor: String,
    barActiveColor: String,
    defaultColor: String,
    disabledColor: String,
    animate: {
      type: Boolean,
      default: true
    },
    customBarWidth: [Function, String]
  },
  computed: {
    barLeft () {
      return `${this.currentIndex * (100 / this.number)}%`
    },
    barRight () {
      return `${(this.number - this.currentIndex - 1) * (100 / this.number)}%`
    },
    // when prop:custom-bar-width
    innerBarStyle () {
      return {
        width: typeof this.customBarWidth === 'function' ? this.customBarWidth(this.currentIndex) : this.customBarWidth,
        backgroundColor: this.barActiveColor || this.activeColor
      }
    },
    // end
    barStyle () {
      const commonStyle = {
        left: this.barLeft,
        right: this.barRight,
        display: 'block',
        height: this.lineWidth + 'px',
        transition: !this.hasReady ? 'none' : null
      }
      if (!this.customBarWidth) {
        commonStyle.backgroundColor = this.barActiveColor || this.activeColor
      } else {
        commonStyle.backgroundColor = 'transparent' // when=prop:custom-bar-width
      }
      return commonStyle
    },
    barClass () {
      return {
        'j-ui-tab-ink-bar-transition-forward': this.direction === 'forward',
        'j-ui-tab-ink-bar-transition-backward': this.direction === 'backward'
      }
    }
  },
  watch: {
    currentIndex (newIndex, oldIndex) {
      this.direction = newIndex > oldIndex ? 'forward' : 'backward'
      this.$emit('on-index-change', newIndex, oldIndex)
    }
  },
  data () {
    return {
      direction: 'forward',
      right: '100%',
      hasReady: false
    }
  }
}
</script>


<style lang="less">
@import './variable.less';

@prefixClass: j-ui-tab;
@easing-in-out: cubic-bezier(0.35, 0, 0.25, 1);
@effect-duration: .3s;

.@{prefixClass} {

  &-ink-bar {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: @tabBarActiveColor;
    text-align: center;

    &-transition-forward {
      transition: right @effect-duration @easing-in-out,
      left @effect-duration @easing-in-out @effect-duration * 0.3;
    }
    &-transition-backward {
      transition: right @effect-duration @easing-in-out @effect-duration * 0.3,
      left @effect-duration @easing-in-out;
    }
  }

}

.j-ui-tab {
  display: flex;
  background-color: #fff;
  height: 44px;
  position: relative;
}
.j-ui-tab button {
  padding: 0;
  border: 0;
  outline: 0;
  background: 0 0;
  appearance: none;
}
.j-ui-tab .j-ui-tab-item {
  display: block;
  flex: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /*background: linear-gradient(180deg, #e5e5e5, #e5e5e5, rgba(229, 229, 229, 0)) bottom left no-repeat;*/
  background-size: 100% 1px;
  font-size: 14px;
  text-align: center;
  line-height: 44px;
  color: @tabTextDefaultColor;
}

.j-ui-tab .j-ui-tab-item.j-ui-tab-selected {
  color: @tabTextActiveColor;
  border-bottom: 3px solid @tabTextActiveColor;
}

.j-ui-tab .j-ui-tab-item.j-ui-tab-disabled {
  color: @tabTextDisabledColor;
}

.j-ui-tab.j-ui-tab-no-animate .j-ui-tab-item.j-ui-tab-selected {
  background: 0 0;
}

/** when=prop:custom-bar-width **/
.j-ui-tab-bar-inner {
  display: block;
  background-color: @tabTextActiveColor;
  margin: auto;
  height: 100%;
  transition: width 0.3s @easing-in-out;
}

.j-ui-tab-item-badge {
  position: absolute;
  top:0;
  bottom:0;
  box-sizing: border-box;
  display: inline-block;
  height: 18px;
  min-width: 18px;
  padding: 0 4px;
  border-radius: 30px;
  margin: auto 0 auto 4px;
  line-height: 18px;
  font-size: 11px;
  background-clip: padding-box;
  vertical-align: middle;
}
</style>
