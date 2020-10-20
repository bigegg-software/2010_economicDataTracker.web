import Vue from 'vue'
import VueRouter from 'vue-router'

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
  redirect:{name:'outflows'},
  component: () => import('@/views/home/Home.vue'),
  children: [{
      path: 'foreignCapital',
      name: 'foreignCapital',
      redirect:{name:'outflows'},
      meta:{title:'外资'},
      component: () => import('@/views/foreignCapital/ForeignCapital.vue'),
      children: [
        {
          path:'outBound',
          name:'outBound',
          meta:{title:'中国对外投资'},
          component:() => import('@/views/foreignCapital/outbound'),
          children:[
                  {
                    path:'outflows',
                    name:'outflows',
                    meta:{title:'中国对外直接投资流量'},
                    component: () => import('@/views/foreignCapital/outbound/Outflows')
                  },
                  {
                    path:'outstocks',
                    name:'outstocks',
                    meta:{title:'中国对外直接投资存量'},
                    component: () => import('@/views/foreignCapital/outbound/Outstocks')
                  },
                  {
                    path:'outstocksByDestination',
                    name:'outstocksByDestination',
                    meta:{title:'中国对外直接投资存量按国家和地区统计'},
                    component: () => import('@/views/foreignCapital/outbound/OutstocksByDestination')
                  },
                  {
                    path:'outflowsByDestination',
                    name:'outflowsByDestination',
                    meta:{title:'中国对外直接投资流量按国家和地区统计'},
                    component: () => import('@/views/foreignCapital/outbound/OutflowsByDestination')
                  },
                  {
                    path:'outflowsByIndustry',
                    name:'outflowsByIndustry',
                    meta:{title:'中国对外直接投资流量行业分布情况'},
                    component: () => import('@/views/foreignCapital/outbound/OutflowsByIndustry')
                  },
                  {
                    path:'outflowsBeltAndRoad',
                    name:'outflowsBeltAndRoad',
                    meta:{title:'中国对“一带一路”沿线国家投资情况'},
                    component: () => import('@/views/foreignCapital/outbound/OutflowsBeltAndRoad')
                  },
                  {
                    path:'overseasProjects',
                    name:'overseasProjects',
                    meta:{title:'中国对外承包工程'},
                    component: () => import('@/views/foreignCapital/outbound/OverseasProjects')
                  },
                  {
                    path:'internationalLabor',
                    name:'internationalLabor',
                    meta:{title:'中国对外劳务合作'},
                    component: () => import('@/views/foreignCapital/outbound/InternationalLabor')
                  }
          ]
        },
        {
          path:'inBound',
          name:'inBound',
          meta:{title:'外商投资中国'},
          component:() => import('@/views/foreignCapital/inbound'),
          children:[
            {
              path:'inflows',
              name:'inflows',
              meta:{title:'实际使用外资'},
              component:() => import('@/views/foreignCapital/inbound/Inflows')
            },
            {
              path:'majorForeignInvestors',
              name:'majorForeignInvestors',
              meta:{title:'主要对华投资国家/地区'},
              component:() => import('@/views/foreignCapital/inbound/MajorForeignInvestors')
            },
            {
              path:'foreignInvestIndustry',
              name:'foreignInvestIndustry',
              meta:{title:'外商直接投资主要行业'},
              component:() => import('@/views/foreignCapital/inbound/ForeignInvestIndustry')
            },
            {
              path:'foreignInvestTax',
              name:'foreignInvestTax',
              meta:{title:'外商投资企业税收统计'},
              component:() => import('@/views/foreignCapital/inbound/ForeignInvestTax')
            },
            {
              path:'beltAndRoadInvest',
              name:'beltAndRoadInvest',
              meta:{title:'"一带一路"沿线国家对华投资情况'},
              component:() => import('@/views/foreignCapital/inbound/BeltAndRoadInvest')
            }
          ]
        },
        {
          path:'twoWayInvestment',
          name:'twoWayInvestment',
          meta:{title:'双向直接投资'},
          component:() => import('@/views/foreignCapital/twoWayInvestment'),
          children:[
            {
              path:'outflowsVsInflows',
              name:'outflowsVsInflows',
              meta:{title:'双向直接投资',requireAuth:true},
              component:() => import('@/views/foreignCapital/twoWayInvestment/OutflowsVsInflows')
            }
          ]
        }
        ]
    },
    {
      path: 'foreignTrade',
      name: 'foreignTrade',
      component: () => import('@/views/foreignTrade/ForeignTrade.vue'),
    },
    {
      path: 'economicIndicators',
      name: 'economicIndicators',
      component: () => import('@/views/economicIndicators/EconomicIndicators.vue'),
    },

  ]
},
// 分享图表页面
// 中国对外直接投资流量
{
  path:'/outflowsChart',
  name:'outflowsChart',
  meta:{title:'中国对外直接投资流量chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/OutflowsChart')
},
// 中国对外直接投资存量
{
  path:'/outstocksChart',
  name:'outstocksChart',
  meta:{title:'中国对外直接投资存量chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/OutstocksChart')
},
{
  path:'/flowsAndStocksChart',
  name:'flowsAndStocksChart',
  meta:{title:'中国对外直接投资流量与存量chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/FlowsAndStocksChart')
},
// flows 中国对外直接投资流量按国家和地区统计
{
  path:'/flowsByContinentChart',
  name:'flowsByContinentChart',
  meta:{title:'中国对外直接投资流量按大洲统计chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/FlowsByContinentChart')
},
{
  path:'/flowsByCRIContinentChart',
  name:'flowsByCRIContinentChart',
  meta:{title:'中国对外直接投资流量按各洲内国家/地区统计chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/FlowsByCRIContinentChart')
},
{
  path:'/flowsByDestinationChart',
  name:'flowsByDestinationChart',
  meta:{title:'中国对外直接投资流量按国家和地区统计chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/FlowsByDestinationChart')
},
{
  path:'/flowsTwentyDestinationChart',
  name:'flowsTwentyDestinationChart',
  meta:{title:'中国对外直接投资流量按历年前20位国家chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/FlowsTwentyDestinationChart')
},
// stocks 中国对外直接投资存量按国家和地区统计
{
  path:'/stocksByContinentChart',
  name:'stocksByContinentChart',
  meta:{title:'中国对外直接投资存量按大洲统计chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/StocksByContinentChart')
},
{
  path:'/stocksByCRIContinentChart',
  name:'stocksByCRIContinentChart',
  meta:{title:'中国对外直接投资存量按各洲内国家/地区统计chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/StocksByCRIContinentChart')
},
{
  path:'/stocksByDestinationChart',
  name:'stocksByDestinationChart',
  meta:{title:'中国对外直接投资存量按国家和地区统计chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/StocksByDestinationChart')
},
{
  path:'/stocksTwentyDestinationChart',
  name:'stocksTwentyDestinationChart',
  meta:{title:'中国对外直接投资存量按历年前20位国家chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/StocksTwentyDestinationChart')
},
// 中国对外直接投资流量行业分布情况
{
  path:'/outflowsByIndustryChart',
  name:'outflowsByIndustryChart',
  meta:{title:'中国对外直接投资流量行业分布情况chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/OutflowsByIndustryChart')
},
{
  path:'/economyByIndustryChart',
  name:'economyByIndustryChart',
  meta:{title:'中国对主要经济体投资按行业统计chart'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/EconomyByIndustryChart')
},
// 中国对“一带一路”沿线国家直接投资情况
{
  path:'/nonFinancialToBRIChart',
  name:'nonFinancialToBRIChart',
  meta:{title:'中国对“一带一路”沿线国家非金融类直接投资情况'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/NonFinancialToBRIChart')
},
{
  path:'/newContractAmountToBRIChart',
  name:'newContractAmountToBRIChart',
  meta:{title:'新签合同额'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/NewContractAmountToBRIChart')
},
{
  path:'/amountGrowthToBRIChart',
  name:'amountGrowthToBRIChart',
  meta:{title:'完成营业额'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/AmountGrowthToBRIChart')
},
// 中国对外承包工程
{
  path:'/amountGrowthToOPChart',
  name:'amountGrowthToOPChart',
  meta:{title:'完成营业额'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/AmountGrowthToOPChart')
},
{
  path:'/newContractAmountToOPChart',
  name:'newContractAmountToOPChart',
  meta:{title:'新签合同额'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/NewContractAmountToOPChart')
},
{
  path:'/topTenCountriesToOPChart',
  name:'topTenCountriesToOPChart',
  meta:{title:'前十国别（市场）'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/TopTenCountriesToOPChart')
},
{
  path:'/topTenProjectToOPChart',
  name:'topTenProjectToOPChart',
  meta:{title:'前十项目'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/TopTenProjectToOPChart')
},
// 中国对外劳务合作
{
  path:'/tradeVolumeChart',
  name:'tradeVolumeChart',
  meta:{title:'派出人数'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/TradeVolumeChart')
},
{
  path:'/topTenDestOfWorkersChart',
  name:'topTenDestOfWorkersChart',
  meta:{title:'年度派出各类劳务人员前10位目的地国家'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/TopTenDestOfWorkersChart')
},
{
  path:'/topTenDestOfNumOfWorkersChart',
  name:'topTenDestOfNumOfWorkersChart',
  meta:{title:'12月末在外各类劳务人员前10位国家'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/TopTenDestOfNumOfWorkersChart')
},
{
  path:'/industryOfWorkersNumChart',
  name:'industryOfWorkersNumChart',
  meta:{title:'派出人数主要行业'},
  component:()=>import('@/views/foreignCapital/outbound/sharePages/IndustryOfWorkersNumChart')
},
// 外商投资中国模块charts
// 实际使用外资
{
  path:'/inflowsChart',
  name:'inflowsChart',
  meta:{title:'实际使用外资'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/InflowsChart')
},
// 主要对华投资国家/地区
{
  path:'/investProportionInChinaChart',
  name:'investProportionInChinaChart',
  meta:{title:'国家和地区对华投资比重'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/InvestProportionInChinaChart')
},
{
  path:'/stateDirectInvestInChinaChart',
  name:'stateDirectInvestInChinaChart',
  meta:{title:'年度部分国家/地区对华直接投资'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/StateDirectInvestInChinaChart')
},
{
  path:'/topFifteenCountriesChart',
  name:'topFifteenCountriesChart',
  meta:{title:'前15位国家/地区'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/TopFifteenCountriesChart')
},
// 外商直接投资主要行业
{
  path:'/numEnterprisesChart',
  name:'numEnterprisesChart',
  meta:{title:'开办企业数'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/NumEnterprisesChart')
},
{
  path:'/inflowsToChinaChart',
  name:'inflowsToChinaChart',
  meta:{title:'实际使用外资金额'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/InflowsToChinaChart')
},
// 外商投资企业税收统计
{
  path:'/foreignInvestTaxChart',
  name:'foreignInvestTaxChart',
  meta:{title:'外商投资企业税收统计'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/ForeignInvestTaxChart')
},
// "一带一路"沿线国家对华投资情况
{
  path:'/numEnterprisesBRIChart',
  name:'numEnterprisesBRIChart',
  meta:{title:'企业数'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/NumEnterprisesBRIChart')
},
{
  path:'/inflowsToChinaBRIChart',
  name:'inflowsToChinaBRIChart',
  meta:{title:'实际投入外资金额'},
  component:()=>import('@/views/foreignCapital/inbound/sharePages/InflowsToChinaBRIChart')
},
// 双向直接投资模块charts
{
  path:'/outflowsVsInflowsChart',
  name:'outflowsVsInflowsChart',
  meta:{title:'双向直接投资'},
  component:()=>import('@/views/foreignCapital/twoWayInvestment/sharePages/OutflowsVsInflowsChart')
},
{
  path: '/test',
  name: '',
  component: () => import('@/views/test/index'),
}]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
    if (true) { // 判断当前的token是否存在
      next();
    }else {
    next({
    path: '/login',
    query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
    })
    }
    }
    else {
      next();
    }
});
export default router
