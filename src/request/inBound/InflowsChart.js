import Parse from '../index'

function toJson(data) {
  return JSON.parse(JSON.stringify(data))
}

export default {
  // 获取年度最大值最小值
  getMaxMinDate: async function () {
    let timeFrame = await Parse.Cloud.run('getMinMaxYears', {
      tableName: 'InwardFDI'
    });
    if (timeFrame.code == 200) {
      return `${timeFrame.data[0].min}_${timeFrame.data[0].max}`
    }
  },
  getChartsData: async function (aug) {
    let FDIOutflow = await Parse.Cloud.run('getFDIOutflowInfo', {
      type: aug.type,
      start: aug.start,
      end: aug.end
    });

    console.log(FDIOutflow);
    // return res;
  }
}
