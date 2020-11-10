import Vue from 'vue'
import chartDataFun from '@/utils/chartDataFun'
const chartTable = {
  state: {
    // fileName:'全行业',tHeader:['这','时'],filterVal:['this','that'],tableData:[{this:'666',that:'888'},{this:'111',that:'222'}]
    chartInfo:{}
  },
  mutations: {
    saveChartTable(state,chartInfo){
      state.chartInfo=chartInfo;
    },
    downloadExcel(state) {
      chartDataFun.exportData(state.chartInfo.fileName,state.chartInfo.tHeader,state.chartInfo.filterVal,state.chartInfo.tableData)
    }
  }
}

export default chartTable
