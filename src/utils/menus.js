import {getRequest} from './api.js'

export const initMenu=(router,store)=>{
	if(store.state.routes.length>0){
		return;
	}
	getRequest('/menu/list').then(data=>{
		if(data){
			//格式化Router
			let fmtRoutes=formatRoutes(data);
			//添加到router
			router.addRoutes(fmtRoutes);
			//将数据存入vuex
			store.commit('initRoutes',fmtRoutes);
			store.dispatch('connect');//连接websocket
		}
	})
}

export const formatRoutes=(routes)=>{
	let  fmtRoutes=[];
	routes.forEach(router=>{
		let{
			path,
			component,
			name,
			iconCls,
			children,
		}=router;
		if(children&&children instanceof Array){
			//递归
			children=formatRoutes(children);
		}
		let fmRouter={
			path:path,
			name:name,
			iconCls:iconCls,
			children:children,
			component(resolve){
				if(component.startsWith('Home')){
					require(['../views/'+component+'.vue'],resolve);
				}else if(component.startsWith('User')){
					require(['../views/user/'+component+'.vue'],resolve);
				}else if(component.startsWith('Car')){
					require(['../views/car/'+component+'.vue'],resolve);
				}else if(component.startsWith('Area')){
					require(['../views/area/'+component+'.vue'],resolve);
				}else if(component.startsWith('Stall')){
					require(['../views/stall/'+component+'.vue'],resolve);
				}else if(component.startsWith('Mail')){
					require(['../views/mail/'+component+'.vue'],resolve);
				}else if(component.startsWith('Cfg')){
					require(['../views/cfg/'+component+'.vue'],resolve);
				}
			}
		}
		fmtRoutes.push(fmRouter)
	});
	return fmtRoutes;
}