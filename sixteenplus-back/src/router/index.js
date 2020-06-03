import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/Login.vue'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'login',
			component: Login
		},
		{
			path: '/index',
			name: 'index',
			component: () => import('@/views/index/Index.vue'),
			children: [
				{
					path: '/changePsw',
					name: 'changePsw',
					component: () => import('@/views/ChangePsw.vue'),
				},
				{
					path: '/activityManagement/bannerManagement',
					name: 'bannerManagement',
					component: () => import('@/views/activityManagement/bannerManagement.vue'),
				},
				{
					path: '/activityManagement/companyManagement',
					name: 'companyManagement',
					component: () => import('@/views/activityManagement/companyManagement.vue'),
				},
				{
					path: '/basicDomain/menuManagement',
					name: 'menuManagement',
					component: () => import('@/views/basicDomain/menuManagement.vue'),
				},
				{
					path: '/basicDomain/roleManagement',
					name: 'roleManagement',
					component: () => import('@/views/basicDomain/roleManagement.vue'),
				},
				{
					path: '/basicDomain/roleMenuManagement',
					name: 'roleMenuManagement',
					component: () => import('@/views/basicDomain/roleMenuManagement.vue'),
				},
				{
					path: '/basicDomain/userManagement',
					name: 'userManagement',
					component: () => import('@/views/basicDomain/userManagement.vue'),
				},
			]
		}
	]
})


