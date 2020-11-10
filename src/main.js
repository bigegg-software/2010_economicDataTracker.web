import Vue from 'vue'
import App from './App.vue'
import Parse from '@/request'
import router from './router'
import store from '@/vuexStore'
// economic data tracker 项目名
import './utils/lib-flexible' // 根据屏幕宽度，自动设置html的font-size
import './assets/font/iconfont.css'
// antd 
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);
import {
  fontSize
} from './utils/echarts.js'
Vue.prototype.$fz = fontSize
Vue.prototype.$Parse = Parse
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    window.addEventListener('resize', () => {
      this.$EventBus.$emit('resize')
    })
  }
}).$mount('#app')
