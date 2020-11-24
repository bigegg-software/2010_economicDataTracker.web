import Vue from 'vue'

const user = {
  state: {
    info:{},
    latestNews:[]
  },
  mutations: {
    setUserInfo(state,info){
         state.info=info;
    },
    saveLatestNews(state,news) {
          state.latestNews=news;
    }
  },

  actions: {
    
  }
}

export default user
