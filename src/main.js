import Vue from 'vue'
import App from './App.vue'
import Parse from '@/request'
import router from './router'
import store from './store'
// economic data tracker 项目名
import './utils/lib-flexible' // 根据屏幕宽度，自动设置html的font-size
import './assets/font/iconfont.css'
// antd 
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);
Vue.prototype.$Parse = Parse
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
