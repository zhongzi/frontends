<template>
<j-cell class="j-ui-cell-link" :title="title">
  <i>{{content}}</i>
  <div slot="right">
    <span>{{foot}}</span>
    <span :style="{ transform: transform }" class="iconfont icon-next"></span>
  </div>
</j-cell>
</template>

<script>
import JCell from './cell'
export default {
  components: {
    JCell
  },
  props: {
    title: String,
    arrowDirection: {
      type: String,
      default: 'right'
    },
    content: String,
    foot: Number
  },
  computed: {
    transform () {
      let degree = 0
      if (this.arrowDirection === 'down') {
        degree = 90
      } else if (this.arrowDirection === 'up') {
        degree = -90
      } else if (this.arrowDirection === 'left') {
        degree = 180
      }
      return 'rotate(' + degree + 'deg)'
    }
  }
}
</script>

<style lang="less">
</style>
