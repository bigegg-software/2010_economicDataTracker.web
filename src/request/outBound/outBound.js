import Parse from '../index'
import chartDataFun from "@/utils/chartDataFun";
import store from '@/vuexStore'
export default {
    // 带年度月度季度的折线图使用
  manualQueryData:async function (tableName,params){  //初始去数据库查询数据 
           chartDataFun.getInThreeDays(-3);
           chartDataFun.getLatestTime(tableName); 
            let q = new Parse.Query(tableName);
            let limiCcount = await q.count();
            q.limit(limiCcount);
            // 发布的才拉取
            q.equalTo('isCheckIn',true);
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
            let res = await q.find();
            return res;
    },
// 各州国家金额求和
sumSameYearData:async (sourceData,field,name)=> {
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
           if(item[field]){
               mount+=item[field];
           }else{
            mount+=0;
           }
            }
        }
        resD.push({
        nameEn:sourceData[0].continentEn,
        name,
        unit:sourceData[0].unit,
        unitMillion:'百万美元',
        year:currentYear,
        mount:!!mount||mount==0?mount/100:undefined
        });
    }
    return resD;
},
    getAllCountryName:async function(prop,countrys) {  // 获取所有国家
        let q = new Parse.Query('Country');
        q.containedIn(prop,countrys);
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
        res=res.sort((a,b)=>{return (a.en + '').localeCompare(b.en + '')});
        return res;
    },
    getOutFlowsChartsData:async function(tableName,params) {// 获取中国对外直接投资流量数据函数接口
        // let FDIOutflow = await Parse.Cloud.run('getFDIOutflowInfo', aug);
        // if (FDIOutflow.code == 200) {
        //     return FDIOutflow.data;
        // }
           let type = params.type;
           let res=await this.manualQueryData(tableName,params);
            res = res.map(item=>{
                item=item.toJSON()
                if(item.outFlowType==1){
                    item.outFlowTypeCH='中国对外全行业直接投资';
                    item.outFlowTypeEN='All-sector FDI outflows';
                }else if(item.outFlowType==2){
                    item.outFlowTypeCH='中国对外非金融直接投资'
                    item.outFlowTypeEN='Non-financial FDI outflows'
                }
                item.investAmountMillion = !!item.investAmount || item.investAmount==0?item.investAmount *10*10:undefined;
                item.investConversionMillion = !!item.investConversion ||item.investAmount==0 ? item.investConversion *10*10:undefined;
                item.conversionUnitMillion='百万美元'
                return item
            })
            // 处理存储导出excel数据
            let tableres=await JSON.parse(JSON.stringify(res));
            if (type == 'quarterly' || type == 'monthly'){
               tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
                return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
            })
            }
            // let tableres=await JSON.parse(JSON.stringify(res)).filter(item=>{
            //     return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
            // })
            tableres=tableres.reverse();
            let tableInfo={
            fileName:'中国对外直接投资流量',
            tHeader:[
                "年",
                type!='yearly'?"月份":'',
                '单位',
                '中国对外直接投资流量',
                '中国对外直接投资流量同比',
                '类型（英文）',
                '类型'
            ].filter(item=>item!=''),
            filterVal:['year',type!='yearly'?'month':'','conversionUnitMillion','investConversionMillion','conversionYOY','outFlowTypeEN','outFlowTypeCH'].filter(item=>item!=''),
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
    getOutflowsBeltAndRoadChartsData:async function(params,tabIndex) {// 获取中国对“一带一路”沿线国家非金融类直接投资情况数据函数接口（新签合同，完成营业额 投资金额）  折线图
           let type = params.type;
           let res=await this.manualQueryData('FDIOutflowsBRICountry',params);
            res = res.map(item=>{
                item=item.toJSON()
                // 美元投资金额转百万美元
                item.investConversionMillion =!!item.investConversion||item.investConversion==0? item.investConversion *10*10:undefined;
                // 美元新签合同额转百万美元
                item.newConAmountConMillion =!!item.newConAmountCon||item.newConAmountCon==0? item.newConAmountCon *10*10:undefined;
                // 美元完成营业额转百万美元
                item.completedAmountConMillion =!!item.completedAmountCon||item.completedAmountCon==0? item.completedAmountCon *10*10:undefined;
                item.unitMillion='百万美元'
                return item
            })

            if (type == 'quarterly' || type == 'monthly'){
                res = res.filter(item=>{
                    return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
                })
            }
            let tableres=await JSON.parse(JSON.stringify(res));
            tableres=tableres.reverse();
             if(tabIndex==1) {
                let tableInfo={
                fileName:'中国对“一带一路”沿线国家非金融类直接投资情况',
                tHeader:[
                    "年份",
                    type!='yearly'?"月份":'',
                    '非金融类直接投资',
                    '非金融类直接投资同比',
                    '单位'
                ].filter(item=>item!=''),
                filterVal:['year',type!='yearly'?'month':'','investConversionMillion','conversionYOY','unitMillion'].filter(item=>item!=''),
                tableData:[...tableres]
                }
                store.commit('saveChartTable',tableInfo);
             }
             if(tabIndex==2) {
                let tableInfo={
                fileName:'中国对“一带一路”沿线国家投资情况-新签合同额',
                tHeader:[
                    "年份",
                    type!='yearly'?"月份":'',
                    '新签合同额',
                    '新签合同额同比',
                    '单位'
                ].filter(item=>item!=''),
                filterVal:['year',type!='yearly'?'month':'','newConAmountConMillion','newConAmountConYOY','unitMillion'].filter(item=>item!=''),
                tableData:[...tableres]
                }
                store.commit('saveChartTable',tableInfo);
             }
             if(tabIndex==3) {
                let tableInfo={
                fileName:'中国对“一带一路”沿线国家投资情况-完成营业额',
                tHeader:[
                    "年份",
                    type!='yearly'?"月份":'',
                    '完成营业额',
                    '完成营业额同比',
                    '单位'
                ].filter(item=>item!=''),
                filterVal:['year',type!='yearly'?'month':'','completedAmountConMillion','completedAmountConYOY','unitMillion'].filter(item=>item!=''),
                tableData:[...tableres]
                }
                store.commit('saveChartTable',tableInfo);
             }
            return {res};
  },
  getOverSeasProjectsChartsData:async function(params,tabIndex) {// 获取中国对外承包工程数据函数接口(完成营业额 新签合同额)  //折线图
    let type = params.type;
    let res=await this.manualQueryData('ForeignContract',params);
     res = res.map(item=>{
         item=item.toJSON()
         // 美元完成营业额转百万美元
         item.completedAmountConMillion =!!item.completedAmountCon||item.completedAmountCon==0? item.completedAmountCon *10*10:undefined;
         // 美元新签合同额转百万美元
         item.newConAmountConMillion =!!item.newConAmountCon||item.newConAmountCon==0? item.newConAmountCon *10*10:undefined;
         // 人民币完成营业额转百万人民币
         item.completedAmountMillion =!!item.completedAmount||item.completedAmount==0? item.completedAmount *10*10:undefined;
         // 人民币新签合同额转百万人民币
         item.newConAmountMillion =!!item.newConAmount ||item.newConAmount==0?item.newConAmount *10*10:undefined;
         item.unitConMillion='百万美元'
         item.unitMillion='百万人民币'
         return item
     })
     if (type == 'quarterly' || type == 'monthly'){
         res = res.filter(item=>{
             return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
         })
     }
     let tableres=await JSON.parse(JSON.stringify(res));
            tableres=tableres.reverse();
             if(tabIndex==1) {
                let tableInfo={
                fileName:'完成营业额',
                tHeader:[
                    "年份",
                    type!='yearly'?"月份":'',
                    '单位',
                    '完成营业额',
                    '完成营业额同比',
                    '单位',
                    '完成营业额折合(RMB)',
                    '完成营业额折合同比'
                ].filter(item=>item!=''),
                filterVal:['year',type!='yearly'?'month':'','unitConMillion','completedAmountConMillion','completedAmountConYOY','unitMillion','completedAmountMillion','completedAmountYOY'].filter(item=>item!=''),
                tableData:[...tableres]
                }
                store.commit('saveChartTable',tableInfo);
     }
     if(tabIndex==2) {
        let tableInfo={
        fileName:'新签合同额',
        tHeader:[
            "年份",
            type!='yearly'?"月份":'',
            '单位',
            '新签合同额',
            '新签合同额同比',
            '折合单位',
            '新签合同额折合(RMB)',
            '新签合同额折合同比'
        ].filter(item=>item!=''),
        filterVal:['year',type!='yearly'?'month':'','unitConMillion','newConAmountConMillion','newConAmountConYOY','unitMillion','newConAmountMillion','newConAmountYOY'].filter(item=>item!=''),
        tableData:[...tableres]
        }
        store.commit('saveChartTable',tableInfo);
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
     if (type == 'quarterly' || type == 'monthly'){
        res = res.filter(item=>{
            return (item.year>params.start || item.month>=params.startMonth) && (item.year<params.end || item.month<=params.endMonth)
        })
    }
    let tableres=await JSON.parse(JSON.stringify(res));
        tableres=tableres.reverse();
     let tableInfo={
        fileName:'派出人数',
        tHeader:[
            "年份",
            type!='yearly'?"月份":'',
            '各类劳务人员',
            '承包工程项下派人数',
            '劳务合作项下派人数',
            '单位'
        ].filter(item=>item!=''),
        filterVal:['year',type!='yearly'?'month':'','variousTypesPerNum','contractProject','laborCooperation','unit'].filter(item=>item!=''),
        tableData:[...tableres]
        }
        store.commit('saveChartTable',tableInfo);
     return {res};
},
getoutstocksChartsData:async function(params,tabIndex) {//获取中国对外直接投资存量（投资存量）  //折线图
    let res=await this.manualQueryData('FDIOutflowsInflows',params);
     res = res.map(item=>{
         item=item.toJSON()
         return item
     })
     let tableres=await JSON.parse(JSON.stringify(res));
     tableres=tableres.reverse();
     if(tabIndex==1){ // 代表存量
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
     }else if(tabIndex==2){ //代表流量与存量
        let tableInfo={
            fileName:'中国对外直接投资流量与存量',
            tHeader:[
                "年份",
                '中国对外直接投资流量',
                '中国对外直接投资存量',
                '单位'
            ],
            filterVal:['year','outward_FDI_flows','outward_FDI_stocks','unit'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
     }
     return {res};
},
getOutflowsOutstocksByDestinationChartsData:async function(tableName,params,filed,tabIndex) {// 获取中国对外直接投资流量按国家和地区统计-按大洲统计
       let res=await this.manualQueryData(tableName,params);
       res = res.map(item=>{
            item=item.toJSON()
            return item
        })
        let Asia = res.filter(item=>{
            return item.continent == '亚洲'
        })
        Asia=await this.sumSameYearData(Asia,filed,'亚洲');
        let Europe = res.filter(item=>{
            return item.continent == '欧洲'
        })
        Europe=await this.sumSameYearData(Europe,filed,'欧洲');

        let Oceania = res.filter(item=>{
            return item.continent == '大洋洲'
        })
        Oceania=await this.sumSameYearData(Oceania,filed,'大洋洲');

        let North_America = res.filter(item=>{
            return item.continent == '北美洲'
        })
        North_America=await this.sumSameYearData(North_America,filed,'北美洲');

        let Antarctica = res.filter(item=>{
            return item.continent == '南极洲'
        })
        Antarctica=await this.sumSameYearData(Antarctica,filed,'南极洲');

        let South_America = res.filter(item=>{
            return item.continent == '南美洲'
        })
        South_America=await this.sumSameYearData(South_America,filed,'南美洲');

        let Africa = res.filter(item=>{
            return item.continent == '非洲'
        })
        Africa=await this.sumSameYearData(Africa,filed,'非洲');
        let Latin_America = res.filter(item=>{
            return item.continent == '拉丁美洲'
        })
        Latin_America=await this.sumSameYearData(Latin_America,filed,'拉丁美洲');
           
// 处理table数据
let tableres=await JSON.parse(JSON.stringify([...Asia,...Europe,...Oceania,...North_America,...Antarctica,...South_America,...Africa,...Latin_America]));
        tableres=tableres.sort((a,b)=>{
             return b.year-a.year;
        });
        // if(tabIndex==1){ // 代表存量的按大洲统计
            let tableInfo={
                fileName: tabIndex==1?'中国对外直接投资存量按大洲统计':'中国对外直接投资流量按大洲统计',
                tHeader:[
                    "年份",
                    '大洲（英文）',
                    '大洲',
                    tabIndex==1?'中国对外直接投资存量':'中国对外直接投资流量',
                    '单位'
                ],
                filterVal:['year','nameEn','name','mount','unitMillion'],
                tableData:[...tableres]
                }
                store.commit('saveChartTable',tableInfo);
        // }
        return {Asia,Europe,Oceania,North_America,Antarctica,South_America,Africa,Latin_America};
},///
getFlowsAndStocksByDestinationChartsData:async function(tableName,params,filed,tabIndex) {//获取中国对外直接投资流量|存量按国家和地区统计-按国家和地区统计  //折线图
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
                           it[filed+'Million']=!!Number(it[filed])/100||Number(it[filed])/100==0?Number(it[filed])/100:undefined;
                           it['unitMillion']='百万美元';
                    return it.country==element;
                })
                allresult[vk]=vkData;
            }
     }
     let tableres=await JSON.parse(JSON.stringify(res));
     tableres=tableres.reverse();
        let tableInfo={
            fileName: '按国家/地区统计',
            tHeader:[
                "年份",
                '大洲（英文）',
                '大洲',
                '国家/地区(英文)',
                '国家/地区',
                tabIndex==1?'中国对外直接投资存量':'中国对外直接投资流量',
                '单位'
            ],
            filterVal:['year','continentEn','continent',tabIndex==1?'countryEN':'countryEn','country',filed+'Million','unitMillion'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
     return {res:allresult};
},
// 柱状图查询  饼图
barQueryData:async function (tableName,params){  //初始去数据库查询数据  
    chartDataFun.getInThreeDays(-3);
    chartDataFun.getLatestTime(tableName); 
    let q = new Parse.Query(tableName);
    let limiCcount = await q.count();
        q.limit(limiCcount);
        // 发布的才拉取
        q.equalTo('isCheckIn',true);
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
        item.amountMillion=!!item.amount||item.amount==0?item.amount*10*10:undefined;
        item.unitMillion='百万美元';
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
        let tableInfo={
            fileName:  params.type==1?'中国对外承包工程前十国别新签合同额':'中国对外承包工程前十国别完成营业额',
            tHeader:[
                "年份",
                '排名',
                '国别（英文）',
                '国别',
                params.type==1?'新签合同额':'完成营业额',
                params.type==1?'新签合同额同比':'完成营业额同比',
                '单位'
            ],
            filterVal:['year','rank','countryEn','country','amountMillion','amountYOY','unitMillion'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
    return {res};
},
// 对外劳务合作前十位目的地国家和12月末前十位国家
getLaborServiceTop10AnnualRankChart:async function(params) {
    let res=await this.barQueryData('LaborServiceTop10AnnualRank',params);
    res = res.map(item=>{
        item=item.toJSON();
        item.variousTypesPerNumMillion= !!item.variousTypesPerNum||item.variousTypesPerNum==0?item.variousTypesPerNum/10000:undefined;
        item.unitMillion='万人'
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
    let tableInfo={
        fileName:  params.type==1?'年度派出各类劳务人员前10位目的地国家':'12月末在外各类劳务人员前10位国家',
        tHeader:[
            "年份",
            '单位',
            params.type==1?'年度派出各类劳务人员国家/地区（英文）':'12月末在外各类劳务人员国家/地区（英文）',
            params.type==1?'年度派出各类劳务人员国家/地区':'12月末在外各类劳务人员国家/地区',
            params.type==1?'年度派出各类劳务人员人数':'12月末在外各类劳务人员人数',
            params.type==1?'年度派出各类劳务人员比重':'12月末在外各类劳务人员比重'
        ],
        filterVal:['year','unitMillion','destinationEn','destinations','variousTypesPerNumMillion','destinationPercent'],
        tableData:[...tableres]
        }
        store.commit('saveChartTable',tableInfo);
    return {res};
},
// 对外劳务合作派出人数主要行业  饼图
getIndustryOfWorkersNumChart:async function(params) {
    let res=await this.barQueryData('LaborServiceIndustry',params);
    res = res.map(item=>{
        item=item.toJSON();
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
     tableres=tableres.reverse();
    let tableInfo={
        fileName: '年度派出人数主要行业',
        tHeader:[
            "年份",
            '类别（英文）',
            '类别',
            '在外各类劳务人员行业构成人数（万人）',
            '比重'
        ],
        filterVal:['year','industryEn','industry','unit','variousTypesPerNum','industryPercent'],
        tableData:[...tableres]
        }
        store.commit('saveChartTable',tableInfo);
    return {res};
},
// 对外直接投资流量历年前20国家
getFlowsTwentyDestinationChart:async function(params) {
    let res=await this.barQueryData('FDITop20Outflow',params);
    res = res.map(item=>{
        item=item.toJSON();
        item.outflowMillion=!!item.outflow||item.outflow==0?item.outflow*10*10:undefined;
        item.unitMillion='百万美元'
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
        let tableInfo={
            fileName: '中国对外直接投资流量历年前20位国家',
            tHeader:[
                "年份",
                '序号',
                '中国对外直接投资流量前20位国家（地区）英文',
                '中国对外直接投资流量前20位国家（地区）',
                '单位',
                '中国对外直接投资流量前20位国家（地区）投资额',
                '中国对外直接投资流量前20位国家（地区）占总额比重',
                
            ],
            filterVal:['year','rank','countryEn','country','unitMillion','outflowMillion','outflowPercent'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
    return {res};
},
// 对外直接投资存量历年前20国家
getStocksTwentyDestinationChart:async function(params) {
    let res=await this.barQueryData('FDITop20Stock',params);
    res = res.map(item=>{
        item=item.toJSON();
        item.stocksMillion=!!item.stocks||item.stocks==0?item.stocks*10*10:undefined;
        item.unitMillion='百万美元'
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
        let tableInfo={
            fileName: '中国对外直接投资存量历年前20位国家',
            tHeader:[
                "年份",
                '排名',
                '中国对外直接投资存量前20位国家（地区）英文',
                '中国对外直接投资存量前20位国家（地区）',
                '单位',
                '中国对外直接投资存量前20位国家（地区）投资额',
                '中国对外直接投资存量前20位国家（地区）占总额比重',
                
            ],
            filterVal:['year','rank','countryEN','country','unitMillion','stocksMillion','stockPercent'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
    return {res};
},
//对外承包工程前十项目
getForeignContractNewConRank: async function (params) {
    let res = await this.barQueryData('ForeignContractNewConRank', params);
    res = res.map(item => {
        item = item.toJSON();
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
        let tableInfo={
            fileName: '中国对外承包工程前十项目',
            tHeader:[
                '排名',
                '国家（地区）',
                '项目名称翻译',
                '项目名称',
                '签约企业名称翻译',
                '签约企业'
            ],
            filterVal:['rank','country','projectEn','project','contractingEnterpriseEn','contractingEnterprise'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
    return { res };
},
//中国对外投资中------ 行业分布情况
getoutflowsByIndustryBarChartsData:async function(params) {//获取  //柱状图加折线图
    let res=await this.manualQueryData('FDIOutflowsIndustry',params);
     res = res.map(item=>{
         item=item.toJSON()
        //  需要换算单位
         item.outflowsMillion=!!item.outflows||item.outflows==0?item.outflows:undefined
         item.unitMillion='百万美元';
         return item
     })
    //  let tableres=await JSON.parse(JSON.stringify(res));
    //      tableres=tableres.reverse();
    //      let tableInfo={
    //         fileName: '中国对外直接投资流量行业分布情况',
    //         tHeader:[
    //             "年份",
    //             '行业（英文）',
    //             '行业',
    //             '流量',
    //             '同比',
    //             '单位'
    //         ],
    //         filterVal:['year','industryEn','industry','outflowsMillion','yOY','unitMillion'],
    //         tableData:[...tableres]
    //         }
    //         store.commit('saveChartTable',tableInfo);
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
        item.stocksMillion =!!item.stocks||item.stocks==0? item.stocks / 100:undefined;
        item.unitMillion='百万美元'
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
        let tableInfo={
            fileName: '按各洲内国家/地区统计',
            tHeader:[
                "年份",
                '大洲（英文）',
                '大洲',
                '国家（英文）',
                '国家',
                '中国对外直接投资存量',
                '单位'
            ],
            filterVal:['year','continentEn','continent','countryEN','country','stocksMillion','unitMillion'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
    return { res };
},
//中国对外直接投资流量按国家和地区统计
getFDIOutflowDestination: async function (params) {
    let res = await this.barQueryData('FDIOutflowDestination', params);
    res = res.map(item => {
        item = item.toJSON();
        item.outflowMillion =!!item.outflow||item.outflow==0? item.outflow / 100:undefined;
        item.unitMillion='百万美元'
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
        let tableInfo={
            fileName: '按各洲内国家/地区统计',
            tHeader:[
                "年份",
                '大洲（英文）',
                '大洲',
                '国家（英文）',
                '国家',
                '中国对外直接投资流量',
                '单位'
            ],
            filterVal:['year','continentEn','continent','countryEn','country','outflowMillion','unitMillion'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
    return { res };
},

//中国对主要经济体投资按行业统计
getFDIMajorEconomiesIndustry: async function (params) {
    let res = await this.barQueryData('FDIMajorEconomiesIndustry', params);
    res = res.map(item => {
        item = item.toJSON();
        item.outflowsMillion = !!item.outflows||item.outflows==0?item.outflows / 100:undefined;
        item.unitMillion='百万美元'
        return item;
    });
    let tableres=await JSON.parse(JSON.stringify(res));
       let op=[
          {
            id: 1,
            ch: "中国香港",
            en: "Hong Kong, China"
          },
          {
            id: 2,
            ch: "东盟",
            en: "ASEAN"
          },
          {
            id: 3,
            ch: "欧盟",
            en: "European Union"
          },
          {
            id: 4,
            ch: "美国",
            en: "United States"
          },
          {
            id: 5,
            ch: "澳大利亚",
            en: "Australia"
          },
          {
            id: 6,
            ch: "俄罗斯",
            en: "Russia"
          }
        ];
        tableres.forEach((item)=>{
            op.forEach((it)=>{
                if(item.economies==it.ch){
                    item.economiesEn=it.en;
                }
            });
        });
        let tableInfo={
            fileName: '中国对主要经济体投资按行业统计',
            tHeader:[
                "年份",
                '经济体（英文）',
                '经济体',
                '行业（英文）',
                '行业',
                '中国对外直接投资流量',
                '单位'
            ],
            filterVal:['year','economiesEn','economies','industryEN','industry','outflowsMillion','unitMillion'],
            tableData:[...tableres]
            }
            store.commit('saveChartTable',tableInfo);
    return { res };
}

}

