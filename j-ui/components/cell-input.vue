<template>
<j-cell class="j-ui-cell-input" :title="title">
  <div slot="title">
    <slot name="label"></slot>
  </div>
  <input v-model="currentValue" type="text" :maxlength="max" :placeholder="placeholder" v-if="type !== 'number' && type !== 'password'" :required="required" :readonly="readonly" :disabled="disabled" :style="{'line-height': height}"></input>
  <input v-model="currentValue" type="password" :maxlength="max" :placeholder="placeholder" v-if="type === 'password'" :required="required" :readonly="readonly" :disabled="disabled" :style="{'line-height': height}"></input>
  <input v-model="currentValue" type="number" :maxlength="max" :placeholder="placeholder" v-if="type === 'number'" :required="required" :readonly="readonly" :disabled="disabled" :style="{'line-height': height}"></input>
  <div slot="right">
    <slot name="right"></slot>
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
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    max: {
      type: Number
    },
    height: {
      type: String,
      default: '1.5em'
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  }
}
</script>

<style lang="less">
.j-ui-cell-input {
  input {
    color: #000;
    width: 100%;
    border: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: transparent;
    font-size: inherit;
  }
}
</style>
