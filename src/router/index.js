import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/view/home'),
    },
    {
      path: '/login',
      component: () => import('@/view/login'),
      name:'login'
    }
  ],
});

export default router
