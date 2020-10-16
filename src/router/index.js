import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: () => import('@/views/home/Home.vue'),
  children: [{
      path: '/',
      name: 'ForeignCapital',
      component: () => import('@/views/foreignCapital/ForeignCapital.vue'),
      children: [{
        path: '/',
        name: 'FlowsAndStocks',
        meta: {
          title: '中国对外直接投资流量与存量'
        },
        component: () => import('@/views/foreignCapital/outbound/FlowsAndStocks.vue'),
      }]
    },
    {
      path: '/foreignTrade',
      name: 'ForeignTrade',
      component: () => import('@/views/foreignTrade/ForeignTrade.vue'),
    },
    {
      path: '/economicIndicators',
      name: 'EconomicIndicators',
      component: () => import('@/views/economicIndicators/EconomicIndicators.vue'),
    },

  ]
}, {
  path: '/outbound/share',
  name: '',
  component: () => import('@/views/foreignCapital/outbound/components/OutboundBody'),
}, {
  path: '/test',
  name: '',
  component: () => import('@/views/test/index'),
}]

const router = new VueRouter({
  routes
})

export default router
