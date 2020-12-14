import Parse from '../index'
import chartDataFun from "@/utils/chartDataFun";
import store from '@/vuexStore'
export default {
     //数据格式化
     formatNum(value) {
        if (!value && value !== 0) return "";
        let strs = value.toFixed(1)
        let str = strs.toString();
        let reg =
            str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;

        return str.replace(reg, "$1,");
    },
    // 带年度月度季度的折线图使用
    manualQueryData: async function (tableName, params) {  //初始去数据库查询数据
        chartDataFun.getInThreeDays(-3);  
        chartDataFun.getLatestTime(tableName); 
        let q = new Parse.Query(tableName)
        let limiCcount = await q.count();
        q.limit(limiCcount);
        let type = params.type;
        // 发布的才拉取
        // q.equalTo('isCheckIn',true);
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
    // 柱状图查询  饼图
    barQueryData: async function (tableName, params) {  //初始去数据库查询数据  
        chartDataFun.getInThreeDays(-3);
        chartDataFun.getLatestTime(tableName); 
        let q = new Parse.Query(tableName);
        let limiCcount = await q.count();
        q.limit(limiCcount);
        // 发布的才拉取
        // q.equalTo('isCheckIn',true);
        if (params.limit) {
            q.limit(params.limit);
        }
        if (params.ascending) {
            q.ascending(params.ascending);
        }
        if (params.descending) {
            q.descending(params.descending);
        }
        if (params.year) {
            q.equalTo('year', params.year);
        }
        if (params.type) {
            q.equalTo('type', params.type);
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
        let res = await q.find();
        return res;
    },
    getAllCountryName: async function () {  // 获取所有国家对华
        let q = new Parse.Query('MainCountry'); // 已经调整成40个国家的表
        q.limit(500);
        let res = await q.find();
        res = res.map(item => {
            item = item.toJSON();
            item.ch = item.abbreviationZH;
            item.en = item.abbreviationEN;
            item.searchArr = [...item.abbreviationZH.split(''), ...item.abbreviationEN.split(' ')];
            item.checked = false;
            item.show = true;
            return item;
        });
        res=res.sort((a,b)=>{return (a.en + '').localeCompare(b.en + '')});
        return res;
    },
    getInflowsChartsData: async function (params) {// 实际使用外资（实际使用外资）  折线图
        let type = params.type;
        let res = await this.manualQueryData('InwardFDI', params);
        res = res.map(item => {
            item = item.toJSON()
            // 美元实际使用外资转百万美元
            item.inwardFDIConMillion = item.inwardFDICon * 100;
            item.unitMillion = '百万美元'
            return item
        })
        let tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
            return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
        })

        console.log("tableres", tableres)

        tableres = tableres.reverse();
        let tableInfo = {
            fileName: '实际使用外资',
            tHeader: [
                "年份",
                type!='yearly'?"月份":'',
                '实际使用外资',
                '实际使用外资同比',
                '单位'
            ].filter(item=>item!=''),
            filterVal: ['year', type!='yearly'?'month':'', 'inwardFDIConMillion', 'inwardFDIConYOY', 'unitMillion'].filter(item=>item!=''),
            tableData: [...tableres]
        }
        store.commit('saveChartTable', tableInfo);

        if (type == 'quarterly' || type == 'monthly') {
            res = res.filter(item => {
                return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
            })
        }
        return { res };
    },
    getNonFinancialToBRIChartsData: async function (params,type) {// 一带一路对华投资（企业数，实际投入外资金额）  折线图
        let res = await this.manualQueryData('BRIInvestors', params);
        res = res.map(item => {
            item = item.toJSON();
            item.BRIAmountMillion = item.BRIAmount / 100;
            item.BRIUnit = '家';
            item.unitMillion = '百万美元';
            return item
        })
        let tableres = JSON.parse(JSON.stringify(res))
        console.log("=====资投入金额====",tableres)
        tableres = tableres.reverse();
        if (type == 2){
            let tableInfo = {
                fileName: '"一带一路"企业数',
                tHeader: [
                    "年份",
                    "一带一路企业数",
                    '占外资企业比重',
                    '单位'
                ],
                filterVal: ['year', 'BRINumber', 'BRIPercent', 'BRIUnit'],
                tableData: [...tableres]
            }
            store.commit('saveChartTable', tableInfo);
        }else if (type == 1){
            let tableInfo = {
                fileName: '"一带一路"实际外资投入金额',
                tHeader: [
                    "年份",
                    "带一路沿线国家投资金额",
                    '占总外资金额比重',
                    '单位'
                ],
                filterVal: ['year', 'BRIAmountMillion', 'BRIAmountPercent', 'unitMillion'],
                tableData: [...tableres]
            }
            store.commit('saveChartTable', tableInfo);
        }
        
        return { res };
    },
    getForeignInvestTaxChartsData: async function (params) {// 外商投资企业税收统计（外商投资企业税收统计）  折线图
        let res = await this.manualQueryData('ForeignInvestment', params);
        res = res.map(item => {
            item = item.toJSON();
            item.taxMillion = item.tax / 100;
            item.unitMillion = '百万美元'
            return item
        })
        let tableres = JSON.parse(JSON.stringify(res))
        tableres = tableres.reverse();
        let tableInfo = {
            fileName: '外商投资企业税收统计',
            tHeader: [
                "年份",
                "外商投资企业税收额",
                '增幅',
                '全国占比',
                '单位'
            ],
            filterVal: ['year', 'taxMillion', 'YOYGrowth', 'percentInCountry', 'unitMillion'],
            tableData: [...tableres]
        }
        store.commit('saveChartTable', tableInfo);
        return { res };
    },
    getStateDirectInvestInChinaChartData: async function (tableName, params, filed) {//获取主要对话投资国家/地区-国家/地区对华直接投资  //折线图
        let res = await this.manualQueryData(tableName, params);
        let allresult = [];
        res = res.map(item => {
            item = item.toJSON()
            return item;
        })
        if (params.containedIn && params.containedIn.country) {
            for (let vk = 0; vk < params.containedIn.country.length; vk++) {
                const element = params.containedIn.country[vk];
                let vkData = res.filter(it => {
                    console.log(it)
                    it[filed + 'Million'] = Number(it[filed]) / 100;
                    it['unit']='家';
                    it['unitMillion']='百万美元';
                    return it.country == element;
                })
                console.log(vkData)
                allresult[vk] = vkData;
            }
        }

        let tableres = JSON.parse(JSON.stringify(res))
        tableres = tableres.reverse();
        let tableInfo = {
            fileName: '年度部分国家/地区对华直接投资',
            tHeader: [
                "年份",
                "区域（英文）",
                "区域",
                '国家/地区（英文）',
                '国家/地区',
                '单位',
                '企业数',
                '企业数比重',
                '单位',
                '实际投入外资金额',
                '实际投入外资金额比重'
            ],
            filterVal: ['year', 'continentEn','continent', 'countryEn','country','unit','enterpriseNumber','enterprisePercent','unitMillion',filed+'Million','inflowsPercent'],
            tableData: [...tableres]
        }
        store.commit('saveChartTable', tableInfo);

        return { res: allresult };
    },
    //主要对华投资国家/地区
    getMajorInvestors: async function (params) {
        let res = await this.barQueryData('MajorInvestors', params);
        console.log(res)
        res = res.map(item => {
            item = item.toJSON();
            item.FDIInflowsMillion = item.FDIInflows / 100;
            item['unit']='家';
            item['unitMillion']='百万美元';
            return item;
        });
        let tableres = JSON.parse(JSON.stringify(res))
        tableres = tableres.reverse();
        let tableInfo = {
            fileName: '国家和地区对华投资比重',
            tHeader: [
                "年份",
                "区域（英文）",
                "区域",
                '国家/地区（英文）',
                '国家/地区',
                '单位',
                '企业数',
                '企业数比重',
                '单位',
                '实际投入外资金额',
                '实际投入外资金额比重'
            ],
            filterVal: ['year', 'continentEn','continent', 'countryEn','country','unit','enterpriseNumber','enterprisePercent','unitMillion','FDIInflowsMillion','inflowsPercent'],
            tableData: [...tableres]
        }
        store.commit('saveChartTable', tableInfo);
        return { res };


    },
    //外商直接投资------ 主要行业--开办企业数/实际使用外资金额
    getForeignInvestIndustryData: async function (params,tabIndex) {//获取  //柱状图加折线图
        let res = await this.manualQueryData('ForeignInvestmentMainIndustries', params);
        res = res.map(item => {
            item = item.toJSON()
            //  需要换算单位
            item.inflowsFDIMillion = item.inflowsFDI * 100
            item.enterprisesNumberUnit='家'
            item.unitMillion='百万美元'
            return item
        })
        let tableres=await JSON.parse(JSON.stringify(res));
         tableres=tableres.reverse();
         if(tabIndex==1){
            let tableInfo={
                fileName: '开办企业数',
                tHeader:[
                    "年份",
                    '行业（英文）',
                    '行业',
                    '单位',
                    '企业数',
                    '企业数同比'
                ],
                filterVal:['year','industryEn','industry','enterprisesNumberUnit','enterprisesNumber','numberYOYGrowth'],
                tableData:[...tableres]
                }
            store.commit('saveChartTable',tableInfo);
         }
         if(tabIndex==2){
            let tableInfo={
                fileName: '实际使用外资金额',
                tHeader:[
                    "年份",
                    '行业（英文）',
                    '行业',
                    '单位',
                    '实际使用外资金额',
                    '实际使用外资金额同比'
                ],
                filterVal:['year','industryEn','industry','unitMillion','inflowsFDIMillion','inflowsYOYGrowth'],
                tableData:[...tableres]
                }
            store.commit('saveChartTable',tableInfo);
         }
        let industrys = await chartDataFun.getServerIndustry();
        let resoult = [];
        for (let k = 0; k < industrys.length; k++) {
            let element = industrys[k].ch;
            let elementEn = industrys[k].en;
            let re = res.filter(item => {
                if (item.industry == element) {
                    item.industryEn = elementEn;
                }
                return item.industry == element
            })
            console.log(re)
            if (re.length) {
                resoult.push(re);
            }
        }
        res = resoult;
        return { res };
    },

    // 主要对华投资国家和地区--前12位国家、地区
    getTopFifteenCountriesChart: async function (params) {
        let res = await this.barQueryData('MajorTop15Investors', params);
        res = res.map(item => {
            item = item.toJSON();
            // 实际投入外资金额
            item.FDIInflowsMillion = item.FDIInflows * 100;
            item.unitMillion = '百万美元'
            return item;
        });

        let tableres = JSON.parse(JSON.stringify(res))

        tableres = tableres.reverse();
        let tableInfo = {
            fileName: '主要对华投资前15位国家/地区',
            tHeader: [
                "年份",
                "国家/地区（英文）",
                "国家/地区",
                '企业数',
                '比重',
                '实际投入外资金额',
                '比重',
                '单位'
            ],
            filterVal: ['year', 'countryEn','country', 'enterpriseNumber', 'enterprisePercent', 'FDIInflowsMillion', 'inflowsPercent', 'unitMillion'],
            tableData: [...tableres]
        }
        store.commit('saveChartTable', tableInfo);

        return { res };
    },

}

