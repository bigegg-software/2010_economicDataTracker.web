import Parse from '../index'

export default {

  getChartsData: async (aug) => { // 获取数据函数接口
    // let FDIOutflow = await Parse.Cloud.run('getFDIOutflowInfo', aug);
    // if (FDIOutflow.code == 200) {
    //     console.log(FDIOutflow.data)
    //     return FDIOutflow.data;
    // }
    let params = aug;
    let q = new Parse.Query('FDIOutflow')
    let type = params.type;
    q.greaterThanOrEqualTo('year', params.start)
    q.lessThanOrEqualTo('year', params.end)
    if (type == 'yearly') {
      q.equalTo('month', 11) //应该是12
      q.ascending('year')
    } else if (type == 'quarterly') {
      q.containedIn('month', [3, 6, 9, 11]) //应该是12
      q.ascending('year')
      q.addAscending(['month'])
    } else if (type == 'monthly') {
      q.ascending('year')
      q.addAscending(['month'])
    }
    let res = await q.find()
    res = res.map(item => {
      item = item.toJSON()
      item.investAmountMillion = item.investAmount * 100;
      item.investConversionMillion = item.investConversion * 100;
      return item
    })
    let allIndustry = res.filter(item => {
      return item.outFlowType == 1
    })
    let nonFinancial = res.filter(item => {
      return item.outFlowType == 2
    })
    if (type == 'quarterly' || type == 'monthly') {
      nonFinancial = nonFinancial.filter(item => {
        return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
      })
      allIndustry = allIndustry.filter(item => {
        return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
      })
    }
    console.log('allIndustry', allIndustry);
    console.log('nonFinancial', nonFinancial);
    return {
      allIndustry,
      nonFinancial
    };
  }
}
