
import Parse from '../../request'
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
    // 埋点记录
  buryPoint({commit},params){
    let BuryPoint=new Parse.Object.extend('BuryPoint');
    let buryPoint=new BuryPoint();
        buryPoint.save(params);
  },
  }
}

export default user
