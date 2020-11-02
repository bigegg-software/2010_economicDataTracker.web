import Parse from '../index'
export default {
    // 带年度月度季度的折线图使用
  manualQueryData:async function (tableName,params){  //初始去数据库查询数据  
            let q = new Parse.Query(tableName)
            let type = params.type;
            q.greaterThanOrEqualTo('year',params.start)
            q.lessThanOrEqualTo('year',params.end)
            if (type == 'yearly'&&!params.noMonth){
                q.equalTo('month',11)//应该是12
                q.ascending('year')
            }else if (type == 'yearly'&&params.noMonth){
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
    getInflowsChartsData:async function(params) {// 实际使用外资（实际使用外资）  折线图
           let type = params.type;
           let res=await this.manualQueryData('InwardFDI',params);
            res = res.map(item=>{
                item=item.toJSON()
                // 美元实际使用外资转百万美元
                item.inwardFDIConMillion = item.inwardFDICon * 100;
                return item
            })
            if (type == 'quarterly' || type == 'monthly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            return {res};
  },
  getNonFinancialToBRIChartsData:async function(params) {// 一带一路对华投资（企业数，实际投入外资金额）  折线图
    let res=await this.manualQueryData('BRIInvestors',params);
     res = res.map(item=>{
         item=item.toJSON();
         item.BRIAmountMillion=item.BRIAmount/100;
         return item
     })
     return {res};
},   
getForeignInvestTaxChartsData:async function(params) {// 外商投资企业税收统计（外商投资企业税收统计）  折线图
    let res=await this.manualQueryData('ForeignInvestment',params);
     res = res.map(item=>{
         item=item.toJSON();
         item.taxMillion=item.tax/100;
         return item
     })
     return {res};
},


}

