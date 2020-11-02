import Parse from '../index'
export default {
    // 带年度月度季度的折线图使用
  manualQueryData:async function (tableName,params){  //初始去数据库查询数据  
            let q = new Parse.Query(tableName)
            let type = params.type;
            q.greaterThanOrEqualTo('year',params.start)
            q.lessThanOrEqualTo('year',params.end)
            if (type == 'yearly'){
                q.equalTo('month',11)//应该是12
                q.ascending('year')
            }else if(type == 'quarterly'){
                q.containedIn('month',[3,6,9,11])//应该是12
                q.ascending('year')
                q.addAscending(['month'])
            } else if (type == 'monthly'){
                q.ascending('year')
                q.addAscending(['month'])
            }
            let res = await q.find()
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
                item.investAmountMillion = item.investAmount * 100;
                item.investConversionMillion = item.investConversion * 100;
                return item
            })
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
    let type = params.type;
    let res=await this.manualQueryData('LaborServiceCooperation',params);
     res = res.map(item=>{
         item=item.toJSON()
         return item
     })
     return {res};
},
// 柱状图查询
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
    let res = await q.find();
    return res;
},
// // 对外承包前十国别市场
getTopTenCountriesToOPChart:async function(params) {
    let res=await this.barQueryData('ForeignContractAnnualRank',params);
    res = res.map(item=>{
        item=item.toJSON();
        // 美元新签合同额转百万美元
        item.newConAmountMillion=item.newConAmount*100;
        // 美元完成营业额转百万美元
        item.completedAmountMillion=item.completedAmount*100;
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
}


}

