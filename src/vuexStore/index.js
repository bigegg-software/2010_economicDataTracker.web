import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import chartInfo from './modules/chartInfo'
import fullScreen from './modules/fullScreen'

import getters from './getters'



Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    chartInfo,
    fullScreen,
  },
  state: {

  },
  mutations: {
  },
  actions: {

  },
  getters
})
