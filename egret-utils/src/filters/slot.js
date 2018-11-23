export default function (value, slot = '-') {
  if (value === null  || value === undefined) {
    return slot
  }
  return value
}
