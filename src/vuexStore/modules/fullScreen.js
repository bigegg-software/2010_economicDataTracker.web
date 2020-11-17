const fullScreen = {
  state: {
    isFullScreen:true
  },
  mutations: {
    fullScreen(state){
        state.isFullScreen =!state.isFullScreen
    },
    setInitScreen(state){
        state.isFullScreen=true;
    }
  },

  actions: {
    setInfo({commit,state,getters},props){
      
    }
  }
}

export default fullScreen
