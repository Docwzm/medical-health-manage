import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

// 如果使用 CommonJS 模块规范, 需要显式的使用 Vue.use() 安装路由模块
Vue.use(VueRouter)

// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
const router = new VueRouter({
  // history: true,
  // transitionOnLoad: true
  // mode: 'history',
  routes, // 路由
})

export default router
