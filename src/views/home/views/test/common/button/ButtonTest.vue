<style lang="less" scoped>
  .box > div {
    margin: 20px 50px;
  }
</style>

<template>
  <div class="box">
    <my-button>
      按钮1
    </my-button>
    <my-button text="无法点击" disabled>
    </my-button>
    <my-button text="加载中" loading>
    </my-button>
    <my-button text="自定义" :style="style">
    </my-button>
    <my-button text="large" size="large">
    </my-button>
    <my-button text="normal" size="normal">
    </my-button>
    <my-button text="small" size="small">
    </my-button>
    <my-button text="info" type="info">
    </my-button>
    <my-button text="waring" type="waring">
    </my-button>
    <my-button text="danger" type="danger">
    </my-button>
    <my-button text="success" type="success">
    </my-button>
    <my-button text="primary" type="primary">
    </my-button>
  </div>
</template>

<script size="text/babel">
  import MyButton from '../../../../../../components/common/button/MyButton'
  export default {
    name: 'MyButtonTest',
    components: {
      MyButton,
    },
    data () {
      return {
        style: {
          background: '#9d223c'
        }
      }
    }
  }
</script>

