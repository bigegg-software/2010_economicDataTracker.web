import Parse from '../index'
import chartDataFun from "@/utils/chartDataFun";
export default {
    // 带年度月度季度的折线图使用
    manualQueryData: async function (tableName, params) {  //初始去数据库查询数据  
        let q = new Parse.Query(tableName)
        let type = params.type;
        q.greaterThanOrEqualTo('year', params.start)
        q.lessThanOrEqualTo('year', params.end)
        if (type == 'yearly' && !params.noMonth) {
            q.equalTo('month', 11)//应该是12
            q.ascending('year')
        } else if (type == 'yearly' && params.noMonth) {
            q.ascending('year')
        } else if (type == 'quarterly') {
            q.containedIn('month', [3, 6, 9, 11])//应该是12
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
        let q = new Parse.Query(tableName);
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
    getAllCountryName: async function () {  // 获取所有国家
        let q = new Parse.Query('Country');
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
        return res;
    },
    getInflowsChartsData: async function (params) {// 实际使用外资（实际使用外资）  折线图
        let type = params.type;
        let res = await this.manualQueryData('InwardFDI', params);
        res = res.map(item => {
            item = item.toJSON()
            // 美元实际使用外资转百万美元
            item.inwardFDIConMillion = item.inwardFDICon * 100;
            return item
        })
        if (type == 'quarterly' || type == 'monthly') {
            res = res.filter(item => {
                return (item.year > params.start || item.month >= params.startMonth) && (item.year < params.end || item.month <= params.endMonth)
            })
        }
        return { res };
    },
    getNonFinancialToBRIChartsData: async function (params) {// 一带一路对华投资（企业数，实际投入外资金额）  折线图
        let res = await this.manualQueryData('BRIInvestors', params);
        res = res.map(item => {
            item = item.toJSON();
            item.BRIAmountMillion = item.BRIAmount / 100;
            return item
        })
        return { res };
    },
    getForeignInvestTaxChartsData: async function (params) {// 外商投资企业税收统计（外商投资企业税收统计）  折线图
        let res = await this.manualQueryData('ForeignInvestment', params);
        res = res.map(item => {
            item = item.toJSON();
            item.taxMillion = item.tax / 100;
            return item
        })
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
                    return it.country == element;
                })
                console.log(vkData)
                allresult[vk] = vkData;
            }
        }

        return { res: allresult };
    },
    //主要对华投资国家/地区
    getMajorInvestors: async function (params) {
        let res = await this.barQueryData('MajorInvestors', params);
        res = res.map(item => {
            item = item.toJSON();
            // item.taxMillion = item.tax / 100;
            return item;
        });
        return { res };
    
    
    },
    //外商直接投资------ 主要行业--开办企业数/实际使用外资金额
getForeignInvestIndustryData:async function(params) {//获取  //柱状图加折线图
    let res=await this.manualQueryData('ForeignInvestmentMainIndustries',params);
     res = res.map(item=>{
         item=item.toJSON()
        //  需要换算单位
         item.inflowsFDIMillion=item.inflowsFDI*100
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



}

