
import Parse from '../../request'
import chartDataFun from '../../utils/chartDataFun';
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
    await chartDataFun.become();
    // let BuryPoint=new Parse.Object.extend('BuryPoint');
    // let buryPoint=new BuryPoint();
    //     buryPoint.save(params);
      let res=await new Parse.Cloud.run("buryPoint",params);
  },
  }
}

export default user
