<style lang="stylus" scoped>
  .my-input {
    width: 200px
  }
</style>

<template>
  <div>
    <my-input placeholder="请输入内容" class="my-input">
      <template slot="prepend">Http://</template>
    </my-input>

    <my-input placeholder="请输入内容">
      <el-select slot="prepend" placeholder="请选择">
        <el-option label="餐厅名" value="1"></el-option>
        <el-option label="订单号" value="2"></el-option>
        <el-option label="用户电话" value="3"></el-option>
      </el-select>
      <el-button slot="append" icon="search"></el-button>
    </my-input>
  </div>
</template>

<script size="text/babel">
  import MyInput from '../../../../../../components/common/input/MyInput'
  export default {
    name: 'MyInputTest',
    components: {
      MyInput,
    },
    data () {
      return {}
    },
    methods: {
      fn_fous (e) {
        console.log(e)
      }
    }
  }
</script>