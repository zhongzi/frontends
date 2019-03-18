export default function (value, counts, units, fixed = 0, slot='-', max = undefined) {
  if (value === null  || value === undefined) {
    return slot
  }
  if (max && ('' + value).length <= max) {
    return value
  }
  const parsed = parseFloat(value)
  if (isNaN(parsed)) {
    return slot
  }

  let str
  counts.every((count, index) => {
    if (parsed >= count) {
      const val = (parsed / (count || 1))
      str = val.toFixed(fixed)
      if (max) {
        str = '' + parseFloat(str)
        if (str.length < max) {
          let minFixed = Math.min(max - str.length, fixed)
          if (minFixed < 0) {
            minFixed = 0
          }
          str = '' + parseFloat(val.toFixed(minFixed))
        }
      }
      str = str + units[index]
      return false
    }
    return true
  })
  return str
}
