<template>
<div class="j-ui-cell">
  <div class="j-ui-cell-title">
    <slot name="title">
    </slot>
    <label v-if="title" :style="{'width': titleWidth}">{{title}}</label>
  </div>
  <div class="j-ui-cell-content">
    <slot></slot>
  </div>
  <div class="j-ui-cell-right">
    <slot name="right"></slot>
  </div>
</div>
</template>

<script>
export default {
  props: {
    title: String
  },
  computed: {
    titleWidth () {
      let parent = this
      while (parent) {
        if (parent.labelWidth) {
          return parent.labelWidth
        }
        parent = parent.$parent
      }
      return 'auto'
    }
  }
}
</script>

<style lang="less">
@import "../styles/variables/color.less";
.j-ui-cell {
  display: flex;
  position: relative;
  margin: 0px;
  padding-top: 12px;
  padding-bottom: 12px;
  .j-ui-cell-title {
    display: flex;
    align-items: center;
    >label {
      display: flex;
      align-items: center;
      height: 100%;
      min-width: 90px;
      padding: 0 10px 0 0;
    }
  }

  .j-ui-cell-content {
    display: flex;
    align-items: center;
    flex: 1;
    color: @textColorLighter;
  }
  .j-ui-cell-right {
    display: flex;
    align-items: center;
    text-align: right;
    color: @textColorLighter;
    padding: auto;
  }
}
</style>
