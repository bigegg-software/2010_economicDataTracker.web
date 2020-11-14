const getters = {
  chartInfo: state => state.chartInfo.chartInfo,
  userInfo:  state => state.user.info,
  latestTime:state => state.chartInfo.latestTime
}

export default getters