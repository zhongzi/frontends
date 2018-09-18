let hrn = require('hrn')

export default function (value, fixed, formatter) {
  if (!value || typeof value !== 'number') {
    return
  }
  formatter = formatter || 'zh_CN'
  return hrn(value, fixed, formatter)
}
