<template>
  <div v-click-outside="onClickedOutside">
    <span ref="trigger" @click="toggle">
      <slot>
      </slot>
    </span>
    <div class="j-ui-popover"
      ref="popover"
      :style="popoverStyle"
      v-show="show">
        <div :class="arrowClass"></div>
        <div @click="$emit('on-click-content')">
          <slot name="content">
            <div v-html="content"></div>
          </slot>
        </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from '../../directives/click-outside'

export default {
  mounted () {
    this.$nextTick(() => {
      const trigger = this.$refs.trigger.children[0]
      const popover = this.$refs.popover
      switch (this.placement) {
        case 'top' :
          this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
          this.position.top = trigger.getBoundingClientRect().top - popover.offsetHeight - this.gutter
          break
        case 'left':
          this.position.left = trigger.offsetLeft - popover.offsetWidth - this.gutter
          this.position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight / 2 - popover.offsetHeight / 2
          break
        case 'right':
          this.position.left = trigger.offsetLeft + trigger.offsetWidth + this.gutter
          this.position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight / 2 - popover.offsetHeight / 2
          break
        case 'bottom':
          this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
          this.position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight + this.gutter
          break
        default:
          console.warn('Wrong placement prop')
      }
      this.show = false
      this.popoverStyle = {
        top: this.position.top + 'px',
        left: this.position.left + 'px',
        display: 'none'
      }
    })
  },
  directives: {
    ClickOutside
  },
  props: {
    content: String,
    placement: String,
    gutter: {
      type: Number,
      default: 5
    }
  },
  methods: {
    onClickedOutside () {
      if (this.show) {
        this.show = false
        this.$emit('on-hide')
      }
    },
    toggle () {
      this.show = !this.show
      this.$emit(`on-${this.show === true ? 'show' : 'hide'}`)
    }
  },
  data () {
    return {
      position: {
        top: 0,
        left: 0
      },
      show: true,
      popoverStyle: {}
    }
  },
  computed: {
    arrowClass () {
      return {
        'j-ui-popover-arrow': true,
        'j-ui-popover-arrow-up': this.placement === 'bottom',
        'j-ui-popover-arrow-right': this.placement === 'left',
        'j-ui-popover-arrow-left': this.placement === 'right',
        'j-ui-popover-arrow-down': this.placement === 'top'
      }
    }
  }
}
</script>

<style lang="less">
@import "../../styles/variables/z-index.less";
@import './variable.less';

.j-ui-popover {
  position: absolute;
  left: 0;
  top: 0;
  background-color: @popoverBgColor;
  color: @popoverFontColor;
  border-radius: @popoverBorderRadius;
  z-index: @popover-z-index;
}
.j-ui-popover-arrow {
  position: absolute;
  width: 0;
  height: 0;
}
.j-ui-popover-arrow-up {
 border-left: @popoverBorderWidth solid transparent;
 border-right: @popoverBorderWidth solid transparent;
 border-bottom: @popoverBorderWidth solid @popoverBgColor;
 left: 50%;
 transform: translateX(-50%);
 top: -@popoverBorderWidth;
}
.j-ui-popover-arrow-down {
  border-left: @popoverBorderWidth solid transparent;
  border-right: @popoverBorderWidth solid transparent;
  border-top: @popoverBorderWidth solid @popoverBgColor;
  left: 50%;
  transform: translateX(-50%);
  bottom: -@popoverBorderWidth;
}
.j-ui-popover-arrow-left {
  border-top: @popoverBorderWidth solid transparent;
  border-bottom: @popoverBorderWidth solid transparent;
  border-right: @popoverBorderWidth solid @popoverBgColor;
  top: 50%;
  transform: translateY(-50%);
  left: -@popoverBorderWidth;
}
.j-ui-popover-arrow-right {
  border-top: @popoverBorderWidth solid transparent;
  border-bottom: @popoverBorderWidth solid transparent;
  border-left: @popoverBorderWidth solid @popoverBgColor;
  top: 50%;
  transform: translateY(-50%);
  right: -@popoverBorderWidth;
}
</style>
