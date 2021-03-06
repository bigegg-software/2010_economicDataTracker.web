import Parse from '../index'
import chartDataFun from "@/utils/chartDataFun";
import store from '@/vuexStore'
export default {
    // 带年度月度季度的折线图柱状图都使用（带时间区间的）
  manualQueryData:async function (tableName,params){  //初始去数据库查询数据
           await chartDataFun.become(); 
           chartDataFun.getInThreeDays(-3);
           chartDataFun.getLatestTime(tableName); 
           params.tableName=tableName;
            let res=await new Parse.Cloud.run('getManualQueryDataMacroEconomy',params);
            res=res.data.result;
            return res;
    },
    getAllCountryName:async function() {  // 获取所有国家 好像未使用
        await chartDataFun.become();
        let res=await new Parse.Cloud.run('getAllCountryNameMacroEconomy',{tableName:'Country'});
            res=res.data.result;
        return res;
    },
    getGrossDomesticProductChartsData:async function(tableName,params) {// 获取国内生产总值
           let type = params.type;
           let res=await this.manualQueryData(tableName,params);
           
            res = res.map(item=>{
                item=item.toJSON();
                item.unit='亿元人民币';
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res));
                 if (type == 'quarterly'){
                tableres = await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }else  if(type == 'monthly'){
                tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            
            tableres=tableres.reverse();
            let tableInfo={}
            if(type=='yearly'){
                tableInfo={
                    fileName:'国内生产总值（GDP）',
                    tHeader:[
                        "年份",
                        '单位',
                        '国内生产总值',
                        '年度增速',
                    ],
                    filterVal:['year','unit','GDP','yoyGrowth'],
                    tableData:[...tableres]
                }
            }else if(type=='quarterly'){
                   tableInfo={
                    fileName:'国内生产总值（GDP）',
                    tHeader:[
                        "年份",
                        "季度",
                        '单位',
                        '当季国内生产总值',
                        '季度累计国内生产总值',
                        '当季同比增速',
                        '季度累计同比增速',
                        '季度环比增速',
                    ],
                    filterVal:['year','quarter','unit','GDP','cumulativeGDP','yoyGrowth','cumulativeYoyGrowth','qoqGDP'],
                    tableData:[...tableres]
                }
            }
            store.commit('saveChartTable',tableInfo);
            if (type == 'quarterly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }
            if(type == 'monthly'){
                res=res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
    },
      getConsumerPriceIndexChartsData:async function(tableName,params) {// 获取消费者价格指数CPI 年度、月度
           let type = params.type;
           let res=await this.manualQueryData(tableName,params);
            res = res.map(item=>{
                item=item.toJSON();
                return item
            })
            // 处理存储导出excel数据
            let tableres= await JSON.parse(JSON.stringify(res));
                if(type == 'monthly'){
                tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            
            tableres=tableres.reverse();
            let tableInfo={}
            if(type=='yearly'){
                tableInfo={
                    fileName:'消费者价格指数 CPI',
                    tHeader:[
                        "年份",
                        '消费者价格指数年度同比'
                    ],
                    filterVal:['year','yoyGrowth'],
                    tableData:[...tableres]
                }
            }else if(type=='monthly'){
                   tableInfo={
                    fileName:'消费者价格指数 CPI',
                    tHeader:[
                        "年份",
                        "月份",
                        '月度消费者价格指数同比',
                        '月度消费者价格指数环比'
                    ],
                    filterVal:['year','month','yoyCPI','momCPI'],
                    tableData:[...tableres]
                }
            }
            store.commit('saveChartTable',tableInfo);
            if (type == 'quarterly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }
            if(type == 'monthly'){
                res=res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
    },
    getPurchasingManagersIndexChartsData:async function(params) { // 采购经理⼈指数
         let type = params.type;
           let res=await this.manualQueryData('PMI',params);
            res = res.map(item=>{
                item=item.toJSON();
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
                tableres=tableres.reverse();
            let tableInfo={
                    fileName:'采购经理人指数 PMI',
                    tHeader:[
                        "年份",
                        "月份",
                        '制造业采购经理⼈指数',
                        '⾮制造业采购经理⼈指数',
                        '⽉度综合采购经理⼈指数'
                    ],
                    filterVal:['year','month','manufacturingPMI','nonManufacturingPMI','comprehensivePMI'],
                    tableData:[...tableres]
                }
            store.commit('saveChartTable',tableInfo);
            // if (type == 'quarterly'){
            //     res = res.filter(item=>{
            //         return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
            //     })
            // }
            if(type == 'monthly'){
                res=res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
    },
    getProducerPriceIndexChartsData:async function(tableName,params) {// 获取工业生产者出厂价格指数PPI 年度、月度
           let type = params.type;
           let res=await this.manualQueryData(tableName,params);
            res = res.map(item=>{
                item=item.toJSON();
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res));
                if(type == 'monthly'){
                tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            
            tableres=tableres.reverse();
            let tableInfo={}
            if(type=='yearly'){
                tableInfo={
                    fileName:'Producer Price Index (PPI)',
                    tHeader:[
                        "年份",
                        '工业生产者价格指数同比'
                    ],
                    filterVal:['year','yoyGrowth'],
                    tableData:[...tableres]
                }
            }else if(type=='monthly'){
                   tableInfo={
                    fileName:'Producer Price Index (PPI)',
                    tHeader:[
                        "年份",
                        "月份",
                        '工业生产者价格指数月度同比',
                        '工业生产者价格指数月度环比'
                    ],
                    filterVal:['year','month','yoyGrowth','momGrowth'],
                    tableData:[...tableres]
                }
            }
            store.commit('saveChartTable',tableInfo);
            if (type == 'quarterly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }
            if(type == 'monthly'){
                res=res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
    },
    getIndustryAddValueChartsData:async function(params) { // 工业增长值
         let type = params.type;
           let res=await this.manualQueryData('GIVA',params);
            res = res.map(item=>{
                item=item.toJSON();
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
                tableres=tableres.reverse();
            let tableInfo={
                    fileName:'工业增加值',
                    tHeader:[
                        "年份",
                        "月份",
                        '工业增加值月度同比',
                        '工业增加值月度累计同比'
                    ],
                    filterVal:['year','month','yoyGrowth','yoyCumulativeGrowth'],
                    tableData:[...tableres]
                }
            store.commit('saveChartTable',tableInfo);
            // if (type == 'quarterly'){
            //     res = res.filter(item=>{
            //         return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
            //     })
            // }
            if(type == 'monthly'){
                res=res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
    },
    getIndustrialProfitsChartsData:async function(tableName,params) {// 获取工业企业利润
           let type = params.type;
           let res=await this.manualQueryData(tableName,params);
           
            res = res.map(item=>{
                item=item.toJSON();
                item.unit='亿元人民币';
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            tableres=tableres.reverse();
            let tableInfo={
                    fileName:'工业企业利润',
                    tHeader:[
                        "年份",
                        '月份',
                        '单位',
                        '月度累计工业企业利润额',
                        '月度累计工业企业利润额同比',
                    ],
                    filterVal:['year','month','unit','yoyCumulativeIndustrialGrowth','yoyGrowth'],
                    tableData:[...tableres]
                }
            store.commit('saveChartTable',tableInfo);
            res=res.filter(item=>{
                return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
            })
            return {res};
    },
    getSalesConsumerGoodsChartsData:async function(tableName,params) {// 社会消费品销售总额
           let type = params.type;
           let res=await this.manualQueryData(tableName,params);
           
            res = res.map(item=>{
                item=item.toJSON();
                item.unit='亿元人民币';
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res));
             if (type == 'quarterly'){
                tableres = await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }else  if(type == 'monthly'){
                tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            
            tableres=tableres.reverse();
            let tableInfo={}
            if(type=='yearly'){
                tableInfo={
                    fileName:'社会消费品零售总额',
                    tHeader:[
                        "年份",
                        '单位',
                        '社会消费品零售总额',
                        '社会消费品零售总额同比',
                    ],
                    filterVal:['year','unit','total','yoyGrowth'],
                    tableData:[...tableres]
                }
            }else if(type=='monthly'){
                   if(params.monthType==1){
                       tableInfo={
                        fileName:'社会消费品零售总额',
                        tHeader:[
                            "年份",
                            "月份",
                            '单位',
                            '当月社会消费品零售总额',
                            '当月社会消费品零售总额同比'
                        ],
                        filterVal:['year','month','unit','total','yoyGrowth'],
                        tableData:[...tableres]
                    }
                   }else{
                       tableInfo={
                            fileName:'社会消费品零售总额',
                            tHeader:[
                                "年份",
                                "月份",
                                '单位',
                                '月度累计社会消费品零售总额',
                                '月度累计社会消费品零售总额同比'
                            ],
                            filterVal:['year','month','unit','cumulativeTotal','cumulativeYoyGrowth'],
                            tableData:[...tableres]
                        }
                   }
            }
            store.commit('saveChartTable',tableInfo);
            if (type == 'quarterly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }
            if(type == 'monthly'){
                res=res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
    },
    getNationalFinanceChartsData:async function(tableName,params) {// 国家财政收支
           let type = params.type;
           let res=await this.manualQueryData(tableName,params);
           
            res = res.map(item=>{
                item=item.toJSON();
                item.unit='亿元人民币';
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res));
            if (type == 'quarterly'){
                tableres = await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }else  if(type == 'monthly'){
                tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            
            tableres=tableres.reverse();
            let tableInfo={}
            if(type=='yearly'){
                tableInfo={
                    fileName:'财政收支情况',
                    tHeader:[
                        "年份",
                        '单位',
                        '财政收入',
                        '收入同比',
                        '财政支出',
                        '支出同比'
                    ],
                    filterVal:['year','unit','revenue','yoyRevenue','expenditure','yoyExpenditure'],
                    tableData:[...tableres]
                }
            }else if(type=='monthly'){
                   if(params.monthType==1){
                       tableInfo={
                        fileName:'财政收支情况',
                        tHeader:[
                            "年份",
                            "月份",
                            '单位',
                            '当月财政收入',
                            '当月财政支出'
                        ],
                        filterVal:['year','month','unit','revenue','expenditure'],
                        tableData:[...tableres]
                    }
                   }else{
                       tableInfo={
                            fileName:'财政收支情况',
                            tHeader:[
                                "年份",
                                "月份",
                                '单位',
                                '月度累计财政收入',
                                '月度累计收入同比',
                                '月度累计财政支出',
                                '月度累计支出同比'
                            ],
                            filterVal:['year','month','unit','cumulativeRevenue','yoyRevenue','cumulativeExpenditure','yoyExpenditure'],
                            tableData:[...tableres]
                        }
                   }
            }
            store.commit('saveChartTable',tableInfo);
            if (type == 'quarterly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
                })
            }
            if(type == 'monthly'){
                res=res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
    },
    getUnemployRegisterChartsData:async function(tableName,params) {// 获取登记失业率
        let type = params.type;
        let res = await this.manualQueryData(tableName, params);

        res = res.map(item => {
            item = item.toJSON();
            item.unit = '亿元人民币';
            return item
        })
        // 处理存储导出excel数据
        let tableres =await JSON.parse(JSON.stringify(res));
         if (type == 'quarterly') {
            tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
                return (item.year > params.start || item.quarter >= params.startQuarter) && (item.year < params.end || item.quarter <= params.endQuarter)
            })
        } else if (type == 'monthly') {
            tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
                return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
            })
        }

        tableres = tableres.reverse();
        let tableInfo = {}
        if (type == 'yearly') {
            tableInfo = {
                fileName: '城镇登记失业率',
                tHeader: [
                    "年份",
                    '单位',
                    '城镇登记失业人数',
                    '城镇登记失业率',
                ],
                filterVal: ['year', 'unit', 'unemployment', 'unemploymentRate'],
                tableData: [...tableres]
            }
        } else if (type == 'quarterly') {
            tableInfo = {
                fileName: '城镇登记失业率',
                tHeader: [
                    "年份",
                    "季度",
                    '城镇登记失业率',
                ],
                filterVal: ['year', 'quarter','unemploymentRate'],
                tableData: [...tableres]
            }
        }
        store.commit('saveChartTable', tableInfo);
        if (type == 'quarterly') {
            res = res.filter(item => {
                return (item.year > params.start || item.quarter >= params.startQuarter) && (item.year < params.end || item.quarter <= params.endQuarter)
            })
        }
        if (type == 'monthly') {
            res = res.filter(item => {
                return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
            })
        }
        return { res };
    },
    getUnemployExamineChartsData:async function(params) { // 获取调查失业率
        let type = params.type;
          let res=await this.manualQueryData('UnemploymentMonth',params);
           res = res.map(item=>{
               item=item.toJSON();
               return item
           })
           // 处理存储导出excel数据
           let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                   return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
               })
               tableres=tableres.reverse();
           let tableInfo={
                   fileName:'调查失业率',
                   tHeader:[
                       "年份",
                       "月份",
                       '调查失业率',
                       '31个大城市城镇调查失业率',
                   ],
                   filterVal:['year','month','unemploymentRate','unemploymentMajorRate'],
                   tableData:[...tableres]
               }
           store.commit('saveChartTable',tableInfo);
           // if (type == 'quarterly'){
           //     res = res.filter(item=>{
           //         return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
           //     })
           // }
           if(type == 'monthly'){
               res=res.filter(item=>{
                   return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
               })
           }
           return {res};
   },
   getInvestmentFixedAssestsChartsData:async function(params) {// 获取固定生产投资(不含农户)
    let type = params.type;
    let res=await this.manualQueryData('InvestmentFixedAssests',params);
    
     res = res.map(item=>{
         item=item.toJSON();
         item.unit='亿元人民币';
         return item
     })
     // 处理存储导出excel数据
     let tableres=
     await JSON.parse(JSON.stringify(res))
     if (type == 'quarterly'){
         tableres = await JSON.parse(JSON.stringify(res)).filter(item=>{
             return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
         })
     }else  if(type == 'monthly'){
         tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
             return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
         })
     }
     
     tableres=tableres.reverse();
     let tableInfo={}
     if(type=='yearly'){
         tableInfo={
             fileName:'固定资产投资（不含农户）',
             tHeader:[
                 "年份",
                 '单位',
                 '固定资产投资额',
                 '固定资产投资额同比',
             ],
             filterVal:['year','unit','investment','yoyGrowth'],
             tableData:[...tableres]
         }
     }else if(type=='monthly'){
            tableInfo={
             fileName:'固定资产投资（不含农户）',
             tHeader:[
                 "年份",
                 "月度",
                 '单位',
                 '月度累计固定资产投资额',
                 '月度固定资产投资额同比',
             ],
             filterVal:['year','quarter','unit','investment','yoyGrowth'],
             tableData:[...tableres]
         }
     }
     store.commit('saveChartTable',tableInfo);
     if (type == 'quarterly'){
         res = res.filter(item=>{
             return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
         })
     }
     if(type == 'monthly'){
         res=res.filter(item=>{
             return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
         })
     }
     return {res};
},
   getMoneySupplyChartsData:async function(params) { // 获取货币供应量
    let type = params.type;
      let res=await this.manualQueryData('MoneySupply',params);
       res = res.map(item=>{
           item=item.toJSON();
           return item
       })
       // 处理存储导出excel数据
       let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
               return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
           })
           tableres=tableres.reverse();
       let tableInfo={
               fileName:'获取货币供应量',
               tHeader:[
                   "年份",
                   "月份",
                   '货币和准货币（M2)',
               ],
               filterVal:['year','month','money'],
               tableData:[...tableres]
           }
       store.commit('saveChartTable',tableInfo);
       // if (type == 'quarterly'){
       //     res = res.filter(item=>{
       //         return (item.year>params.start || item.quarter>=params.startQuarter) && (item.year<params.end || item.quarter<=params.endQuarter)
       //     })
       // }
       if(type == 'monthly'){
           res=res.filter(item=>{
               return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
           })
       }
       return {res};
},
getForeignCurrencyReserveChartsData:async function(tableName,params) {// 获取国家外汇储备
    let type = params.type;
    let res=await this.manualQueryData(tableName,params);
    
     res = res.map(item=>{
         item=item.toJSON();
         item.unit='亿元人民币';
         return item
     })
     // 处理存储导出excel数据
     let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
             return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
         })
     tableres=tableres.reverse();
     let tableInfo={
             fileName:'国家外汇储备',
             tHeader:[
                 "年份",
                 '月份',
                 '单位',
                 '外汇储备',
                 '基金组织储备头寸',
                 '特别提款权',
                 '黄金（百万美元）',
                 '黄金（百万盎司）',
             ],
             filterVal:['year','month','unit','reserves','IMF','SDRs','goldUSD','goldMLN'],
             tableData:[...tableres]
         }
     store.commit('saveChartTable',tableInfo);
     res=res.filter(item=>{
         return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
     })
     return {res};
},
// 柱状图查询  饼图  暂时不用
// barQueryData:async function (tableName,params){  //初始去数据库查询数据  
//     chartDataFun.getInThreeDays(-3);
//     chartDataFun.getLatestTime(tableName); 
//     let q = new Parse.Query(tableName);
//     let limiCcount = await q.count();
//         q.limit(limiCcount);
//         // 发布的才拉取
//         q.equalTo('isCheckIn',true);
//         if(params.limit){
//             q.limit(params.limit);
//         }
//         if(params.ascending){
//             q.ascending(params.ascending);
//         }
//         if(params.descending){
//             q.descending(params.descending);
//         }
//         if(params.year){
//            q.equalTo('year',params.year); 
//         }
//         if(params.type){
//             q.equalTo('type',params.type); 
//          }
//          if(params.equalTo){ //等值
//             for(let u in params.equalTo){
//                 q.equalTo(u,params.equalTo[u])
//             }
//         }
//         if(params.containedIn){ //包含值
//             for(let c in params.containedIn){
//                 q.containedIn(c,params.containedIn[c])
//             }
//         }
//     let res = await q.find();
//     return res;
// },
getMaxMinDate:async function (tableName) {  //单独查询
    await chartDataFun.become();
    let res=await new Parse.Cloud.run('getMaxMinDateMacroEconomy',{tableName});
        res=res.data.result;
    return res;
}

}

