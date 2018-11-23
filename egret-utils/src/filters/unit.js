export default function (value, counts, units, fixed = 0, slot='-') {
  if (value === null  || value === undefined) {
    return slot
  }
  const parsed = parseFloat(value)
  if (isNaN(parsed)) {
    return slot
  }

  let str = '' + parsed.toFixed(fixed)
  counts.every((count, index) => {
    if (parsed >= count) {
      str = (parsed / (count || 1)).toFixed(fixed) + ' ' + units[index]
      return false
    }
    return true
  })
  return str
}
