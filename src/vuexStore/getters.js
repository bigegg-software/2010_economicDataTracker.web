const getters = {
  chartInfo: state => state.chartInfo.chartInfo,
  userInfo:  state => state.user.info,
  latestTime:state => state.chartInfo.latestTime,
  latestNews:state => state.user.latestNews,
  isFullScreen:state=>state.fullScreen.isFullScreen,
  showOperate:state=>state.chartInfo.showOperate
}

export default getters