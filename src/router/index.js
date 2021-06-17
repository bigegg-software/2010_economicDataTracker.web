import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/vuexStore'
import storage from '@/storage/storage'
import user from '@/request/user'
Vue.use(VueRouter)
/*解决路由跳转报错问题开始*/
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
/*解决路由跳转报错问题结束*/
const routes = [{
  path: '/',
  redirect: {
    name: 'outflows'
  },
  component: () => import('@/views/home/Home.vue'),
  children: [{
    path: 'foreignCapital',
    name: 'foreignCapital',
    redirect: {
      name: 'outflows'
    },
    meta: {
      title: '外资'
    },
    component: () => import('@/views/foreignCapital/ForeignCapital.vue'),
    children: [{
      path: 'outBound',
      name: 'outBound',
      meta: {
        title: '中国对外投资'
      },
      component: () => import('@/views/foreignCapital/outbound'),
      children: [{
        path: 'outflows',
        name: 'outflows',
        meta: {
          title: '中国对外直接投资流量'
        },
        component: () => import('@/views/foreignCapital/outbound/Outflows')
      },
      {
        path: 'outstocks',
        name: 'outstocks',
        meta: {
          title: '中国对外直接投资存量'
        },
        component: () => import('@/views/foreignCapital/outbound/Outstocks')
      },
      {
        path: 'outstocksByDestination',
        name: 'outstocksByDestination',
        meta: {
          title: '中国对外直接投资存量按国家和地区统计'
        },
        component: () => import('@/views/foreignCapital/outbound/OutstocksByDestination')
      },
      {
        path: 'outflowsByDestination',
        name: 'outflowsByDestination',
        meta: {
          title: '中国对外直接投资流量按国家和地区统计'
        },
        component: () => import('@/views/foreignCapital/outbound/OutflowsByDestination')
      },
      {
        path: 'outflowsByIndustry',
        name: 'outflowsByIndustry',
        meta: {
          title: '中国对外直接投资流量行业分布情况'
        },
        component: () => import('@/views/foreignCapital/outbound/OutflowsByIndustry')
      },
      {
        path: 'outflowsBeltAndRoad',
        name: 'outflowsBeltAndRoad',
        meta: {
          title: '中国对“一带一路”沿线国家投资情况'
        },
        component: () => import('@/views/foreignCapital/outbound/OutflowsBeltAndRoad')
      },
      {
        path: 'overseasProjects',
        name: 'overseasProjects',
        meta: {
          title: '中国对外承包工程'
        },
        component: () => import('@/views/foreignCapital/outbound/OverseasProjects')
      },
      {
        path: 'internationalLabor',
        name: 'internationalLabor',
        meta: {
          title: '中国对外劳务合作'
        },
        component: () => import('@/views/foreignCapital/outbound/InternationalLabor')
      }
      ]
    },
    {
      path: 'inBound',
      name: 'inBound',
      meta: {
        title: '外商投资中国'
      },
      component: () => import('@/views/foreignCapital/inbound'),
      children: [{
        path: 'inflows',
        name: 'inflows',
        meta: {
          title: '实际使用外资'
        },
        component: () => import('@/views/foreignCapital/inbound/Inflows')
      },
      {
        path: 'majorForeignInvestors',
        name: 'majorForeignInvestors',
        meta: {
          title: '主要对华投资国家/地区'
        },
        component: () => import('@/views/foreignCapital/inbound/MajorForeignInvestors')
      },
      {
        path: 'foreignInvestIndustry',
        name: 'foreignInvestIndustry',
        meta: {
          title: '外商直接投资主要行业'
        },
        component: () => import('@/views/foreignCapital/inbound/ForeignInvestIndustry')
      },
      {
        path: 'foreignInvestTax',
        name: 'foreignInvestTax',
        meta: {
          title: '外商投资企业税收统计'
        },
        component: () => import('@/views/foreignCapital/inbound/ForeignInvestTax')
      },
      {
        path: 'beltAndRoadInvest',
        name: 'beltAndRoadInvest',
        meta: {
          title: '“一带一路”沿线国家对华投资情况'
        },
        component: () => import('@/views/foreignCapital/inbound/BeltAndRoadInvest')
      }
      ]
    },
    {
      path: 'twoWayInvestment',
      name: 'twoWayInvestment',
      meta: {
        title: '双向直接投资'
      },
      component: () => import('@/views/foreignCapital/twoWayInvestment'),
      children: [{
        path: 'outflowsVsInflows',
        name: 'outflowsVsInflows',
        meta: {
          title: '双向直接投资',
          requireAuth: true
        },
        component: () => import('@/views/foreignCapital/twoWayInvestment/OutflowsVsInflows')
      }]
    }
    ]
  },
  {
    path: 'foreignTrade',
    name: 'foreignTrade',
    redirect: {
      name: 'goodsTotal'
    },
    meta: {
      title: '外贸'
    },
    component: () => import('@/views/foreignTrade/ForeignTrade.vue'),
    children: [{
      path: 'goodsTrade',
      name: 'goodsTrade',
      meta: {
        title: '货物贸易'
      },
      component: () => import('@/views/foreignTrade/goodsTrade'),
      children: [{
        path: 'goodsTotal',
        name: 'goodsTotal',
        meta: {
          title: '中国货物进出口总值'
        },
        component: () => import('@/views/foreignTrade/goodsTrade/GoodsTotal')
      },
      {
        path: 'goodsByOrigin',
        name: 'goodsByOrigin',
        meta: {
          title: '货物进出口总值按国家/地区统计'
        },
        component: () => import('@/views/foreignTrade/goodsTrade/GoodsByOrigin')
      },
      {
        path: 'goodsByCommodity',
        name: 'goodsByCommodity',
        meta: {
          title: '货物进出口总值按商品类别统计'
        },
        component: () => import('@/views/foreignTrade/goodsTrade/GoodsByCommodity')
      },
      {
        path: 'goodsByEnterpriseType',
        name: 'goodsByEnterpriseType',
        meta: {
          title: '货物进出口按企业性质统计'
        },
        component: () => import('@/views/foreignTrade/goodsTrade/GoodsByEnterpriseType')
      },
      {
        path: 'goodsByCustomRegime',
        name: 'goodsByCustomRegime',
        meta: {
          title: '货物进出口总值按贸易方式统计'
        },
        component: () => import('@/views/foreignTrade/goodsTrade/GoodsByCustomRegime')
      },
      {
        path: 'foreignInvestedEnterprises',
        name: 'foreignInvestedEnterprises',
        meta: {
          title: '外商投资企业进出口总值'
        },
        component: () => import('@/views/foreignTrade/goodsTrade/ForeignInvestedEnterprises')
      },
      ]
    },
    {
      path: 'servicesTrade',
      name: 'servicesTrade',
      meta: {
        title: '服务贸易'
      },
      component: () => import('@/views/foreignTrade/servicesTrade'),
      children: [{
        path: 'servicesTotal',
        name: 'servicesTotal',
        meta: {
          title: '中国服务贸易进出口总值'
        },
        component: () => import('@/views/foreignTrade/servicesTrade/ServicesTotal')
      },
      {
        path: 'serviceType',
        name: 'serviceType',
        meta: {
          title: '服务贸易分类统计'
        },
        component: () => import('@/views/foreignTrade/servicesTrade/ServiceType')
      },
      ]
    }
    ]
  },
  {
    path: 'economicIndicators',
    name: 'economicIndicators',
    redirect: {
      name: 'grossDomesticProduct'//////
    },
    meta: {
      title: '宏观经济指标'
    },
    component: () => import('@/views/economicIndicators/EconomicIndicators.vue'),
    children: [
      {
        path: 'grossDomesticProduct',
        name: 'grossDomesticProduct',
        meta: {
          title: '国内生产总值'
        },
        component: () => import('@/views/economicIndicators/GrossDomesticProduct')
      },
      {
        path: 'consumerPriceIndex',
        name: 'consumerPriceIndex',
        meta: {
          title: '消费者价格指数'
        },
        component: () => import('@/views/economicIndicators/ConsumerPriceIndex')
      },
      {
        path: 'purchasingManagersIndex',
        name: 'purchasingManagersIndex',
        meta: {
          title: '采购经理人指数'
        },
        component: () => import('@/views/economicIndicators/PurchasingManagersIndex')
      },
      {
        path: 'unemployment',
        name: 'unemployment',
        meta: {
          title: '失业率'
        },
        component: () => import('@/views/economicIndicators/Unemployment')
      },
      {
        path: 'producerPriceIndex',
        name: 'producerPriceIndex',
        meta: {
          title: '工业生产者出厂价格指数'
        },
        component: () => import('@/views/economicIndicators/ProducerPriceIndex')
      },
      {
        path: 'industryAddValue',
        name: 'industryAddValue',
        meta: {
          title: '工业增加值'
        },
        component: () => import('@/views/economicIndicators/IndustryAddValue')
      },
      {
        path: 'industrialProfits',
        name: 'industrialProfits',
        meta: {
          title: '工业企业利润'
        },
        component: () => import('@/views/economicIndicators/IndustrialProfits')
      },
      {
        path: 'salesConsumerGoods',
        name: 'salesConsumerGoods',
        meta: {
          title: '社会消费品零售总额'
        },
        component: () => import('@/views/economicIndicators/SalesConsumerGoods')
      },
      {
        path: 'investmentFixedAssets',
        name: 'investmentFixedAssets',
        meta: {
          title: '固定资产投资（不含农户）'
        },
        component: () => import('@/views/economicIndicators/InvestmentFixedAssets')
      },
      {
        path: 'nationalFinance',
        name: 'nationalFinance',
        meta: {
          title: '国家财政收支'
        },
        component: () => import('@/views/economicIndicators/NationalFinance')
      }, {
        path: 'moneySupply',
        name: 'moneySupply',
        meta: {
          title: '货币供应量 (M2)'
        },
        component: () => import('@/views/economicIndicators/MoneySupply')
      }, {
        path: 'foreignCurrencyReserves',
        name: 'foreignCurrencyReserves',
        meta: {
          title: '国家外汇储备'
        },
        component: () => import('@/views/economicIndicators/ForeignCurrencyReserves')
      },
    ]
  },

  ]
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/Login.vue'),
},
// 分享图表页面
// 中国对外直接投资流量
{
  path: '/outflowsChart',
  name: 'outflowsChart',
  meta: {
    title: '中国对外直接投资流量chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/OutflowsChart')
},
// 中国对外直接投资存量
{
  path: '/outstocksChart',
  name: 'outstocksChart',
  meta: {
    title: '中国对外直接投资存量chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/OutstocksChart')
},
{
  path: '/flowsAndStocksChart',
  name: 'flowsAndStocksChart',
  meta: {
    title: '中国对外直接投资流量与存量chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/FlowsAndStocksChart')
},
// flows 中国对外直接投资流量按国家和地区统计
{
  path: '/flowsByContinentChart',
  name: 'flowsByContinentChart',
  meta: {
    title: '中国对外直接投资流量按大洲统计chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/FlowsByContinentChart')
},
{
  path: '/flowsByCRIContinentChart',
  name: 'flowsByCRIContinentChart',
  meta: {
    title: '中国对外直接投资流量按各洲内国家/地区统计chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/FlowsByCRIContinentChart')
},
{
  path: '/flowsByDestinationChart',
  name: 'flowsByDestinationChart',
  meta: {
    title: '中国对外直接投资流量按国家和地区统计chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/FlowsByDestinationChart')
},
{
  path: '/flowsTwentyDestinationChart',
  name: 'flowsTwentyDestinationChart',
  meta: {
    title: '中国对外直接投资流量按历年前20位国家chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/FlowsTwentyDestinationChart')
},
// stocks 中国对外直接投资存量按国家和地区统计
{
  path: '/stocksByContinentChart',
  name: 'stocksByContinentChart',
  meta: {
    title: '中国对外直接投资存量按大洲统计chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/StocksByContinentChart')
},
{
  path: '/stocksByCRIContinentChart',
  name: 'stocksByCRIContinentChart',
  meta: {
    title: '中国对外直接投资存量按各洲内国家/地区统计chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/StocksByCRIContinentChart')
},
{
  path: '/stocksByDestinationChart',
  name: 'stocksByDestinationChart',
  meta: {
    title: '中国对外直接投资存量按国家和地区统计chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/StocksByDestinationChart')
},
{
  path: '/stocksTwentyDestinationChart',
  name: 'stocksTwentyDestinationChart',
  meta: {
    title: '中国对外直接投资存量按历年前20位国家chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/StocksTwentyDestinationChart')
},
// 中国对外直接投资流量行业分布情况
{
  path: '/outflowsByIndustryChart',
  name: 'outflowsByIndustryChart',
  meta: {
    title: '中国对外直接投资流量行业分布情况chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/OutflowsByIndustryChart')
},
{
  path: '/economyByIndustryChart',
  name: 'economyByIndustryChart',
  meta: {
    title: '中国对主要经济体投资按行业统计chart'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/EconomyByIndustryChart')
},
// 中国对“一带一路”沿线国家直接投资情况
{
  path: '/nonFinancialToBRIChart',
  name: 'nonFinancialToBRIChart',
  meta: {
    title: '中国对“一带一路”沿线国家非金融类直接投资情况'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/NonFinancialToBRIChart')
},
{
  path: '/newContractAmountToBRIChart',
  name: 'newContractAmountToBRIChart',
  meta: {
    title: '新签合同额'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/NewContractAmountToBRIChart')
},
{
  path: '/amountGrowthToBRIChart',
  name: 'amountGrowthToBRIChart',
  meta: {
    title: '完成营业额'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/AmountGrowthToBRIChart')
},
// 中国对外承包工程
{
  path: '/amountGrowthToOPChart',
  name: 'amountGrowthToOPChart',
  meta: {
    title: '完成营业额'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/AmountGrowthToOPChart')
},
{
  path: '/newContractAmountToOPChart',
  name: 'newContractAmountToOPChart',
  meta: {
    title: '新签合同额'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/NewContractAmountToOPChart')
},
{
  path: '/topTenCountriesToOPChart',
  name: 'topTenCountriesToOPChart',
  meta: {
    title: '前十国家（市场）'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/TopTenCountriesToOPChart')
},
{
  path: '/topTenProjectToOPChart',
  name: 'topTenProjectToOPChart',
  meta: {
    title: '前十项目'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/TopTenProjectToOPChart')
},
// 中国对外劳务合作
{
  path: '/tradeVolumeChart',
  name: 'tradeVolumeChart',
  meta: {
    title: '派出人数'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/TradeVolumeChart')
},
{
  path: '/topTenDestOfWorkersChart',
  name: 'topTenDestOfWorkersChart',
  meta: {
    title: '年度派出各类劳务人员前10位目的地国家'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/TopTenDestOfWorkersChart')
},
{
  path: '/topTenDestOfNumOfWorkersChart',
  name: 'topTenDestOfNumOfWorkersChart',
  meta: {
    title: '12月末在外各类劳务人员前10位国家'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/TopTenDestOfNumOfWorkersChart')
},
{
  path: '/industryOfWorkersNumChart',
  name: 'industryOfWorkersNumChart',
  meta: {
    title: '派出人数主要行业'
  },
  component: () => import('@/views/foreignCapital/outbound/sharePages/IndustryOfWorkersNumChart')
},
// 外商投资中国模块charts
// 实际使用外资
{
  path: '/inflowsChart',
  name: 'inflowsChart',
  meta: {
    title: '实际使用外资'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/InflowsChart')
},
// 主要对华投资国家/地区
{
  path: '/investProportionInChinaChart',
  name: 'investProportionInChinaChart',
  meta: {
    title: '国家和地区对华投资比重'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/InvestProportionInChinaChart')
},
{
  path: '/stateDirectInvestInChinaChart',
  name: 'stateDirectInvestInChinaChart',
  meta: {
    title: '年度部分国家/地区对华直接投资'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/StateDirectInvestInChinaChart')
},
{
  path: '/topFifteenCountriesChart',
  name: 'topFifteenCountriesChart',
  meta: {
    title: '前15位国家/地区'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/TopFifteenCountriesChart')
},
// 外商直接投资主要行业
{
  path: '/numEnterprisesChart',
  name: 'numEnterprisesChart',
  meta: {
    title: '开办企业数'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/NumEnterprisesChart')
},
{
  path: '/inflowsToChinaChart',
  name: 'inflowsToChinaChart',
  meta: {
    title: '实际使用外资金额'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/InflowsToChinaChart')
},
// 外商投资企业税收统计
{
  path: '/foreignInvestTaxChart',
  name: 'foreignInvestTaxChart',
  meta: {
    title: '外商投资企业税收统计'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/ForeignInvestTaxChart')
},
// "一带一路"沿线国家对华投资情况
{
  path: '/numEnterprisesBRIChart',
  name: 'numEnterprisesBRIChart',
  meta: {
    title: '企业数'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/NumEnterprisesBRIChart')
},
{
  path: '/inflowsToChinaBRIChart',
  name: 'inflowsToChinaBRIChart',
  meta: {
    title: '实际投入外资金额'
  },
  component: () => import('@/views/foreignCapital/inbound/sharePages/InflowsToChinaBRIChart')
},
// 双向直接投资模块charts
{
  path: '/outflowsVsInflowsChart',
  name: 'outflowsVsInflowsChart',
  meta: {
    title: '双向直接投资'
  },
  component: () => import('@/views/foreignCapital/twoWayInvestment/sharePages/OutflowsVsInflowsChart')
},
//外贸模块
{
  path: '/foreignInvestedEnterprisesChart',
  name: 'foreignInvestedEnterprisesChart',
  meta: {
    title: '外商投资企业进出口总值'
  },
  component: () => import('@/views/foreignTrade/goodsTrade/sharePages/ForeignInvestedEnterprisesChart')
},
{
  path: '/goodsTotalChart',
  name: 'goodsTotalChart',
  meta: {
    title: '中国货物进出口总值'
  },
  component: () => import('@/views/foreignTrade/goodsTrade/sharePages/GoodsTotalChart')
},
{
  path: '/goodsTradeBalanceChart',
  name: 'goodsTradeBalanceChart',
  meta: {
    title: '中国货物进出口贸易差额chart'
  },
  component: () => import('@/views/foreignTrade/goodsTrade/sharePages/GoodsTradeBalanceChart')
},
{
  path: '/tradeByCommodityChart',
  name: 'tradeByCommodityChart',
  meta: {
    title: '货物进出口总值（商品类别）'
  },
  component: () => import('@/views/foreignTrade/goodsTrade/sharePages/TradeByCommodityChart')
}, {
  path: '/tradeByCustomRegimeChart',
  name: 'tradeByCustomRegimeChart',
  meta: {
    title: '货物进出口总值按贸易方式统计'
  },
  component: () => import('@/views/foreignTrade/goodsTrade/sharePages/TradeByCustomRegimeChart')
}, {
  path: '/tradeByEnterpriseTypeChart',
  name: 'tradeByEnterpriseTypeChart',
  meta: {
    title: '货物进出口总值（企业性质）'
  },
  component: () => import('@/views/foreignTrade/goodsTrade/sharePages/TradeByEnterpriseTypeChart')
}, {
  path: '/tradeByOriginChart',
  name: 'tradeByOriginChart',
  meta: {
    title: '中国货物进出口总值按国家/地区统计'
  },
  component: () => import('@/views/foreignTrade/goodsTrade/sharePages/TradeByOriginChart')
}, {
  path: '/totalTradeInServicesChart',
  name: 'totalTradeInServicesChart',
  meta: {
    title: '中国服务贸易进出口总值'
  },
  component: () => import('@/views/foreignTrade/servicesTrade/sharePages/TotalTradeInServicesChart')
}, {
  path: '/volumeByServiceTypeChart',
  name: 'volumeByServiceTypeChart',
  meta: {
    title: '服务贸易分类统计'
  },
  component: () => import('@/views/foreignTrade/servicesTrade/sharePages/VolumeByServiceTypeChart')
}, {//宏观经济指标
  path: '/consumerPriceIndexChart',
  name: 'consumerPriceIndexChart',
  meta: {
    title: '消费者价格指数CPI'
  },
  component: () => import('@/views/economicIndicators/sharePages/ConsumerPriceIndexChart')
}, {
  path: '/foreignCurrencyReservesChart',
  name: 'foreignCurrencyReservesChart',
  meta: {
    title: '国家外汇储备'
  },
  component: () => import('@/views/economicIndicators/sharePages/ForeignCurrencyReservesChart')
}, {
  path: '/grossDomesticProductChart',
  name: 'grossDomesticProductChart',
  meta: {
    title: '国内生产总值GDP'
  },
  component: () => import('@/views/economicIndicators/sharePages/GrossDomesticProductChart')
}, {
  path: '/industrialProfitsChart',
  name: 'industrialProfitsChart',
  meta: {
    title: '工业企业利润'
  },
  component: () => import('@/views/economicIndicators/sharePages/IndustrialProfitsChart')
}, {
  path: '/industryAddValueChart',
  name: 'industryAddValueChart',
  meta: {
    title: '工业增加值chart'
  },
  component: () => import('@/views/economicIndicators/sharePages/IndustryAddValueChart')
}, {
  path: '/investmentFixedAssetsChart',
  name: 'investmentFixedAssetsChart',
  meta: {
    title: '固定资产投资（不含农户）'
  },
  component: () => import('@/views/economicIndicators/sharePages/InvestmentFixedAssetsChart')
}, {
  path: '/moneySupplyChart',
  name: 'moneySupplyChart',
  meta: {
    title: '货币供应量 (M2) '
  },
  component: () => import('@/views/economicIndicators/sharePages/MoneySupplyChart')
}, {
  path: '/nationalFinanceChart',
  name: 'nationalFinanceChart',
  meta: {
    title: '国家财政收支'
  },
  component: () => import('@/views/economicIndicators/sharePages/NationalFinanceChart')
},
{
  path: '/producerPriceIndexChart',
  name: 'producerPriceIndexChart',
  meta: {
    title: '工业生产者出厂价格指数'
  },
  component: () => import('@/views/economicIndicators/sharePages/ProducerPriceIndexChart')
}, {
  path: '/purchasingManagersIndexChart',
  name: 'purchasingManagersIndexChart',
  meta: {
    title: '采购经理人指数PMI'
  },
  component: () => import('@/views/economicIndicators/sharePages/PurchasingManagersIndexChart')
}, {
  path: '/salesConsumerGoodsChart',
  name: 'salesConsumerGoodsChart',
  meta: {
    title: '社会消费品零售总额'
  },
  component: () => import('@/views/economicIndicators/sharePages/SalesConsumerGoodsChart')
}, {
  path: '/unemployExamineChart',
  name: 'unemployExamineChart',
  meta: {
    title: '调查失业率'
  },
  component: () => import('@/views/economicIndicators/sharePages/UnemployExamineChart')
}, {
  path: '/unemployRegisterChart',
  name: 'unemployRegisterChart',
  meta: {
    title: '登记失业率'
  },
  component: () => import('@/views/economicIndicators/sharePages/UnemployRegisterChart')
},
{
  path: '/test',
  name: '',
  component: () => import('@/views/test/index'),
}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  store.commit('setShowOperate', true);
  // if(store.getters.userInfo.sessionToken){//判断token是否过期  过期后退出操作清空所有登录信息
  //   user.becomeLogin(store.getters.userInfo.sessionToken).then((res)=>{
  //   }).catch(async (err)=>{
  //         user.logOut();
  //         storage.clear();
  //         store.commit('setUserInfo',{});
  //   });
  // }
  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if (true) { // 判断当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }

});
export default router
