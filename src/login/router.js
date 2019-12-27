/*
 * @Author: your name
 * @Date: 2019-10-21 13:51:08
 * @LastEditTime: 2019-10-31 16:00:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ysgz_webc:\developer\own-system\src\login\router.js
 */
import Vue from 'vue'
import Router from 'vue-router'
const index = () => import( /* webpackChunkName: "group-index" */ './views/loginIndex.vue')
const management = () => import( /* webpackChunkName: "group-index" */ './views/management.vue')
const article = () => import( /* webpackChunkName: "group-index" */ './views/article/article.vue')
const code = () => import( /* webpackChunkName: "group-index" */ './views/code/code.vue')
const department = () => import( /* webpackChunkName: "group-index" */ './views/department/department.vue')
const aenum = () => import( /* webpackChunkName: "group-index" */ './views/enum/enum.vue')
const log = () => import( /* webpackChunkName: "group-index" */ './views/log/log.vue')
const menu = () => import( /* webpackChunkName: "group-index" */ './views/menu/menu.vue')
const product = () => import( /* webpackChunkName: "group-index" */ './views/product/product.vue')
const role = () => import( /* webpackChunkName: "group-index" */ './views/role/role.vue')
const user = () => import( /* webpackChunkName: "group-index" */ './views/user/user.vue')
const work = () => import( /* webpackChunkName: "group-index" */ './views/work/work.vue')
const util = () => import( /* webpackChunkName: "group-index" */ './views/util/util.vue')
Vue.use(Router);
export default new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			name: 'index',
			component: index
		},
		{
			path: '/management',
			name: 'management',
			component: management,
			children: [
				{
					path: '/article',
					name: 'article',
					component: article
				}, {
					path: '/code',
					name: 'code',
					component: code
				}, {
					path: '/department',
					name: 'department',
					component: department
				}, {
					path: '/enum',
					name: 'enum',
					component: aenum
				}, {
					path: '/log',
					name: 'log',
					component: log
				}, {
					path: '/menu',
					name: 'menu',
					component: menu
				}, {
					path: '/product',
					name: 'product',
					component: product
				}, {
					path: '/role',
					name: 'role',
					component: role
				}, {
					path: '/user',
					name: 'user',
					component: user
				}, {
					path: '/work',
					name: 'work',
					component: work
				},{
					path: '/software',
					name: '开发软件',
					component: article
				},{
					path: '/standard',
					name: '开发规范',
					component: article
				},{
					path: '/toolExplain',
					name: '共享空间',
					component: article
				},{
					path: '/share',
					name: '技术分享',
					component: article
				},{
					path: '/static',
					name: '静态资源管理',
					component: util
				},
				
			]
		}, 

	]
})