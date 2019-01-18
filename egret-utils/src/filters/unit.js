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
      str = val.toFixed(0)
      if (max && str.length < max) {
        str = val.toFixed(Math.min(max - str.length, fixed)) 
      }
      str = parseFloat(str) + units[index]
      return false
    }
    return true
  })
  return str
}
