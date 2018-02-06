import format from 'date-fns/format'
import parse from 'date-fns/parse'

export default function (value, formatStr) {
  if (value) {
    if (typeof value.getMonth !== 'function') {
      value = parse(value)
    }
    return format(value, formatStr)
  } else {
    return null
  }
}
