export default function (api, plural, filters = []) {
  if (typeof plural === 'string' || plural instanceof String) {
    if (plural[0] !== '/') {
      plural = '/' + plural
    }
  }
  var getPlural = function (id, args) {
    if (typeof plural === 'function') {
      return plural(id, args)
    } else {
      if (id) {
        return plural + '/' + id
      } else {
        return plural
      }
    }
  }
  var processFilters = function (res) {
    filters.forEach((filter) => {
      res = filter(res)
    })
    return res
  }
  var processResFilters = function (promise) {
    if (filters && filters.length > 0) {
      return new Promise((resolve, reject) => {
        promise.then((response) => {
          response.data = processFilters(response.data)
          resolve(response)
        }).catch(reject)
      })
    }
    return promise
  }
  var processArrayFilters = function (promise) {
    if (filters && filters.length > 0) {
      return new Promise((resolve, reject) => {
        promise.then((response) => {
          let array = response.data.data
          response.data.data = array.map((res) => {
            return processFilters(res)
          })
          resolve(response)
        }).catch(reject)
      })
    }
    return promise
  }
  return {
    list ({query, headers, args, configs = {}}) {
      let promise = api.get(getPlural(undefined, args), query, {
        headers: headers,
        configs: configs
      })
      return processArrayFilters(promise)
    },
    get ({id, query, headers, args, configs = {}}) {
      let promise = api.get(getPlural(id, args), query, {
        headers: headers,
        configs: configs
      })
      return processResFilters(promise)
    },
    create ({res, query, headers, args, configs = {}}) {
      let promise = api.post(getPlural(undefined, args), res, {
        params: query,
        headers: headers,
        configs: configs
      })
      return processResFilters(promise)
    },
    update ({res, query, headers, args, configs = {}}) {
      return api.put(getPlural(res.id, args), res, {
        params: query,
        headers: headers,
        configs: configs
      })
    },
    delete ({res, query, headers, args, configs = {}}) {
      return api.delete(getPlural(res.id, args), res, {
        params: query,
        headers: headers,
        configs: configs
      })
    }
  }
}
