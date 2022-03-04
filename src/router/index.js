import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import FriendChat from '../views/chat/FriendChat.vue'
import Info from '../views/Info.vue'
Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Login',
		component: Login,
		hidden: true
	},
	{
		path:'/regis',
		name:'Register',
		component:Register,
		hidden:true
	},
	{
		path:'/home',
		name:'Home',
		component:Home,
		children:[
			{
				path:'/chat',
				name:'在线聊天',
				component:FriendChat
			},
			{
				path:'/info',
				name:'个人中心',
				component:Info
			}
		]
	}
]

const router = new VueRouter({
	routes
})

export default router
