import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import chartInfo from './modules/chartInfo'
import fullScreen from './modules/fullScreen'
import getters from './getters'
import tableTime from './modules/tableTime'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    chartInfo,
    fullScreen,
    tableTime
  },
  state: {

  },
  mutations: {
  },
  actions: {

  },
  getters
})
