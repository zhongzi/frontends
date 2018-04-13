function build (current) {
  return JSON.stringify({
    name: current.name,
    path: current.path,
    params: current.params,
    query: current.query
  })
}

function get ({next, params, query}) {
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
        if ((key in next.query) || key === 'next') {
          continue
        }
        next.query[key] = query[key]
      }
    }
  } catch (err) {
    next = decodeURIComponent(next)
  }
  return next
}

export default { build, get }
