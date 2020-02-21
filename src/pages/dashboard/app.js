import Vue from 'vue'
import moment from 'moment'
moment.locale('zh-cn')

// resource
import '@/api/resource'
import iefix from '@/utils/iefix'

// VueValidator
// import './validator'
// router
// 如果与 vue-router 同时使用，必须在调用 router#map, router#start 等实例方法前安装验证器。
import router from './router'

import App from './App.vue'
iefix()

// 现在我们可以启动应用了！
// 路由器会创建一个 Root 实例，并且挂载到 body 元素上。
// router.start(App, 'body')
const app = new Vue({
  router,
  ...App
})

app.$mount('#dashboard-app')
