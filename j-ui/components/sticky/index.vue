<template>
  <div class="j-ui-sticky-box">
    <slot></slot>
  </div>
</template>

<script>
import sticky from './sticky'

export default {
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.bindSticky()
    })
  },
  beforeDestroy () {
  },
  methods: {
    bindSticky () {
      this.$nextTick(() => {
        sticky(this.$el, {
          scrollBox: this.scrollBox,
          offset: this.offset,
          checkStickySupport: typeof this.checkStickySupport === 'undefined' ? true : this.checkStickySupport
        })
      })
    }
  },
  props: ['scrollBox', 'offset', 'checkStickySupport']
}
</script>

<style lang="less">
@import "../../styles/variables/z-index.less";

.j-ui-sticky-box {
  z-index: @sticky-z-index;
}
.j-ui-sticky {
  width: 100%;
  position: sticky;
  top: 0;
}
.j-ui-fixed {
  width: 100%;
  position: fixed;
  top: 0;
  transform: translate3d(0, 0, 0);
}
</style>
