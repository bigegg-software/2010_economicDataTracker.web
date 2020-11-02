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
    getOutflowsVsInflowsChartData:async function(params) {//xxxxxx 需要重新捋 双向直接投资（双向直接投资）  折线图
           let type = params.type;
           let res=await this.manualQueryData('FDIOutflowsInflows',params);
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
  }


}

