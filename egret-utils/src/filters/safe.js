import slotFilter from './slot'

export default function (obj, path, slot = '-') {
  const parts = path.split('.')
  var partValue = obj
  for (var i = 0; i < parts.length; i++) {
    if (!partValue) {
      break
    }
    const part = parts[i]
    partValue = partValue[part]
  }
  return slotFilter(partValue, slot)
}
