import Vue from 'vue'
import Vuex from 'vuex'

import { account } from './module/account'
import { company } from './module/company'
import { links } from './module/links'
import { device } from './module/device'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    account,
    company,
    device,
    links
  }
})
