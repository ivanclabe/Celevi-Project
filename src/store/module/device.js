import { clusteraxios } from '@/plugins/axios'
import { router } from '@/router'

const state = {
  meta: {
    isNew: false
  },
  references: [],
  filters: null,
  device: null,
  msg: null
}

const actions = {
  filterRefDev ({ commit }) {
    return clusteraxios
      .get('/admin/devices/', { params: { populate: 'reference' } })
      .then(response => {
        commit('deviceFilters', response.data)
        var items = response.data.data
        return items
      })
      .catch(error => {
        commit('deviceFailure', error)
      })
  },
  createDevice ({ commit }, { imei, reference }) {
    var data = { data: { type: 'devices', attributes: { _id: imei, reference } } }
    return clusteraxios
      .post('/admin/devices/?companyCode=15re08m3p', data)
      .then(response => {
        commit('deviceSuccess', response)
      })
      .catch(error => {
        commit('deviceFailure', error)
      })
  },
  getReferences ({ commit }) {
    return clusteraxios
      .get('/admin/refdev/', { params: { fields: 'name' } })
      .then(response => {
        commit('referencesList', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }
}

const mutations = {
  showTabNewDevice (state) {
    state.meta.isNew = true
    router.push({ name: 'Nuevo Dispositivo' })
  },
  referencesList (state, data) {
    state.references = data.data.map(f => {
      return { text: f.attributes.name, value: f.id }
    })
  },
  deviceFilters (state, devices) {
    state.filters = devices
  },
  deviceSuccess (state, device) {
    if (device) {
      state.device = device
    }
  },
  deviceFailure (state, error) {
    state.device = null
    state.msg = error.message
  },
  increment (state) {
    state.count++
  }
}

export const device = {
  namespaced: true,
  state,
  actions,
  mutations
}
