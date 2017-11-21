<template>
<button class="j-ui-button" :class="buttonClass">
  <slot></slot>
</button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    buttonClass () {
      var type = this.type
      if (!type || type.length === 0) {
        type = 'default'
      }
      return 'j-ui-button-' + type
    }
  }
}
</script>

<style lang="less">
.j-ui-button {
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  width: 100%;
  border-width: 0;
  outline: 0;
  position: relative;
  display: block;
  margin: 0 auto;
  padding: 0 14px;
  font-size: 18px;
  line-height: 30px;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
  color: #FFFFFF;
  overflow: hidden;
  // border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  height: 40px;
}

.j-ui-button-default {
  color: #000000;
  background-color: #F8F8F8;
}

.j-ui-button-primary {
  background-color: #1AAD19;
}

.j-ui-button-warn {
  background-color: #E64340;
}
</style>
