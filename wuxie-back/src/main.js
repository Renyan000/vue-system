import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import vueAxios from 'vue-axios'
import { Message,MessageBox} from 'element-ui';
import ElementUI from 'element-ui'
import utils from './lib/tools'
import  'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$http = Axios
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$utils = utils;
Vue.config.productionTip = false
// Axios.defaults.timeout = 15000 // 请求超时
//  Axios.defaults.baseURL = '/cms/'

new Vue({
  router,
  store,
	Axios,
	vueAxios,
  render: h => h(App)
}).$mount('#app')
