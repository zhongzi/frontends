export default function (value, length = 0, slot = '-') {
  if (value === null  || value === undefined) {
    return slot
  }
  const parsed = parseFloat(value)
  if (isNaN(parsed)) {
    return slot
  }
  return parsed.toFixed(length)
}
