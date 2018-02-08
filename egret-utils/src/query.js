function from (query) {
  let rawQueries = []
  for (let key in query) {
    let value = query[key]
    if (value === null || value === undefined) {
      continue
    }
    rawQueries.push(key + '=' + encodeURIComponent(value))
  }
  return rawQueries.join('&')
}

function parse (query) {
  const res = {}
  query = query.trim().replace(/^(\?|#|&)/, '')
  if (!query) {
    return res
  }
  query.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decodeURIComponent(parts.shift())
    const val = parts.length > 0
      ? decodeURIComponent(parts.join('='))
      : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })
  return res
}

export default {
  from,
  parse
}
