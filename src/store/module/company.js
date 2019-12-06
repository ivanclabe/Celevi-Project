import _ from 'lodash'
import { clusteraxios } from '@/plugins/axios'

const state = {
  myCompanies: null
}

const mutations = {
  companiesList (state, data) {
    state.myCompanies = _.map(data.data, function (value) {
      return {
        id: value.id,
        code: value.attributes.code,
        name: value.attributes.name
      }
    })
  }
}

const actions = {
  getMyCompanies ({ commit }) {
    return clusteraxios
      .get('/admin/companies/')
      .then(response => {
        commit('companiesList', response.data)
      })
      .finally(error => {
        console.log(error)
      })
  }
}

export const company = {
  namespaced: true,
  state,
  mutations,
  actions
}
