export default function (value, length, format='...') {
  if (value && value.length >= length) {
    return value.substring(0, length) + format
  } else {
    return value
  }
}
