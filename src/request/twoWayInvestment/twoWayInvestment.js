import Parse from '../index'
export default {
 // 带年度月度季度的折线图使用
 manualQueryData: async function (tableName, params) {  //初始去数据库查询数据  
    let q = new Parse.Query(tableName)
    let type = params.type;
    q.greaterThanOrEqualTo('year', params.start)
    q.lessThanOrEqualTo('year', params.end)
    if (type == 'yearly' && !params.noMonth) {
        q.equalTo('month', 12)//应该是12
        q.ascending('year')
    } else if (type == 'yearly' && params.noMonth) {
        q.ascending('year')
    } else if (type == 'quarterly') {
        q.containedIn('month', [3, 6, 9, 12])//应该是12
        q.ascending('year')
        q.addAscending(['month'])
    } else if (type == 'monthly') {
        q.ascending('year')
        q.addAscending(['month'])
    }
    if (params.equalTo) { //等值
        for (let u in params.equalTo) {
            q.equalTo(u, params.equalTo[u])
        }
    }
    if (params.containedIn) { //包含值
        for (let c in params.containedIn) {
            q.containedIn(c, params.containedIn[c])
        }
    }
    let res = await q.find()
    return res;
},
    // 获取最小月 最大月
    getMaxMinMonth:async (tableName,params)=> {
        let res=await this.manualQueryData(tableName,params);
        res= res.map((item)=>{
               item=item.toJSON();
               return item;
        });
        return {minYear:res[0].year,maxYear:res[res.length-1].year,minMonth:res[0].month,maxMonth:res[res.length-1].month}
 },
    getOutflowsVsInflowsChartData:async function(params) {//单独针对年度的 双向直接投资（双向直接投资）  折线图
           let type = params.type;
           let res=await this.manualQueryData('FDIOutflowsInflows',params);
            res = res.map(item=>{
                item=item.toJSON()
                return item
            })
            
            // if (type == 'quarterly' || type == 'monthly'){
            //     res = res.filter(item=>{
            //         return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
            //     })
            // }
            return {res};
  },
  getQuarterMonthOutflowsVsInflowsChartData:async function(params) {//单独针对季度和度的 双向直接投资（双向直接投资）  折线图
    let type = params.type;
           let allIndustry=await this.manualQueryData('FDIOutflow',params);  // 全行业直接投资
            allIndustry = allIndustry.map(item=>{
                item=item.toJSON()
                item.investConversionMillion = item.investConversion * 100;
                return item
            })
            allIndustry = allIndustry.filter(item=>{
                return item.outFlowType == 1
            })
            let res = await this.manualQueryData('InwardFDI', params); //实际使用外资
            res = res.map(itemElement => {
                itemElement = itemElement.toJSON()
                // 美元实际使用外资转百万美元
                itemElement.inwardFDIConMillion = itemElement.inwardFDICon * 100;
                return itemElement
            })
     if (type == 'quarterly' || type == 'monthly'){
        allIndustry = allIndustry.filter(item=>{
            return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
        })
        res = res.filter(item=>{
            return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
        })
     }

     return {allIndustry,res};
}


}

