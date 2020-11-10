import Parse from '../index'
import chartDataFun from "@/utils/chartDataFun";
import store from '@/vuexStore'
export default {
    // 带年度月度季度的折线图使用
  manualQueryData:async function (tableName,params){  //初始去数据库查询数据  
            let q = new Parse.Query(tableName)
            let type = params.type;
            q.greaterThanOrEqualTo('year',params.start)
            q.lessThanOrEqualTo('year',params.end)
            if (type == 'yearly'&&!params.noMonth){
                q.equalTo('month',12)//应该是12
                q.ascending('year')
            }else if (type == 'yearly'&&params.noMonth){
                q.ascending('year')
            }else if(type == 'quarterly'){
                q.containedIn('month',[3,6,9,12])//应该是12
                q.ascending('year')
                q.addAscending(['month'])
            } else if (type == 'monthly'){
                q.ascending('year')
                q.addAscending(['month'])
            }
            if(params.equalTo){ //等值
                for(let u in params.equalTo){
                    q.equalTo(u,params.equalTo[u])
                }
            }
            if(params.containedIn){ //包含值
                for(let c in params.containedIn){
                    q.containedIn(c,params.containedIn[c])
                }
            }
            let res = await q.find()
            return res;
    },
// 各州国家金额求和
sumSameYearData:async (sourceData,field)=> {
    let yearArr=[];
    let resD=[];
    sourceData.forEach(async (item)=>{
        yearArr.push(item.year);
    });
    yearArr=Array.from(new Set(yearArr));
    for(let i=0; i<yearArr.length;i++){
        let currentYear=yearArr[i];
        let mount=0;
        for(let u=0;u<sourceData.length;u++) {
            let item=sourceData[u];
            if(item.year==currentYear){
            mount+=item[field];
            }
        }
        resD.push({
        year:currentYear,
        mount:mount/100
        });
    }
    return resD;
},
    getAllCountryName:async function() {  // 获取所有国家
        let q = new Parse.Query('Country');
        q.limit(500);
        let res=await q.find();
        res = res.map( item=>{
            item=item.toJSON();
            item.ch=item.abbreviationZH;
            item.en=item.abbreviationEN;
            item.searchArr= [...item.abbreviationZH.split(''),...item.abbreviationEN.split(' ')];
            item.checked=false;
            item.show=true;
            return item;
        });
        return res;
    },
    getOutFlowsChartsData:async function(params) {// 获取中国对外直接投资流量数据函数接口
        // let FDIOutflow = await Parse.Cloud.run('getFDIOutflowInfo', aug);
        // if (FDIOutflow.code == 200) {
        //     console.log(FDIOutflow.data)
        //     return FDIOutflow.data;
        // }
           let type = params.type;
           let res=await this.manualQueryData('FDIOutflow',params);
            res = res.map(item=>{
                item=item.toJSON()
                if(item.outFlowType==1){
                    item.outFlowTypeCH='全行业'
                }else if(item.outFlowType==2){
                    item.outFlowTypeCH='非金融'
                }
                item.investAmountMillion = item.investAmount * 100;
                item.investConversionMillion = item.investConversion * 100;
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
            })
            tableres=tableres.reverse();
            let tableInfo={
            fileName:'中国对外直接投资流量',
            tHeader:[
                "年",
                "月份",
                '中国对外直接投资流量',
                '中国对外直接投资流量同比',
                '单位',
                '类型'
            ],
            filterVal:['year','month','investConversion','conversionYOY','conversionUnit','outFlowTypeCH'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
            let allIndustry = res.filter(item=>{
                return item.outFlowType == 1
            })
            let nonFinancial = res.filter(item=>{
                return item.outFlowType == 2
            })
            if (type == 'quarterly' || type == 'monthly'){
                nonFinancial = nonFinancial.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
                allIndustry = allIndustry.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {allIndustry,nonFinancial};
    },
    getOutflowsBeltAndRoadChartsData:async function(params) {// 获取中国对“一带一路”沿线国家非金融类直接投资情况数据函数接口（新签合同，完成营业额 投资金额）  折线图
           let type = params.type;
           let res=await this.manualQueryData('FDIOutflowsBRICountry',params);
            res = res.map(item=>{
                item=item.toJSON()
                // 美元投资金额转百万美元
                item.investConversionMillion = item.investConversion * 100;
                // 美元新签合同额转百万美元
                item.newConAmountConMillion = item.newConAmountCon * 100;
                // 美元完成营业额转百万美元
                item.completedAmountConMillion = item.completedAmountCon * 100;
                return item
            })
            if (type == 'quarterly' || type == 'monthly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
  },
  getOverSeasProjectsChartsData:async function(params) {// 获取中国对外承包工程数据函数接口(完成营业额 新签合同额)  //折线图
    let type = params.type;
    let res=await this.manualQueryData('ForeignContract',params);
     res = res.map(item=>{
         item=item.toJSON()
         // 美元完成营业额转百万美元
         item.completedAmountConMillion = item.completedAmountCon * 100;
         // 美元新签合同额转百万美元
         item.newConAmountConMillion = item.newConAmountCon * 100;
         // 人民币完成营业额转百万人民币
         item.completedAmountMillion = item.completedAmount * 100;
         // 人民币新签合同额转百万人民币
         item.newConAmountMillion = item.newConAmount * 100;
         return item
     })
     if (type == 'quarterly' || type == 'monthly'){
         res = res.filter(item=>{
             return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
         })
     }
     return {res};
},
getTradeVolumeChartChartsData:async function(params) {//获取中国对外劳务合作(派出人数)  //折线图
    let res=await this.manualQueryData('LaborServiceCooperation',params);
     res = res.map(item=>{
         item=item.toJSON()
         return item
     })
     return {res};
},
getoutstocksChartsData:async function(params) {//获取中国对外直接投资存量（投资存量）  //折线图
    let res=await this.manualQueryData('FDIOutflowsInflows',params);
     res = res.map(item=>{
         item=item.toJSON()
         return item
     })
     let tableres=await JSON.parse(JSON.stringify(res));
     tableres=tableres.reverse();
            let tableInfo={
            fileName:'中国对外直接投资存量',
            tHeader:[
                "年份",
                '中国对外直接投资存量',
                '单位'
            ],
            filterVal:['year','outward_FDI_stocks','unit'],
            tableData:[...tableres]
            }
     store.commit('saveChartTable',tableInfo);
     return {res};
},
getOutflowsOutstocksByDestinationChartsData:async function(tableName,params,filed) {// 获取中国对外直接投资流量按国家和地区统计-按大洲统计
       let res=await this.manualQueryData(tableName,params);
       res = res.map(item=>{
            item=item.toJSON()
            return item
        })

        let Asia = res.filter(item=>{
            return item.continent == '亚洲'
        })
        Asia=await this.sumSameYearData(Asia,filed);

        let Europe = res.filter(item=>{
            return item.continent == '欧洲'
        })
        Europe=await this.sumSameYearData(Europe,filed);

        let Oceania = res.filter(item=>{
            return item.continent == '大洋洲'
        })
        Oceania=await this.sumSameYearData(Oceania,filed);

        let North_America = res.filter(item=>{
            return item.continent == '北美洲'
        })
        North_America=await this.sumSameYearData(North_America,filed);

        let Antarctica = res.filter(item=>{
            return item.continent == '南极洲'
        })
        Antarctica=await this.sumSameYearData(Antarctica,filed);

        let South_America = res.filter(item=>{
            return item.continent == '南美洲'
        })
        South_America=await this.sumSameYearData(South_America,filed);

        let Africa = res.filter(item=>{
            return item.continent == '非洲'
        })
        Africa=await this.sumSameYearData(Africa,filed);

        return {Asia,Europe,Oceania,North_America,Antarctica,South_America,Africa};
},///
getFlowsAndStocksByDestinationChartsData:async function(tableName,params,filed) {//获取中国对外直接投资流量|存量按国家和地区统计-按国家和地区统计  //折线图
    let res=await this.manualQueryData(tableName,params);
    let allresult=[];
     res = res.map(item=>{
         item=item.toJSON()
         return item;
     })
     if(params.containedIn&&params.containedIn.country){
         for (let vk = 0; vk < params.containedIn.country.length; vk++) {
                const element = params.containedIn.country[vk];
                let vkData=res.filter(it=>{
                    console.log(it)
                           it[filed+'Million']=Number(it[filed])/100;
                    return it.country==element;
                })
                console.log(vkData)
                allresult[vk]=vkData;
            }
     }
     
     return {res:allresult};
},
// 柱状图查询  饼图
barQueryData:async function (tableName,params){  //初始去数据库查询数据  
    let q = new Parse.Query(tableName);
        if(params.limit){
            q.limit(params.limit);
        }
        if(params.ascending){
            q.ascending(params.ascending);
        }
        if(params.descending){
            q.descending(params.descending);
        }
        if(params.year){
           q.equalTo('year',params.year); 
        }
        if(params.type){
            q.equalTo('type',params.type); 
         }
         if(params.equalTo){ //等值
            for(let u in params.equalTo){
                q.equalTo(u,params.equalTo[u])
            }
        }
        if(params.containedIn){ //包含值
            for(let c in params.containedIn){
                q.containedIn(c,params.containedIn[c])
            }
        }
    let res = await q.find();
    return res;
},
// // 对外承包前十国别市场
getTopTenCountriesToOPChart:async function(params) {
    let res=await this.barQueryData('ForeignContractAnnualRank',params);
    res = res.map(item=>{
        item=item.toJSON();
        // 美元新签/完成合同额转百万美元
        item.amountMillion=item.amount*100;
        return item;
    });
    return {res};
},
// 对外劳务合作前十位目的地国家和12月末前十位国家
getLaborServiceTop10AnnualRankChart:async function(params) {
    let res=await this.barQueryData('LaborServiceTop10AnnualRank',params);
    res = res.map(item=>{
        item=item.toJSON();
        return item;
    });
    return {res};
},
// 对外劳务合作派出人数主要行业  饼图
getIndustryOfWorkersNumChart:async function(params) {
    let res=await this.barQueryData('LaborServiceIndustry',params);
    res = res.map(item=>{
        item=item.toJSON();
        item.variousTypesPerNumMillion= item.variousTypesPerNum/100;
        return item;
    });
    return {res};
},
// 对外直接投资流量历年前20国家
getFlowsTwentyDestinationChart:async function(params) {
    let res=await this.barQueryData('FDITop20Outflow',params);
    res = res.map(item=>{
        item=item.toJSON();
        item.outflowMillion=item.outflow/100;
        return item;
    });
    return {res};
},
// 对外直接投资存量历年前20国家
getStocksTwentyDestinationChart:async function(params) {
    let res=await this.barQueryData('FDITop20Stock',params);
    res = res.map(item=>{
        item=item.toJSON();
        item.stocksMillion=item.stocks/100;
        return item;
    });
    return {res};
},
//对外承包工程前十项目
getForeignContractNewConRank: async function (params) {
    let res = await this.barQueryData('ForeignContractNewConRank', params);
    res = res.map(item => {
        item = item.toJSON();
        item.stocksMillion = item.stocks / 100;
        return item;
    });
    return { res };
},
//中国对外投资中------ 行业分布情况
getoutflowsByIndustryBarChartsData:async function(params) {//获取  //柱状图加折线图
    let res=await this.manualQueryData('FDIOutflowsIndustry',params);
     res = res.map(item=>{
         item=item.toJSON()
        //  需要换算单位
         item.outflowsMillion=item.outflows*100
         return item
     })
     let industrys=chartDataFun.industry();
        let resoult=[];
      for (let k = 0; k < industrys.length; k++) {
          let element = industrys[k].ch;
          let elementEn = industrys[k].en;
          let re=res.filter(item=>{
              if(item.industry == element){
                item.industryEn=elementEn;
              }
            return item.industry == element
          })
          if(re.length){
            resoult.push(re);
          }
      }
      res=resoult;
     return {res};
},
 //中国对外直接投资存量按国家和地区统计
 getFDIStock: async function (params) {
    let res = await this.barQueryData('FDIStock', params);
    res = res.map(item => {
        item = item.toJSON();
        item.stocksMillion = item.stocks / 100;
        return item;
    });
    return { res };
},
//中国对外直接投资流量按国家和地区统计
getFDIOutflowDestination: async function (params) {
    let res = await this.barQueryData('FDIOutflowDestination', params);
    res = res.map(item => {
        item = item.toJSON();
        item.stocksMillion = item.stocks / 100;
        return item;
    });
    return { res };
},

//中国对主要经济体投资按行业统计
getFDIMajorEconomiesIndustry: async function (params) {
    let res = await this.barQueryData('FDIMajorEconomiesIndustry', params);
    res = res.map(item => {
        item = item.toJSON();
        item.outflowsMillion = item.outflows / 100;
        return item;
    });
    return { res };
}

}

