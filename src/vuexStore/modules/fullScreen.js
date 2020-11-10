const fullScreen = {
  state: {
    isFullScreen:true
  },
  mutations: {
    fullScreen(state){
        state.isFullScreen =!state.isFullScreen
    }
  },

  actions: {
    setInfo({commit,state,getters},props){
      
    }
  }
}

export default fullScreen
