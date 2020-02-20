import './utils'
import Vue from 'vue'
// import { initSentry } from '@ls/utils';
import App from './App'
import router from './router'
import './common/styles/reset.less';

// initSentry('https://bb6b38a568624851a08fa73d8e4a1426@sentry.lifesense.com/19');

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
