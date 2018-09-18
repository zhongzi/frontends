export default function (value, length = 0) {
  if (value) {
    value = parseFloat(value)
  } else {
    value = 0.0
  }
  return value.toFixed(length)
}
