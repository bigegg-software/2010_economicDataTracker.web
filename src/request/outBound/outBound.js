import Parse from '../index'

export default {
  manualQueryData:async function (tableName,params){  //初始去数据库查询数据  带年度月度季度的折线图使用
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
    getOutflowsBeltAndRoadChartsData:async function(params) {// 获取中国对“一带一路”沿线国家非金融类直接投资情况数据函数接口
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
            console.log('nonFinancial',res);
            return {res};
    }
}

