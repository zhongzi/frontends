<template>
<j-cell class="j-ui-cell-switch" :title="title">
  <div slot="right">
    <input v-model="currentValue" type="checkbox" :disabled="disabled">
  </div>
</j-cell>
</template>

<script>
import { VModelMixin } from '../mixins/v-model.js'
import JCell from './cell'

export default {
  mixins: [VModelMixin],
  components: {
    JCell
  },
  props: {
    title: String,
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
@import '~weui/src/style/widget/weui-cell/weui-switch.less';

.j-ui-cell-switch {
  input[type=checkbox] {
    appearance: none;
    position: relative;
    width: 52px;
    height: 32px;
    border: 1px solid #DFDFDF;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #DFDFDF;
    transition: background-color 0.1s, border 0.1s;
  }
  input[type=checkbox]:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 30px;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  input[type=checkbox]:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  input[type=checkbox]:checked {
    border-color: #04BE02;
    background-color: #04BE02;
  }
  input[type=checkbox]:checked:before {
    transform: scale(0);
  }
  input[type=checkbox]:checked:after {
    transform: translateX(20px);
  }
}
</style>
