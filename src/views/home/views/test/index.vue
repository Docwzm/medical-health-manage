<style lang="less">
  .test-title {
    padding: 0 20px;
  }

  .select-btn {
    margin-right: 10px;
    margin-top: 10px;
    /*width: auto;*/
    /*padding: 6px 2px;*/
  }

  .test-out-container {
    box-sizing: border-box;
    margin-top: 20px;
    padding: 0 20px;
    width: 100%;
  }

  .test-container {
    border: 1px solid #999999;
    width: 100%;
    height: 500px;
    overflow-y: auto;
  }
</style>

<template>
  <div>
    <div class="test-title">
      <my-button v-for="test in tests" class="btn btn-default select-btn" type="info"
                 @click.native="changeRouter(test)">{{test}}
      </my-button>
    </div>

    <div class="test-out-container">
      <div class="test-container">
        <component :is="componentId"></component>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  // 测试的组件
  const components = {
    mybutton: require('./common/button/ButtonTest.vue'),
    mytable: require('./common/table/TableTest.vue'),
    myinput: require('./common/input/inputTest.vue'),
  }
  import router from '../../../../../src/router/index.js'
  import MyButton from '../../../../components/common/button/MyButton.js'
  export default {
    name: 'test-page',
    components: {
      ...components,
      MyButton
    },
    data: () => ({
      selected: null,
      tests: Object.keys(components)
    }),
    methods: {
      changeRouter (name) {
        router.push({path: `/home/test/${name}`})
      }
    },
    computed: {
      componentId: function () {
        return this.$route.params.name
      }
    }
  }
</script>

