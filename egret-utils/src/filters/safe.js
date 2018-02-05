export default function (obj, path, default_ = '') {
  const parts = path.split('.')
  var partValue = obj
  for (var i = 0; i < parts.length; i++) {
    if (!partValue) {
      break
    }
    const part = parts[i]
    partValue = partValue[part]
  }
  return partValue || default_
}
