<style lang="less">
  @import '../../styles/global.less';
</style>
<template>
    <!--<my-loadingbar></my-loadingbar>-->
    <!-- 路由外链 -->
    <router-view></router-view>
</template>

<script type="text/babel">
  import '@/components/common/elementUI'
  //  import store from './store'
  import MyLoadingbar from '@/components/common/loadingbar/MyLoadingbar.vue'
  export default {
    replace: false,
//    store, // 仅需要在根组件中注入 store 实例一次即可
    components: {
      MyLoadingbar,
    }
  }
</script>
