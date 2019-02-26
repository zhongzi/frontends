import Vue from 'vue'
import merge from 'lodash/merge'
import updateResource from './utils/update_resource'

const normalizeKey = function (key) {
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
      if (response.data.total !== undefined && response.data.total !== null) {
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
    setInList (state, { tag, index, res }) {
      const key = normalizeKey(tag)
      let list = state.lists[key]
      if (list) {
        if (index !== undefined && index !== null) {
          list.splice(index, 0, res)
        } else {
          list.push(res)
        }
      } else {
        Vue.set(state.lists, key, [res])
      }
    },
    deleteInList (state, { tag, index }) {
      const key = normalizeKey(tag)
      let list = state.lists[key]
      if (!list) {
        return
      }
      if (index < 0) {
        index = list.length + index
      }
      list.splice(index, 1)
    },
    removeInList (state, { tag, res, equal }) {
      const key = normalizeKey(tag)
      let list = state.lists[key]
      if (!list) {
        return
      }
      for (let i = 0; i < list.length; i++) {
        const resource = list[i]
        if ((equal && equal(resource, res)) || resource.id === res.id) {
          list.splice(i, 1)
          break
        }
      }
    },
    updateInList (state, { tag, id, changes, callback }) {
      const key = normalizeKey(tag)
      let list = state.lists[key]
      if (!list) {
        return
      }
      for (let i = 0; i < list.length; i++) {
        const resource = list[i]
        if (resource.id === id) {
          updateResource(resource, changes, false)
          callback && callback(resource)
          break
        }
      }
    },
    restore (state, { key }) {
      if (!(key in state.resources)) {
        // 從列表恢復
        for (const k in state.lists) {
          const lists = state.lists[k]
          for (let i = 0; i < lists.length; i++) {
            const resource = lists[i]
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
      const key = normalizeKey(id)
      let resource = state.resources[key]
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
      const resource = merge(state.resources[key] || {}, response.data)
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
    async list ({ state, getters, dispatch, commit }, { query, headers, configs, args, reset, success, failure, tag, lazy }) {
      const key = normalizeKey(tag)
      let start = 0
      if (reset === true) {
        start = (configs && configs.offset) || 0
        if (lazy) {
          const data = getters.getListByTag(key)
          if (data.length > 0) {
            const total = getters.getListTotalByTag(key)
            const sums = getters.getListSumsByTag(key)
            const response = {
              data: {
                data: data,
                total: total,
                sums: sums
              }
            }
            if (success) {
              success(response)
              return
            } else {
              return response
            }
          }
        }
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
    async get ({ state, getters, commit, dispatch }, { id, restore, requireColumns, query, headers, configs, args, success, failure, lazy }) {
      const key = normalizeKey(id)
      if (lazy) {
        const resource = state.resources[key]
        if (resource) {
          const response = {
            data: resource
          }
          if (success) {
            success(response)
            return
          } else {
            return response
          }
        }
      }

      // 恢復
      if (restore === true) {
        commit('restore', { key: key })
        // 是否有必要的列
        if (state.resources[key]) {
          let hasRequireColumns = true
          if (requireColumns) {
            for (let i = 0; i < requireColumns.length; i++) {
              const requireColumn = requireColumns[i]
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
    async save ({ commit, getters, dispatch }, { res, id, syncTag, query, headers, configs, args, success, failure }) {
      let isBatch = Object.prototype.toString.call(res) === '[object Array]'
      let batchedRes
      if (isBatch) {
        batchedRes = res
      } else {
        batchedRes = [res]
      }
      batchedRes = batchedRes.filter(function (el) {
        const key = normalizeKey(el.id)
        // 正在保存
        if (getters.getSaveLoadingById(key) === true) {
          return false
        }
        commit('saveStart', { key: key })
        return true
      })
      if (batchedRes.length === 0) {
        const err = new Error('请求过快')
        if (failure) {
          failure(err)
          return
        } else {
          return Promise.reject(err)
        }
      }

      isBatch = batchedRes.length > 1
      let resId
      if (isBatch) {
        if (batchedRes[0].id) {
          resId = 'updating'
        } else {
          resId = undefined
        }
      } else {
        res = batchedRes[0]
        resId = res.id
      }

      try {
        let promise
        const params = {
          id: resId,
          res: res,
          query: query,
          headers: headers,
          configs: configs,
          args: args
        }
        if (resId) {
          promise = api.update(params)
        } else {
          promise = api.create(params)
        }
        const response = await promise
        let responseData = response.data
        if (!isBatch) {
          responseData = [responseData]
        }

        batchedRes.forEach(function (res, index) {
          const key = normalizeKey(res.id)
          const data = responseData[index]
          commit('saveSuccess', {
            key: key,
            response: { data: data } })

          if (syncTag !== undefined) {
            setTimeout(function () {
              const merged = merge({}, res, data)
              if (res.id) {
                commit('updateInList', {
                  tag: syncTag,
                  id: data.id,
                  changes: merged
                })
              } else {
                commit('setInList', {
                  tag: syncTag,
                  index: 0,
                  res: merged
                })
              }
            })
          }
        })

        if (success) {
          success(response)
        } else {
          return response
        }
      } catch (err) {
        batchedRes.forEach(function (res) {
          const key = normalizeKey(res.id)
          commit('saveFail', { key: key, error: err })
        })

        if (failure) {
          failure(err)
        } else {
          return Promise.reject(err)
        }
      }
    },
    async delete ({ commit, getters, dispatch }, { res, syncTag, query, headers, configs, args, success, failure }) {
      const key = normalizeKey(res.id)
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

        if (syncTag !== undefined) {
          setTimeout(function () {
            commit('removeInList', {
              tag: syncTag,
              res: res
            })
          })
        }

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
