import Parse from '../index'
import chartDataFun from "@/utils/chartDataFun";
import store from '@/vuexStore'
export default {
  // 带年度月度季度的折线图使用
  manualQueryData: async function (params) { //初始去数据库查询数据
    await chartDataFun.become();
    chartDataFun.getInThreeDays(-3);
    chartDataFun.getLatestTime(params.tableName);
    let res=await new Parse.Cloud.run('getManualQueryDataTrade',params);
    res=res.data.result;
    return res;
  },
  async getTotalTradeGoods(params) { // 中国货物进出口总值 / 差额  年度
    let type = params.type;
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      return item
    })
    let timeArr = res.map(v => `${v.year}-${v.month?v.month:""}`)
    timeArr = Array.from(new Set(timeArr))
    let data = []
    let tHeader = {
      yearly: [
        "年份",
        '进出口 (USD)',
        '进出口同比 (USD)',
        '进口 (USD)',
        '进口同比 (USD)',
        '出口 (USD)',
        '出口同比 (USD)',
        '进出口 (RMB)',
        '进出口同比 (RMB)',
        '进口 (RMB)',
        '进口同比 (RMB)',
        '出口 (RMB)',
        '出口同比 (RMB)'
      ],
    }
    let field = {
      yearly: ['year', 'USD_tradeVolume', 'USD_yoyTrade', 'USD_import', 'USD_yoyImport', 'USD_export', 'USD_yoyExport', 'RMB_tradeVolume', 'RMB_yoyTrade', 'RMB_import', 'RMB_yoyImport', 'RMB_export', 'RMB_yoyExport'],
    }
    for (let t = 0; t < timeArr.length; t++) {
      let time = timeArr[t].split('-')
      let re = res.filter(v => {
        return v.year == time[0]
      })
      let USD = re.filter(v => v.type == 1)[0]
      let RMB = re.filter(v => v.type == 2)[0]
      let obj = {}
      let op = USD ? USD : RMB
      for (let key in op) {
        obj[`year`] = op['year']
        obj[`month`] = op['month']
        obj[`USD_${key}`] = USD ? USD[key] : ""
        obj[`RMB_${key}`] = RMB ? RMB[key] : ""
      }
      data.push(obj)
    }
    let tableres = await JSON.parse(JSON.stringify(data))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值',
      tHeader: tHeader[type],
      filterVal: field[type],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return data
  },
  async getTotalTradeGoodsMonth(params) { // 中国货物进出口总值 / 差额  月度
    let dataType = params.dataType
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      return item
    })
    let timeArr = res.map(v => `${v.year}-${v.month?v.month:""}`)
    timeArr = Array.from(new Set(timeArr))
    let tHeader = {
      1: [
        "年份",
        "月份",
        '当月进出口 (USD)',
        '当月进出口同比 (USD)',
        '当月进口 (USD)',
        '当月进口同比 (USD)',
        '当月出口 (USD)',
        '当月出口同比 (USD)',
        '当月进出口 (RMB)',
        '当月进出口同比 (RMB)',
        '当月进口 (RMB)',
        '当月进口同比 (RMB)',
        '当月出口 (RMB)',
        '当月出口同比 (RMB)'
      ],
      2: [
        "年份",
        "月份",
        '累计进出口 (USD)',
        '累计进出口同比 (USD)',
        '累计进口 (USD)',
        '累计进口同比 (USD)',
        '累计出口 (USD)',
        '累计出口同比 (USD)',
        '累计进出口 (RMB)',
        '累计进出口同比 (RMB)',
        '累计进口 (RMB)',
        '累计进口同比 (RMB)',
        '累计出口 (RMB)',
        '累计出口同比 (RMB)'
      ]
    }
    let field = {
      1: ['year', 'month', 'USD_tradeVolume', 'USD_yoyTrade', 'USD_import', 'USD_yoyImport', 'USD_export', 'USD_yoyExport', 'RMB_tradeVolume', 'RMB_yoyTrade', 'RMB_import', 'RMB_yoyImport', 'RMB_export', 'RMB_yoyExport'],
      2: ['year', 'month', 'USD_cumulativeTradeVolume', 'USD_yoyCumulativeTrade', 'USD_cumulativeImport', 'USD_yoyCumulativeImport', 'USD_cumulativeExport', 'USD_yoyCumulativeExport', 'RMB_cumulativeTradeVolume', 'RMB_yoyCumulativeTrade', 'RMB_cumulativeImport', 'RMB_yoyCumulativeImport', 'RMB_cumulativeExport', 'RMB_yoyCumulativeExport']
    }
    let data = []
    for (let t = 0; t < timeArr.length; t++) {
      let time = timeArr[t].split('-')
      let re = res.filter(v => {
        return v.year == time[0] && v.month == time[1]
      })
      let USD = re.filter(v => v.type == 1)[0]
      let RMB = re.filter(v => v.type == 2)[0]
      let obj = {}
      let op = USD ? USD : RMB
      for (let key in op) {
        obj[`year`] = op['year']
        obj[`month`] = op['month']
        obj[`USD_${key}`] = USD ? USD[key] : ""
        obj[`RMB_${key}`] = RMB ? RMB[key] : ""
      }
      data.push(obj)
    }
    let tableres = await JSON.parse(JSON.stringify(data)).filter(item => {
      return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
    })
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值',
      tHeader: tHeader[dataType],
      filterVal: field[dataType],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return data
  },
  async getTotalTradeGoodsByBalance(params) { // 中国货物进出口总值 贸易差额 年度
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      return item
    })
    let timeArr = res.map(v => `${v.year}-${v.month?v.month:""}`)
    timeArr = Array.from(new Set(timeArr))
    let data = []
    for (let t = 0; t < timeArr.length; t++) {
      let time = timeArr[t].split('-')
      let re = res.filter(v => {
        return v.year == time[0]
      })
      let USD = re.filter(v => v.type == 1)[0]
      let RMB = re.filter(v => v.type == 2)[0]
      let obj = {}
      for (let key in USD) {
        obj[`year`] = USD['year']
        obj[`month`] = USD['month']
        obj[`USD_${key}`] = USD[key]
        obj[`RMB_${key}`] = RMB[key]
      }
      data.push(obj)
    }
    let tableres = await JSON.parse(JSON.stringify(data))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口贸易差额',
      tHeader: [
        "年份",
        '贸易差额',
      ],
      filterVal: ['year', 'USD_balance'],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);

    return data
  },
  async getTotalTradeGoodsMonthByBalance(params) { //中国货物进出口总值 贸易差额 月度
    let dataType = params.dataType
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      return item
    })
    let timeArr = res.map(v => `${v.year}-${v.month?v.month:""}`)
    timeArr = Array.from(new Set(timeArr))
    let tHeader = {
      1: [
        "年份",
        "月份",
        '贸易差额',
      ],
      2: [
        "年份",
        "月份",
        '贸易差额',
      ]
    }
    let field = {
      1: ['year', 'month', 'USD_balance'],
      2: ['year', 'month', 'USD_cumulativeBalance']
    }
    let data = []
    for (let t = 0; t < timeArr.length; t++) {
      let time = timeArr[t].split('-')
      let re = res.filter(v => {
        return v.year == time[0] && v.month == time[1]
      })
      let USD = re.filter(v => v.type == 1)[0]
      let RMB = re.filter(v => v.type == 2)[0]
      let obj = {}
      for (let key in USD) {
        obj[`year`] = USD['year']
        obj[`month`] = USD['month']
        obj[`USD_${key}`] = USD[key]
        obj[`RMB_${key}`] = RMB[key]
      }
      data.push(obj)
    }
    let tableres = await JSON.parse(JSON.stringify(data)).filter(item => {
      return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
    })
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口贸易差额',
      tHeader: tHeader[dataType],
      filterVal: field[dataType],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return data
  },
  async getImportExportOrigin(params) { // 中国货物进出口总值按国别/地区统计 年度
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      return item
    })
    let tableres = await JSON.parse(JSON.stringify(res))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值按国家/地区统计',
      tHeader: [
        "年份",
        '进出口',
        '进出口同比',
        '进口',
        '进口同比',
        '出口',
        '出口同比',
      ],
      filterVal: ['year', 'trade', 'yoyTrade', 'import', 'yoyImport', 'export', 'yoyExport'],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getImportExportOriginMonth(params) { // 中国货物进出口总值按国别/地区统计 月度
    let dataType = params.dataType
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._trade = item.trade
      item._import = item.import
      item._export = item.export
      item._cumulativeTrade = item.cumulativeTrade
      item._cumulativeImport = item.cumulativeImport
      item._cumulativeExport = item.cumulativeExport
      return item
    })
    let tHeader = {
      1: [
        "年份",
        '当月进出口',
        '当月进口',
        '当月出口',
      ],
      2: [
        "年份",
        "月份",
        '累计进出口',
        '累计进出口同比',
        '累计进口',
        '累计进口同比',
        '累计出口',
        '累计出口同比',
      ]
    }
    let field = {
      1: ['year', 'trade', 'import', 'export', ],
      2: ['year', 'month', 'cumulativeTrade', 'yoyCumulativeTrade', 'cumulativeImport', 'yoyCumulativeImport', 'cumulativeExport', 'yoyCumulativeExport']
    }
    let tableres = await JSON.parse(JSON.stringify(res))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值按国家/地区统计',
      tHeader: tHeader[dataType],
      filterVal: field[dataType],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getImportExportCommodity(params) { //中国货物进出口总值按商品类别统计 年度
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._import = item.import / 1000
      item._export = item.export / 1000
      item._cumulativeExport = item.cumulativeExport / 1000
      item._cumulativeImport = item.cumulativeImport / 1000
      return item
    })
    let tableres = await JSON.parse(JSON.stringify(res))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值按商品类别统计',
      tHeader: [
        "年份",
        "商品类别",
        "商品类别（英文）",
        '进口',
        '进口同比',
        '出口',
        '出口同比',
      ],
      filterVal: ['year','categoryZH','categoryEN', '_cumulativeImport', 'yoyCumulativeImport', '_cumulativeExport', 'yoyCumulativeExport'],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getImportExportCommodityMonth(params) { // 中国货物进出口总值按商品类别统计 月度
    let dataType = params.dataType
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._import = item.import / 1000
      item._export = item.export / 1000
      item._cumulativeImport = item.cumulativeImport / 1000
      item._cumulativeExport = item.cumulativeExport / 1000
      return item
    })
    let tHeader = {
      1: [
        "年份",
        "商品类别",
        "商品类别（英文）",
        '当月进口',
        '当月出口',
      ],
      2: [
        "年份",
        "月份",
        "商品类别",
        "商品类别（英文）",
        '累计进口',
        '累计进口同比',
        '累计出口',
        '累计出口同比',
      ]
    }
    let field = {
      1: ['year', 'categoryZH','categoryEN', '_import', '_export'],
      2: ['year', 'month', 'categoryZH','categoryEN', '_cumulativeImport', 'yoyCumulativeImport', '_cumulativeExport', 'yoyCumulativeExport']
    }
    let tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
      return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
    })
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值按商品类别统计',
      tHeader: tHeader[dataType],
      filterVal: field[dataType],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getImportExportEnterprise(params) { // 货物进出口总值按企业性质统计 年度 月度
    let enterpriseType = params.enterpriseType
    let type = params.type
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._importForeignInvestedEns = item.importForeignInvestedEns / 1000
      item._importOtherEns = item.importOtherEns / 1000
      item._importPrivateOwnedEns = item.importPrivateOwnedEns / 1000
      item._importStateOwnedEns = item.importStateOwnedEns / 1000
      return item
    })
    let timeArr = res.map(v => `${v.year}-${v.month?v.month:""}`)
    timeArr = Array.from(new Set(timeArr))
    let data = []
    for (let t = 0; t < timeArr.length; t++) {
      let time = timeArr[t].split('-')
      let re = res.filter(v => {
        if (type == 'yearly') {
          return v.year == time[0]
        }
        if (type == 'monthly') {
          return v.year == time[0] && v.month == time[1]
        }
      })
      let imp = re.filter(v => v.type == 1)[0]
      let exp = re.filter(v => v.type == 2)[0]
      let obj = {}
      let op = imp ? imp : exp
      for (let key in op) {
        obj[`year`] = op['year']
        obj[`month`] = op['month']
        obj[`IMP${key}`] = imp ? imp[key] : ""
        obj[`EXP${key}`] = exp ? exp[key] : ""
        obj['enterpriseType'] = enterpriseType.ch
        obj['enterpriseTypeEN'] = enterpriseType.en
      }
      data.push(obj)
    }
    let field = {
      yearly: {
        1: ['year', 'enterpriseType','enterpriseTypeEN', 'IMP_importStateOwnedEns', 'IMPyoyImportStateOwnedEns', 'EXP_importStateOwnedEns', 'EXPyoyImportStateOwnedEns'],
        2: ['year', 'enterpriseType','enterpriseTypeEN', 'IMP_importForeignInvestedEns', 'IMPyoyImportForeignInvestedEns', 'EXP_importForeignInvestedEns', 'EXPyoyImportForeignInvestedEns'],
        3: ['year', 'enterpriseType','enterpriseTypeEN', 'IMP_importPrivateOwnedEns', 'IMPyoyImportPrivateOwnedEns', 'EXP_importPrivateOwnedEns', 'EXPyoyImportPrivateOwnedEns'],
        4: ['year', 'enterpriseType','enterpriseTypeEN', 'IMP_importOtherEns', 'IMPyoyImportOtherEns', 'EXP_importOtherEns', 'EXPyoyImportOtherEns'],
      },
      monthly: {
        1: ['year', 'month', 'enterpriseType','enterpriseTypeEN', 'IMP_importStateOwnedEns', 'IMPyoyImportStateOwnedEns', 'EXP_importStateOwnedEns', 'EXPyoyImportStateOwnedEns'],
        2: ['year', 'month', 'enterpriseType','enterpriseTypeEN', 'IMP_importForeignInvestedEns', 'IMPyoyImportForeignInvestedEns', 'EXP_importForeignInvestedEns', 'EXPyoyImportForeignInvestedEns'],
        3: ['year', 'month', 'enterpriseType','enterpriseTypeEN', 'IMP_importPrivateOwnedEns', 'IMPyoyImportPrivateOwnedEns', 'EXP_importPrivateOwnedEns', 'EXPyoyImportPrivateOwnedEns'],
        4: ['year', 'month', 'enterpriseType','enterpriseTypeEN', 'IMP_importOtherEns', 'IMPyoyImportOtherEns', 'EXP_importOtherEns', 'EXPyoyImportOtherEns'],
      }
    }
    let tHeader = {
      yearly: [
        "年份",
        '企业性质',
        '企业性质（英文）',
        '进口',
        '进口同比',
        '出口',
        '出口同比',
      ],
      monthly: [
        "年份",
        '月份',
        '企业性质',
        '企业性质（英文）',
        '进口',
        '进口同比',
        '出口',
        '出口同比',
      ],
    }
    let tableres
    if (type == 'yearly') {
      tableres = await JSON.parse(JSON.stringify(data))
    }
    if (type == 'monthly') {
      tableres = await JSON.parse(JSON.stringify(data)).filter(item => {
        return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
      })
    }
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值按企业性质统计',
      tHeader: tHeader[type],
      filterVal: field[type][enterpriseType.id],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return data
  },
  async getImportExportCustomRegime(params) { // 中国货物进出口总值按贸易方式统计 年度666
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._monthlyTrade = item.monthlyTrade / 1000
      item._monthlyImport = item.monthlyImport / 1000
      item._monthlyExport = item.monthlyExport / 1000
      item._monthlyCulumativeTrade = item.monthlyCulumativeTrade / 1000
      item._monthlyCulumativeImport = item.monthlyCulumativeImport / 1000
      item._monthlyCulumativeExport = item.monthlyCulumativeExport / 1000
      return item
    })
    let tableres = await JSON.parse(JSON.stringify(res))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值按贸易方式统计',
      tHeader: [
        "年份",
        "贸易方式",
        "贸易方式（英文）",
        '进口',
        '进口同比',
        '出口',
        '出口同比',
      ],
      filterVal: ['year','customRegime','customRegimeEN', '_monthlyCulumativeImport', 'yoyMonthlyCumulativeImport', '_monthlyCulumativeExport', 'yoyMonthlyCumulativeExport'],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getImportExportCustomRegimeMonth(params) { // 中国货物进出口总值按贸易方式统计 月度
    let dataType = params.dataType
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._monthlyTrade = item.monthlyTrade / 1000
      item._monthlyImport = item.monthlyImport / 1000
      item._monthlyExport = item.monthlyExport / 1000
      item._monthlyCulumativeTrade = item.monthlyCulumativeTrade / 1000
      item._monthlyCulumativeImport = item.monthlyCulumativeImport / 1000
      item._monthlyCulumativeExport = item.monthlyCulumativeExport / 1000
      return item
    })
    let tHeader = {
      1: [
        "年份",
        "月份",
        "贸易方式",
        "贸易方式（英文）",
        '当月进口',
        '当月进口同比',
        '当月出口',
        '当月出口同比',
      ],
      2: [
        "年份",
        "月份",
        "贸易方式",
        "贸易方式（英文）",
        '累计进口',
        '累计进口同比',
        '累计出口',
        '累计出口同比',
      ]
    }
    let field = {
      1: ['year','month', 'customRegime', 'customRegimeEN',  '_monthlyImport', 'yoyMonthlyImport', '_monthlyExport', 'yoyMonthlyExport'],
      2: ['year','month', 'customRegime', 'customRegimeEN',  '_monthlyCulumativeImport', 'yoyMonthlyCumulativeImport', '_monthlyCulumativeExport', 'yoyMonthlyCumulativeExport'],
    }
    let tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
      return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
    })
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国货物进出口总值按贸易方式统计',
      tHeader: tHeader[dataType],
      filterVal: field[dataType],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getForeignInvestedTradeEns(params) { // 外商投资企业进出口总值 年度
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._monthlyTrade = item.monthlyTrade / 1000
      item._monthlyImport = item.monthlyImport / 1000
      item._monthlyExport = item.monthlyExport / 1000
      item._monthlyCulumativeTrade = item.monthlyCulumativeTrade / 1000
      item._monthlyCulumativeImport = item.monthlyCulumativeImport / 1000
      item._monthlyCulumativeExport = item.monthlyCulumativeExport / 1000
      return item
    })
    let tableres = await JSON.parse(JSON.stringify(res))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '外商投资企业进出口总值',
      tHeader: [
        "年份",
        '进口',
        '出口',
        '进口同比',
        '出口同比'
      ],
      filterVal: ['year', '_monthlyCulumativeImport', '_monthlyCulumativeExport', 'yoyMonthlyCumulativeImport', 'yoyMonthlyCumulativeExport'],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getForeignInvestedTradeEnsMonth(params) { // 外商投资企业进出口总值 月度
    let dataType = params.dataType
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      item._monthlyTrade = item.monthlyTrade / 1000
      item._monthlyImport = item.monthlyImport / 1000
      item._monthlyExport = item.monthlyExport / 1000
      item._monthlyCulumativeTrade = item.monthlyCulumativeTrade / 1000
      item._monthlyCulumativeImport = item.monthlyCulumativeImport / 1000
      item._monthlyCulumativeExport = item.monthlyCulumativeExport / 1000
      return item
    })
    let tHeader = {
      1: [
        "年份",
        '当月进口',
        '当月出口',
      ],
      2: [
        "年份",
        // "累计进出口",
        // "累计进出口同比",
        '累计进口',
        '累计进口同比',
        '累计出口',
        '累计出口同比',
      ]
    }
    let field = {
      1: ['year', '_monthlyImport', '_monthlyExport'],
      2: ['year', '_monthlyCulumativeImport', 'yoyMonthlyCumulativeImport', '_monthlyCulumativeExport', 'yoyMonthlyCumulativeExport'], // '_monthlyCulumativeTrade', 'yoyMonthlyCumulativeTrade',
    }
    let tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
      return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
    })
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '外商投资企业进出口总值',
      tHeader: tHeader[dataType],
      filterVal: field[dataType],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getTotalTradeServicesVolume(params) { // 中国服务贸易进出口总值 年度 月度
    let type = params.type
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      return item
    })
    let tHeader = {
      yearly: [
        "年份",
        '当月进口',
        '当月出口',
      ],
      monthly: [
        "年份",
        '月份',
        '当月进口',
        '当月出口',
      ]
    }
    let filed = {
      yearly: ['year', 'import', 'export'],
      monthly: ['year', 'month', 'import', 'export']
    }
    let tableres
    if (type == 'yearly') {
      tableres = await JSON.parse(JSON.stringify(res))
    }
    if (type == 'monthly') {
      tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
        return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
      })
    }
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国服务贸易进出口总值',
      tHeader: tHeader[type],
      filterVal: filed[type],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return res
  },
  async getTradeServicesTypeVolume(params) { // 中国服务贸易分类统计 只有年度
    let res = await this.manualQueryData(params);
    res = res.map(item => {
      item = item.toJSON()
      return item
    })
    let timeArr = res.map(v => `${v.year}-${v.month?v.month:""}`)
    timeArr = Array.from(new Set(timeArr))
    let data = []
    for (let t = 0; t < timeArr.length; t++) {
      let time = timeArr[t].split('-')
      let re = res.filter(v => v.year == time[0])
      let imp = re.filter(v => v.type == 1)[0]
      let exp = re.filter(v => v.type == 2)[0]
      let obj = {}
      let op = imp ? imp : exp
      if (!op.volume && op.volume != 0) {
        op.volume = ''
      }
      for (let key in op) {
        obj[`year`] = op['year']
        obj[`industry`] = op['industry']
        obj[`IMP${key}`] = imp ? imp[key] : ""
        obj[`EXP${key}`] = exp ? exp[key] : ""
      }
      data.push(obj)
    }
    let tableres = await JSON.parse(JSON.stringify(data))
    tableres = tableres.reverse();
    let tableInfo = {
      fileName: '中国服务贸易分类统计',
      tHeader: [
        "年份",
        '当月进口',
        '当月出口',
      ],
      filterVal: ['year', 'IMPvolume', 'EXPvolume'],
      tableData: [...tableres]
    }
    store.commit('saveChartTable', tableInfo);
    return data
  },
  async getCountryList(searchValue, activeKey) { // 获取所有国家  //要把countrys传进去
    await chartDataFun.become();
    let countrys = [];
    if (activeKey == 'yearly') {
      countrys = await chartDataFun.getCountryName('ImportExportOrigin', 'country');
    } else if (activeKey == 'monthly') {
      countrys = await chartDataFun.getCountryName('ImportExportOriginMonth', 'country');
    }
    let params={}
    params.searchValue=searchValue;
    params.activeKey=activeKey;
    params.countrys=countrys;
    let res=await new Parse.Cloud.run('getAllTradeCountry',params);
    res=res.data.result;
    return res;
  },
}
