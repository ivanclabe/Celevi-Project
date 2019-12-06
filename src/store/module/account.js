import Vue from 'vue'
import { loginaxios, clusteraxios } from '@/plugins/axios'

// import { userService } from '@/services'
import { router } from '@/router'

const state = {
  status: {
    loggingIn: false
  },
  token: null,
  user: null
}

const actions = {
  login ({ commit }, { username, password }) {
    commit('loginRequest', { username })

    return loginaxios
      .post('/auth/sign_in', { username, password })
      .then(response => {
        console.log(response)
        if (response.status === 200 && 'token' in response.data) {
          let session = Vue.prototype.$session
          let affiliatesList = response.data.user.affiliate_to
          let nAffiliates = affiliatesList.length

          session.start()
          session.set('user', response.data.user)
          session.set('jwt', response.data.token)
          clusteraxios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token

          if (nAffiliates === 0) {
            // something...
          } else if (nAffiliates === 1) {
            commit('loginSuccess', response.data)
            router.push({ name: 'Home', params: { companyId: affiliatesList[0].id } })
          } else {
            // router.push({ name: 'LoginCompany' })
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  logout ({ commit }) {
    let session = Vue.prototype.$session
    session.destroy()
    router.push({ name: 'login' })
    commit('logout')
  }
}

const mutations = {
  loginRequest (state, user) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess (state, data) {
    state.status = { loggedIn: true }
    state.token = data.token
    state.user = data.user
  },
  loginFailure (state) {
    state.status = {}
    state.user = null
  },
  logout (state) {
    state.status = {}
    state.token = null
    state.user = null
  }
}

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
}
