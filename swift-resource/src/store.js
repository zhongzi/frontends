import Vue from 'vue'

import updateResource from './utils/update_resource'

var normalizeKey = function (key) {
  if (!key) {
    return ''
  }
  return '' + key
}

export default function (api, default_ = {}) {
  const state = {
    loading: {
      lists: {},
      resources: {},
      saveds: {},
      deletes: {}
    },
    error: {
      lists: {},
      resources: {},
      saveds: {},
      deletes: {}
    },
    total: {},
    sums: {},
    lists: {},
    resources: {}
  }

  const getters = {
    list: (state, getters) => {
      return getters.getListByTag('')
    },
    listLoading: (state, getters) => {
      return getters.getListLoadingByTag('')
    },
    listError: (state, getters) => {
      return getters.getListErrorByTag('')
    },
    listTotal: (state, getters) => {
      return getters.getListTotalByTag('')
    },
    listSums: (state, getters) => {
      return getters.getListSumsByTag('')
    },
    getListByTag: (state, getters) => (tag) => {
      tag = normalizeKey(tag)
      return state.lists[tag] || []
    },
    getListLoadingByTag: (state, getters) => (tag) => {
      tag = normalizeKey(tag)
      return state.loading.lists[tag] || false
    },
    getListErrorByTag: (state, getters) => (tag) => {
      tag = normalizeKey(tag)
      return state.error.lists[tag] || null
    },
    getListTotalByTag: (state, getters) => (tag) => {
      tag = normalizeKey(tag)
      return state.total[tag] || 0
    },
    getListSumsByTag: (state, getters) => (tag) => {
      tag = normalizeKey(tag)
      return state.sums[tag] || 0
    },
    getById: (state, getters) => (id) => {
      id = normalizeKey(id)
      return state.resources[id] || default_
    },
    getLoadingById: (state, getters) => (id) => {
      id = normalizeKey(id)
      return state.loading.resources[id] || false
    },
    getErrorById: (state, getters) => (id) => {
      id = normalizeKey(id)
      return state.error.resources[id] || null
    },
    getSaveLoadingById: (state, getters) => (id) => {
      id = normalizeKey(id)
      return state.loading.saveds[id] || false
    },
    getSaveErrorById: (state, getters) => (id) => {
      id = normalizeKey(id)
      return state.error.saveds[id] || null
    },
    getDeleteLoadingById: (state, getters) => (id) => {
      id = normalizeKey(id)
      return state.loading.deletes[id] || false
    },
    getDeleteErrorById: (state, getters) => (id) => {
      id = normalizeKey(id)
      return state.error.deletes[id] || null
    }
  }

  const mutations = {
    resetList (state, { key }) {
      Vue.set(state.lists, key, [])
    },
    listStart (state, { key }) {
      Vue.set(state.loading.lists, key, true)
    },
    listSuccess (state, { key, response, reset }) {
      Vue.set(state.loading.lists, key, false)
      if (!(key in state.lists) || reset === true) {
        Vue.set(state.lists, key, response.data.data)
      } else {
        state.lists[key] = state.lists[key].concat(response.data.data)
      }
      if (response.data.total) {
        Vue.set(state.total, key, response.data.total)
      }
      if (response.data.sums) {
        Vue.set(state.sums, key, response.data.sums)
      }
      Vue.set(state.error.lists, key, null)
    },
    listFail (state, { key, error }) {
      Vue.set(state.loading.lists, key, false)
      Vue.set(state.error.lists, key, error)
    },
    updateInList (state, { tag, id, changes }) {
      var key = normalizeKey(tag)
      var list = state.lists[key]
      for (var i = 0; i < list.length; i++) {
        var resource = list[i]
        if (resource.id === id) {
          updateResource(resource, changes, false)
          break
        }
      }
    },
    restore (state, { key }) {
      if (!(key in state.resources)) {
        // 從列表恢復
        for (var k in state.lists) {
          var lists = state.lists[k]
          for (var i = 0; i < lists.length; i++) {
            var resource = lists[i]
            if (normalizeKey(resource.id) === key) {
              Vue.set(state.resources, key, resource)
              break
            }
          }
        }
      }
    },
    getStart (state, { key }) {
      Vue.set(state.loading.resources, key, true)
    },
    getSuccess (state, { key, response }) {
      Vue.set(state.loading.resources, key, false)
      Vue.set(state.resources, key, response.data)
      Vue.set(state.error.resources, key, null)
    },
    getFail (state, { key, error }) {
      Vue.set(state.loading.resources, key, false)
      Vue.set(state.error.resources, key, error)
    },
    reset (state, { id, res }) {
      const key = normalizeKey(id)
      if (!res) {
        res = {}
      }
      Vue.set(state.resources, key, res)
    },
    update (state, { id, changes }) {
      let key = normalizeKey(id)
      var resource = state.resources[key]
      if (!resource) {
        resource = {}
        Vue.set(state.resources, key, resource)
      }
      updateResource(resource, changes)
    },
    saveStart (state, { key }) {
      Vue.set(state.loading.saveds, key, true)
    },
    saveSuccess (state, { key, response }) {
      Vue.set(state.loading.saveds, key, false)
      const resource = Object.assign(state.resources[key] || {}, response.data)
      Vue.set(state.resources, key, resource)
      Vue.set(state.error.saveds, key, null)
    },
    saveFail (state, { key, error }) {
      Vue.set(state.loading.saveds, key, false)
      Vue.set(state.error.saveds, key, error)
    },
    deleteStart (state, { key }) {
      Vue.set(state.loading.deletes, key, true)
    },
    deleteSuccess (state, { key, response }) {
      Vue.set(state.loading.deletes, key, false)
      delete state.resources[key]
      Vue.set(state.error.deletes, key, null)
    },
    deleteFail (state, { key, error }) {
      Vue.set(state.loading.deletes, key, false)
      Vue.set(state.error.deletes, key, error)
    }
  }

  const actions = {
    async list ({ state, getters, dispatch, commit }, { query, headers, configs, args, reset, success, failure, tag }) {
      var key = normalizeKey(tag)
      if (getters.getListLoadingByTag(key) === true) {
        return
      }
      var start = 0
      if (reset === true) {
        start = 0
      } else {
        start = getters.getListByTag(key).length
      }
      commit('listStart', { key: key })
      try {
        if (!query) {
          query = {}
        }
        query['start'] = start
        const response = await api.list({
          query: query,
          headers: headers,
          configs: configs,
          args: args
        })
        commit('listSuccess', {
          key: key,
          response: response,
          reset: reset
        })
        if (success) {
          success(response)
        } else {
          return response
        }
      } catch (err) {
        commit('listFail', {
          key: key,
          error: err
        })
        if (failure) {
          failure(err)
        } else {
          return Promise.reject(err)
        }
      }
    },
    async get ({ state, getters, commit, dispatch }, { id, restore, requireColumns, query, headers, configs, args, success, failure }) {
      const key = normalizeKey(id)
      if (getters.getLoadingById(key) === true) {
        return
      }

      // 恢復
      if (restore === true) {
        commit('restore', { key: key })
        // 是否有必要的列
        if (state.resources[key]) {
          var hasRequireColumns = true
          if (requireColumns) {
            for (var i = 0; i < requireColumns.length; i++) {
              var requireColumn = requireColumns[i]
              if (!(requireColumn in state.resources[key])) {
                hasRequireColumns = false
              }
            }
          }
          if (hasRequireColumns) {
            return
          }
        }
      }

      commit('getStart', { key: key })
      try {
        const response = await api.get({
          id: id,
          query: query,
          headers: headers,
          configs: configs,
          args: args
        })
        commit('getSuccess', { key: key, response: response })
        if (success) {
          success(response)
        } else {
          return response
        }
      } catch (err) {
        commit('getFail', { key: key, error: err })
        if (failure) {
          failure(err)
        } else {
          return Promise.reject(err)
        }
      }
    },
    async save ({ commit, getters, dispatch }, { res, syncTag, query, headers, configs, args, success, failure }) {
      var key = normalizeKey(res.id)
      // 正在保存
      if (getters.getSaveLoadingById(key) === true) {
        return
      }
      commit('saveStart', { key: key })
      try {
        var promise
        var params = {
          res: res,
          query: query,
          headers: headers,
          configs: configs,
          args: args
        }
        if (res.id) {
          promise = api.update(params)
        } else {
          promise = api.create(params)
        }
        const response = await promise
        const data = response.data
        commit('saveSuccess', { key: key, response: response })
        if (syncTag !== undefined) {
          commit('updateInList', {
            tag: syncTag,
            id: data.id,
            changes: res
          })
        }
        if (success) {
          success(response)
        } else {
          return response
        }
      } catch (err) {
        commit('saveFail', { key: key, error: err })
        if (failure) {
          failure(err)
        } else {
          return Promise.reject(err)
        }
      }
    },
    async delete ({ commit, getters, dispatch }, { res, query, headers, configs, args, success, failure }) {
      var key = normalizeKey(res.id)
      // 正在保存
      if (getters.getDeleteLoadingById(key) === true) {
        return
      }
      commit('deleteStart', { key: key })
      try {
        const response = await api.delete({
          res: res,
          query: query,
          headers: headers,
          configs: configs,
          args: args
        })
        commit('deleteSuccess', { key: key, response: response })
        if (success) {
          success(response)
        } else {
          return response
        }
      } catch (err) {
        commit('deleteFail', { key: key, error: err })
        if (failure) {
          failure(err)
        } else {
          return Promise.reject(err)
        }
      }
    }
  }
  return {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
  }
}
