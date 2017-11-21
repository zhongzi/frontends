<template>
<div class="j-ui-picker">
  <div class="mask-top border-bottom-1px"></div>
  <div class="mask-bottom border-top-1px"></div>
  <div class="j-ui-picker-wrapper" ref="wrapper">
    <div class="j-ui-picker-wheel" v-for="row in data">
      <ul class="j-ui-picker-wheel-scroll">
        <li v-for="item in row" class="j-ui-picker-wheel-item">{{_getItemText(item)}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import { VModelMixin } from '../mixins/v-model.js'
import BScroll from 'better-scroll'

export default {
  mixins: [VModelMixin],
  props: {
    autoInit: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      required: true
    },
    textKey: {
      type: String,
      default: 'text'
    },
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  created () {
    this.currentValue = this.value
    if (!this.currentValue.length || this.currentValue.length !== this.data.length) {
      this.currentValue = []
      for (let i = 0; i < this.data.length; i++) {
        this.currentValue[i] = 0
      }
    }
  },
  mounted () {
    if (this.autoInit) {
      this.refresh()
    }
  },
  methods: {
    refresh (timeout) {
      if (this.wheels && this.wheels.length > 0) {
        setTimeout(() => {
          for (let wheel of this.wheels) {
            wheel.refresh()
          }
        }, 200)
        return
      }
      this.$nextTick(() => {
        this.wheels = []
        let wrapper = this.$refs.wrapper
        for (let i = 0; i < this.data.length; i++) {
          this._createWheel(wrapper, i)
        }
      }, timeout)
    },
    _getItemText (item) {
      if (this.textKey && this.textKey.length > 0) {
        return item[this.textKey]
      }
      return item
    },
    _createWheel (wrapper, i) {
      this.wheels[i] = new BScroll(wrapper.children[i], {
        wheel: {
          selectedIndex: this.currentValue[i]
        },
        probeType: 3
      })
      this.wheels[i].on('scrollEnd', () => {
        this.currentValue[i] = this.wheels[i].getSelectedIndex()
      })
    }
  }
}
</script>

<style lang="less">
.j-ui-picker {
  .mask-top, .mask-bottom {
    z-index: 1;
    width: 100%;
    height: 68px;
    pointer-events: none;
    transform: translateZ(0);
  }
  .mask-top {
    position: absolute;
    top: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
  }
  .mask-bottom {
    position: absolute;
    bottom: 1px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
  }
  .j-ui-picker-wrapper {
    display: flex;
    padding: 0 15px;
    .j-ui-picker-wheel {
      flex: 1;
      height: 175px;
      overflow: hidden;
      .j-ui-picker-wheel-scroll {
        padding: 0;
        margin-top: 65px;
        line-height: 36px;
        list-style: none;
        text-align: center;
        .j-ui-picker-wheel-item {
          list-style: none;
          height: 36px;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>