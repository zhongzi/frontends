export default function (num, counts, units, fixed = 0) {
  if (!num) {
    return '0.00kg'
  }
  num = parseFloat(num)
  let str = '' + num.toFixed(fixed)
  counts.every((count, index) => {
    if (num >= count) {
      str = (num / (count || 1)).toFixed(fixed) + ' ' + units[index]
      return false
    }
    return true
  })
  return str
}
