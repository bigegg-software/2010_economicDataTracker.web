import Vue from 'vue'
import chartDataFun from '@/utils/chartDataFun'
const chartTable = {
  state: {
    // fileName:'全行业',tHeader:['这','时'],filterVal:['this','that'],tableData:[{this:'666',that:'888'},{this:'111',that:'222'}]
    chartInfo:{},
    latestTime:'',
    showOperate:true,
    DBMinMaxDateQM:{},//数据库月度季度情况下的最大年月和最小年月
    currentTab:'',
  },
  mutations: {
    saveChartTable(state,chartInfo){
      state.chartInfo=chartInfo;
    },
    downloadExcel(state) {
      chartDataFun.exportData(state.chartInfo.fileName,state.chartInfo.tHeader,state.chartInfo.filterVal,state.chartInfo.tableData)
    },
    saveLatestTime(state,time){
       state.latestTime=time;
    },
    setShowOperate(state,status) {  //表格时隐藏一些操作
        state.showOperate=status;
    },
    setDBMinMaxDateQM(state,date) { //数据库月度季度情况下的最大年月和最小年月
      let min=date.Y.split('_')[0],
          max=date.Y.split('_')[1],
          minM=date.M.split('_')[0],
          maxM=date.M.split('_')[1];
          minM=minM<10?'0'+minM:minM;
          maxM=maxM<10?'0'+maxM:maxM;
          let minQ=Math.ceil(minM / 3);
          let maxQ=Math.ceil(maxM / 3);
    let minQM = Math.ceil(minM / 3) * 3;
    if (minQM < 10) {
      minQM = '0' + minQM;
    }
    let maxQM = Math.ceil(maxM / 3) * 3;
    if (maxQM < 10) {
      maxQM = '0' + maxQM;
    }
      let data={
             min,//最小年
             max,//最大年
             minM,//最小月
             maxM,//最大月
             minQM,//最小季度对应的月份
             maxQM,//最大季度对应的月份
             minQ,//最小季度
             maxQ,//最大季度
             minYQ:`${min}-${minQM}`,//最小年季
             maxYQ:`${max}-${maxQM}`,//最大年季
             minYM:`${min}-${minM}`,//最小年月  xxxx-xx
             maxYM:`${max}-${maxM}`,//最大年月  xxxx-xx
             ...date,  //Y:最小年_最大年 2004_2020  M:最小月_最大月 1_9
       }
        state.DBMinMaxDateQM=data;
        
        console.log(state.DBMinMaxDateQM)
    },
    setCurrentTab(state,tab){
        state.currentTab=tab;
        console.log(state.currentTab)
    }
  }
}

export default chartTable
