const VModelMixin = {
  data () {
    return {
      currentValue: ''
    }
  },
  created () {
    this.currentValue = this.value
  },
  mounted () {
    this.$emit('input', this.currentValue)
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  }
}

const VModelMixinNoEmit = {
  data () {
    return {
      currentValue: ''
    }
  },
  created () {
    this.currentValue = this.value
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  }
}

export {
  VModelMixin,
  VModelMixinNoEmit
}
