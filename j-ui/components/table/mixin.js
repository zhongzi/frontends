function findJTable (instance) {
  if (instance.jScrollReset) {
    return instance
  }
  let matched = null
  for (var child of instance.$children) {
    matched = findJTable(child)
    if (matched) {
      break
    }
  }
  return matched
}

export default {
  computed: {
    nearestJTable () {
      return findJTable(this)
    }
  },
  methods: {
    resetNearestJTable () {
      let nearestJTable = this.nearestJTable
      if (nearestJTable) {
        nearestJTable.jScrollReset()
      }
    }
  }
}
