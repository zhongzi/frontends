function build (current) {
  return JSON.stringify({
    name: current.name,
    path: current.path,
    params: current.params,
    query: current.query
  })
}

function get ({next, params, query, override = false}) {
  try {
    if (typeof next === 'string' || next instanceof String) {
      next = JSON.parse(next)
    }
    if (params) {
      next.params = Object.assign(next.params || {}, params)
    }
    if (query) {
      next.query = next.query || {}
      for (let key in query) {
        if (key === 'next') continue;
        if ((key in next.query) && !override ) continue;
        next.query[key] = query[key]
      }
    }
  } catch (err) {
    next = decodeURIComponent(next)
  }
  return next
}

export default { build, get }
