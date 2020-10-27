import Parse from '../index'

function toJson(data) {
  return JSON.parse(JSON.stringify(data))
}

function changeData() {

}
export default {
  // 获取年度最大值最小值
  getMaxMinDate: async function () {
    let FDIOutflow = await Parse.Cloud.run('getMinMaxYears', {
      tableName: 'FDIOutflow'
    });
    // console.log(FDIOutflow)
    if (FDIOutflow.code == 200) {
      return `${FDIOutflow.data[0].min}_${FDIOutflow.data[0].max}`
    }
  },
  getChartsData: async function (aug) {
    // console.log(aug);
    let FDIOutflow = await Parse.Cloud.run('getFDIOutflowInfo', {
      type: aug.type,
      start: aug.start,
      end: aug.end
    });

    console.log(FDIOutflow);
    // return res;
  }
}
