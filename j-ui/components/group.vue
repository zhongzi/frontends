<template>
<div class="j-ui-group" :style='{ "margin-top": gutter }'>
  <div class="j-ui-group-title" v-if="title && title.length > 0">{{title}}</div>
  <div class="j-ui-group-content">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  props: {
    gutter: {
      type: String,
      default: '1.2em'
    },
    title: {
      type: String,
      default: ''
    },
    labelWidth: String
  }
}
</script>

<style lang="less">
@import "../styles/variables/color.less";
@import "../styles/variables/size.less";
.j-ui-group {
  color: #000;
  border-bottom: 1px solid @lineColorLighter;
  .j-ui-group-title {
    margin: 10px 0 5px 15px;
    color: @textColorLighter;
    font-size: @smallFontSize;
  }
  .j-ui-group-content {
    background-color: #fff;
  }
  .j-ui-cell {
    padding-left: 15px;
    padding-right: 15px;
    border-top: 1px solid @lineColorLighter;
  }
}
</style>
