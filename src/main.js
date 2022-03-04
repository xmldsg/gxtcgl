import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'
import 'font-awesome/css/font-awesome.min.css'
import {downloadRequest} from './utils/download'
import {
	postRequest
} from './utils/api.js';
import {
	putRequest
} from './utils/api.js'
import {
	getRequest
} from './utils/api.js'
import {
	deleteRequest
} from './utils/api.js'
import {
	initMenu
} from './utils/menus.js'

Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.downloadRequest=downloadRequest
//将axios挂载到vue实例上，使用时就可以 this.$axios 这样使用了
Vue.prototype.$axios = axios;
//将qs挂载到vue实例上，使用时就可以 this.$qs 这样使用了
Vue.prototype.$qs = qs;

//设置允许axios发送cookie
axios.defaults.withCredentials = true;

Vue.config.productionTip = false

Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
	
	if (window.sessionStorage.getItem('tokenStr')) {
		initMenu(router, store);
		if (!window.sessionStorage.getItem('user')) {
			return getRequest('/user/info').then(response => {
				if (response) {
					window.sessionStorage.setItem('user', JSON.stringify(response));
					store.commit('INIT_ADMIN',response);
					next();
				}
			})
		}
		next();
	} else {
		if (to.path == '/'||to.path=='/regis') {
			next();
		} else {
			next('/?redirect=' + to.path);
		}

	}

})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
