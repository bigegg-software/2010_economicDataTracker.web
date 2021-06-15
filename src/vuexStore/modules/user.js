
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
  async buryPoint({commit},params){
    // let BuryPoint=new Parse.Object.extend('BuryPoint');
    // let buryPoint=new BuryPoint();
    //     buryPoint.save(params);
      let res=await new Parse.Cloud.run("buryPoint",params);
           console.log(JSON.parse(JSON.stringify(res)))
  },
  }
}

export default user
