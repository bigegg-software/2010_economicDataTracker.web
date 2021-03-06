import Parse from '../index'
import chartDataFun from "@/utils/chartDataFun";
import store from '@/vuexStore'
export default {
     //数据格式化
     formatNum(value) {
        if (!value && value !== 0) return "";
        // let strs = value.toFixed(1)
        let strs = (Math.round(value*10)/10).toFixed(1)
        let str = strs.toString();
        let reg =
            str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;

        return str.replace(reg, "$1,");
    },
    // 带年度月度季度的折线图使用
    manualQueryData: async function (tableName, params) {  //初始去数据库查询数据
        await chartDataFun.become();
        chartDataFun.getInThreeDays(-3);  
        chartDataFun.getLatestTime(tableName); 
        params.tableName=tableName;
        let res=await new Parse.Cloud.run('getManualQueryDataBusiness',params);
        res=res.data.result;
        return res;
    },
    // 柱状图查询  饼图
    barQueryData: async function (tableName, params) {  //初始去数据库查询数据
        await chartDataFun.become();  
        chartDataFun.getInThreeDays(-3);
        chartDataFun.getLatestTime(tableName); 
        params.tableName=tableName;
        let res=await new Parse.Cloud.run('getBarQueryDataBusiness',params);
        res=res.data.result;
        return res;
    },
    getAllCountryName: async function (prop,countrys) {  // 获取所有国家对华
        await chartDataFun.become();
        let res=await new Parse.Cloud.run('getMainAllCountryName',{prop,countrys});
        res=res.data.result;
        return res;
    },
    getInflowsChartsData: async function (params) {// 实际使用外资（实际使用外资）  折线图
        let type = params.type;
        let res = await this.manualQueryData('InwardFDI', params);
        res = res.map(item => {
            item = item.toJSON()
            // 美元实际使用外资转百万美元
            item.inwardFDIConMillion = item.inwardFDICon *10*10;
            item.unitMillion = '百万美元'
            return item
        })
        let tableres = await JSON.parse(JSON.stringify(res)).filter(item => {
            return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
        })


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
        tableres = tableres.reverse();
        if (type == 2){
            let tableInfo = {
                fileName: '“一带一路”企业数',
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
                fileName: '“一带一路”实际外资投入金额',
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
            item.taxMillion = item.tax *10*10;
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
                    it[filed + 'Million'] = Number(it[filed]) / 100;
                    it['unit']='家';
                    it['unitMillion']='百万美元';
                    return it.country == element;
                })
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
            item.inflowsFDIMillion = item.inflowsFDI *10*10
            item.enterprisesNumberUnit='家'
            item.unitMillion='百万美元'
            return item
        })
        // let tableres=await JSON.parse(JSON.stringify(res));
        //  tableres=tableres.reverse();
        //  if(tabIndex==1){
        //     let tableInfo={
        //         fileName: '开办企业数',
        //         tHeader:[
        //             "年份",
        //             '行业（英文）',
        //             '行业',
        //             '单位',
        //             '企业数',
        //             '企业数同比'
        //         ],
        //         filterVal:['year','industryEn','industry','enterprisesNumberUnit','enterprisesNumber','numberYOYGrowth'],
        //         tableData:[...tableres]
        //         }
        //     store.commit('saveChartTable',tableInfo);
        //  }
        //  if(tabIndex==2){
        //     let tableInfo={
        //         fileName: '实际使用外资金额',
        //         tHeader:[
        //             "年份",
        //             '行业（英文）',
        //             '行业',
        //             '单位',
        //             '实际使用外资金额',
        //             '实际使用外资金额同比'
        //         ],
        //         filterVal:['year','industryEn','industry','unitMillion','inflowsFDIMillion','inflowsYOYGrowth'],
        //         tableData:[...tableres]
        //         }
        //     store.commit('saveChartTable',tableInfo);
        //  }
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
            item.FDIInflowsMillion = item.FDIInflows *10*10;
            item.unitMillion = '百万美元'
            return item;
        });

        let tableres = JSON.parse(JSON.stringify(res))

        // tableres = tableres.reverse();//与图表排序统一  去掉了表格倒序排序
           let year=tableres.length?tableres[0].year:'';
        let tableInfo = {
            fileName: `截至${year}年主要投资来源地前15位国家/地区`,
            tHeader: [
                "年份",
                "国家/地区（英文）",
                "国家/地区",
                '累计设立企业数',
                '占外资企业数比重',
                '累计实际投资金额',
                '占实际投入外资金额',
                '单位'
            ],
            filterVal: ['year', 'countryEn','country', 'enterpriseNumber', 'enterprisePercent', 'FDIInflowsMillion', 'inflowsPercent', 'unitMillion'],
            tableData: [...tableres]
        }
        store.commit('saveChartTable', tableInfo);

        return { res };
    },

}

