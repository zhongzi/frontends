import nextRoute from '../next-route'

export default function (Router) {
  Router.prototype.buildNext = function (from) {
    if (!from) {
      from = this.history.current
    }
    if (!from) {
      return ''
    }
    return nextRoute.build(from)
  }

  Router.prototype.pushWithNext = function (route, onComplete, onAbort, from) {
    let query = route.query
    if (!query) {
      query = {}
    }
    query['next'] = this.buildNext(from)
    route['query'] = query
    this.push(route, onComplete, onAbort)
  }

  Router.prototype.replaceWithNext = function (route, onComplete, onAbort, from) {
    let query = route.query
    if (!query) {
      query = {}
    }
    query['next'] = this.buildNext(from)
    route['query'] = query
    this.replace(route, onComplete, onAbort)
  }

  Router.prototype.pushRawNext = function ({next, params, query, replace = false}) {
    next = nextRoute.get({
      next: next,
      params: params,
      query: query
    })
    if (typeof next === 'string' || next instanceof String) {
      if (next.indexOf('http://') || next.indexOf('https://')) {
        window.location.replace(next)
        return
      }
    }
    if (replace === true) {
      this.replace(next)
    } else {
      this.push(next)
    }
  }

  Router.prototype.pushNext = function (current, replace = false) {
    let next = current.query.next
    if (!next) {
      return false
    }
    this.pushRawNext({
      next: next,
      replace: replace,
      query: current.query
    })
    return true
  }
}
