// 创建 axios 实例
import axios from 'axios'
const baseURL='/SMSapi';
axios.defaults.baseURL=baseURL;
if(process.env.NODE_ENV === 'development'){
  axios.defaults.baseURL=baseURL
}else{
    axios.defaults.baseURL=process.env.VUE_APP_SMS_URL||''
}
const Axios = axios.create({
  // baseURL: process.env.VUE_APP_SMS_URL, // 基础url,如果是多环境配置这样写，也可以像下面一行的写死。
  // baseURL: '/SMSapi', // 基础url,如果是多环境配置这样写，也可以像下面一行的写死。
　　// baseURL: 'http://168.192.0.123',
  timeout: 6000 // 请求超时时间
})
 
// 错误处理函数
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    // const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
    }
    if (error.response.status === 401) {
      
    }
  }
  return Promise.reject(error)
}

// request interceptor(请求拦截器)
Axios.interceptors.request.use(config => {
    config.headers['X-Parse-Application-Id'] =process.env.VUE_APP_ID;  // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['X-Parse-REST-API-Key'] = process.env.VUE_APP_REST_API_KEY  // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['Content-Type'] = 'application/json'  // 让每个请求携带自定义 token 请根据实际情况自行修改
  return config
}, err)

// response interceptor（接收拦截器）
Axios.interceptors.response.use((response) => {
  const res = response.data
  if (res.code !== 0&&res.code!==200) {
    return Promise.reject(res)
  } else {
    return res
  }
}, err)

export default Axios