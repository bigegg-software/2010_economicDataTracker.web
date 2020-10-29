import Parse from '../index'

function toJson(data) {
  return JSON.parse(JSON.stringify(data))
}

export default {
  // 获取年度最大值最小值
  getMaxMinDate: async function () {
    let data = await Parse.Cloud.run('getMinMaxYears', {
      tableName: 'InwardFDI'
    });
    if (data.code == 200) {
      return `${data.data[0].min}_${data.data[0].max}`
    }
  },
  getChartsData: async function (aug) {
    const InwardFDI = Parse.Object.extend("InwardFDI");
    const query = new Parse.Query(InwardFDI);
    // query.equalTo("playerName", "Dan Stemkoski");
    const res = await query.find();
    console.log(toJson(res), "resss")
  }
}
