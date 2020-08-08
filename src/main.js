import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
axios.defaults.baseURL = '/shop'
// 设置请求拦截器，在header中添加bo-token和refresh-token
axios.interceptors.request.use(config => {
  const botoken = window.sessionStorage.getItem('botoken')
  const refreshtoken = window.sessionStorage.getItem('refreshtoken')
  const currentRoleId = window.sessionStorage.getItem('currentRoleId')
  config.headers.botoken = botoken === null ? '' : botoken
  config.headers.refreshtoken = refreshtoken === null ? '' : refreshtoken
  config.headers.roleId = currentRoleId
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
  console.log('error...:', err)
  console.log('vm...:', vm)
  console.log('info...:', info)
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
