import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
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
