import Vue from 'vue'

export default function (resource, changes, replaceUndefined = true, vueSet = true) {
  for (let k in changes) {
    let v = changes[k]
    if (v === undefined && !replaceUndefined) {
      continue
    }
    let child = resource
    let realKey = k
    if (!(k in child)) {
      let keys = k.split('.')
      for (let i = 0; i + 1 < keys.length; ++i) {
        let key = keys[i]
        if (key in child) {
          child = child[key]
          continue
        }
        try {
          key = parseInt(key)
        } catch (e) {
          break
        }
        if (!(key in child)) {
          break
        }
        child = child[key]
      }
      realKey = keys[keys.length - 1]
    }
    if (vueSet) {
      Vue.set(child, realKey, v)
    } else {
      child[realKey] = v
    }
  }
}
