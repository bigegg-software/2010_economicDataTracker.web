import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import chartInfo from './modules/chartInfo'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    chartInfo
  },
  state: {

  },
  mutations: {
  },
  actions: {

  },
  getters
})
