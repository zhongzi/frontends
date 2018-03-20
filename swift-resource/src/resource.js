export default function (api, plural) {
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
  return {
    list ({query, headers, args, configs}) {
      return api.get(getPlural(undefined, args), query, {
        headers: headers,
        configs: configs
      })
    },
    get ({id, query, headers, args, configs}) {
      return api.get(getPlural(id, args), {
        params: query,
        headers: headers,
        configs: configs
      })
    },
    create ({res, query, headers, args, configs}) {
      return api.post(getPlural(undefined, args), res, {
        params: query,
        headers: headers,
        configs: configs
      })
    },
    update ({res, query, headers, args, configs}) {
      return api.put(getPlural(res.id, args), res, {
        params: query,
        headers: headers,
        configs: configs
      })
    },
    delete ({res, query, headers, args, configs}) {
      return api.delete(getPlural(res.id, args), res, {
        params: query,
        headers: headers,
        configs: configs
      })
    }
  }
}
