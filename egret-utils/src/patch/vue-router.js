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

  Router.prototype.updateNext = function ({next, params, query, override = false}) {
    return nextRoute.get({
      next: next,
      params: params,
      query: query,
      override: override
    })
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

  Router.prototype.pushRawNext = function ({next, params, query, replace = false, override = false}, onComplete, onAbort) {
    next = this.updateNext({
      next: next,
      params: params,
      query: query,
      override: override,
    })
    if (typeof next === 'string' || next instanceof String) {
      if (next.indexOf('http://') || next.indexOf('https://')) {
        window.location.replace(next)
        return
      }
    }
    if (replace === true) {
      this.replace(next, onComplete, onAbort)
    } else {
      this.push(next, onComplete, onAbort)
    }
  }

  Router.prototype.pushNext = function ({ current, replace = false, override = false}, onComplete, onAbort) {
    let next = current.query.next
    if (!next) {
      return false
    }
    this.pushRawNext({
      next: next,
      replace: replace,
      query: current.query,
      override: override,
    }, onComplete, onAbort)
    return true
  }
}
