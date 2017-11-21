<template>
<j-cell class="j-ui-cell-textarea" :title="title">
  <textarea v-model="currentValue" :rows="rows" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" :maxlength="max" :placeholder="placeholder" v-focus="currentFocused" @focus="currentFocused = true" @blur="currentFocused = false"></textarea>
  <div class="j-ui-textarea-counter" v-if="max">
    <span>{{textLength}}</span>/{{max}}
  </div>
</j-cell>
</template>

<script>
import { focus } from 'vue-focus'

import { VModelMixin } from '../mixins/v-model.js'
import JCell from './cell'

export default {
  mixins: [VModelMixin],
  directives: { focus },
  components: {
    JCell
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    title: String,
    rows: {
      type: Number,
      default: 5
    },
    max: {
      type: Number
    },
    placeholder: {
      type: String
    },
    focused: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentFocused: this.focused
    }
  },
  computed: {
    textLength () {
      if (!this.currentValue) {
        return 0
      }
      return this.currentValue.length
    }
  },
  watch: {
    focused (val) {
      this.currentFocused = val
    }
  }
}
</script>

<style lang="less">
.j-ui-cell-textarea {
  .j-ui-cell-title {
    label {
      align-items: normal !important;
    }
  }
  textarea {
    display: block;
    border: 0;
    resize: none;
    width: 100%;
    outline: 0;
  }
  .j-ui-textarea-counter {
    color: #B2B2B2;
    text-align: right;
  }
}
</style>
