<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search-icon
    background #20a0ff
    display inline-block
    height 36px
    width 36px
    padding 0
    background-size contain
    vertical-align middle
    border none
    .svg-holder
      background url(./assets/icon-search.svg)
      display inline-block
      width 36px
      height 36px
  .source-select
    width 105px
    display inline-block
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .bp-list-query-wrapper
    .el-form
      margin-left 20px
    .el-form-item
      margin-right 30px
      label
        margin-right 10px
        vertical-align top
</style>
<template>
  <el-form :inline="true" class="list-query-wrapper bp-list-query-wrapper">

    <el-form-item>
      <label>选择时间段</label>

      <el-date-picker
        type="daterange"
        v-model="mDateRange"
        style="width:180px;font-size: 12px"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <label>数据来源</label>
      <el-select
        class="source-select"
        v-model="source"
      >
        <el-option v-for="(opt,index) in sourceOptions"
        :key="index"
       :label="opt.label"
       :value="opt.value"

        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button class="search-icon" @click="submitForm">
        <span class="svg-holder"></span>
      </el-button>
    </el-form-item>
  </el-form>

</template>
<script type="text/babel">
  import MyButton from '../../../../../components/common/button/MyButton'
  import MyDatePicker from '../../../../../components/common/date/MyDatePicker'
  import moment from 'moment'
  import {
    STORE_NAME,
    QUERY_BP_LIST,
    SAVE_STATE_PROP
  }from './constants'

  export default{
    components: {

    },
    data () {
      // console.log(ElForm)
      return {
        searchIcon: require('!raw-loader!!./assets/icon-search.svg'),
        sourceOptions: [
          {value: '0', label: '设备采集'},
          {value: '1', label: '人工添加'},
          {value: '-1', label: '全部'},
        ],
        inputBegin:'',
        inputEnd:'',
        inputSource:'',
        tempDate:'',
      }
    },
    watch:{
      needInit(v){

        if(v){

          this.$store.dispatch(QUERY_BP_LIST, {
            propName: 'listViewData',
            query: {
              userId:this.$store.getters.userId
            }
          })
        }
      }
    },
    computed: {
      userId(){
        let generalInfo = this.$store.state['views-customer-info-left']
        if(generalInfo&&generalInfo.info&&generalInfo.info.idNO){
          return generalInfo.info.idNO
        }else{
          return -1
        }
      },
      needInit(){
//        console.log(this.$store.getters.userId,'xwedfse')
//        console.log(this.$store.state['views-customer-info-left'])
        return this.$store.getters.userId!=-1&&this.bpState.listViewData == null
      },
      bpState () {
        return this.$store.state[STORE_NAME]
      },

      source:{
        get(){
          if(this.bpState.listViewQuery){
            return this.bpState.listViewQuery.source
          }
        },
        set(v){
          this.$store.commit(SAVE_STATE_PROP,{
            propName:'listViewQuery',
            data:{
              ...this.bpState.listViewQuery,
              source:v
            }
          })
        },
      },
      mDateRange:{
        get(v){
          if(this.bpState.listViewQuery&&this.bpState.listViewQuery.begin){
            //todo

            return [
              new Date(this.bpState.listViewQuery.begin),
              new Date(this.bpState.listViewQuery.end),
            ]
          }
        },
        set(v){
          //todo
          v = v||''
          this.$store.commit(SAVE_STATE_PROP,{
            propName:'listViewQuery',
            data:{
              ...this.bpState.listViewQuery,
              begin: v[0]?v[0].getTime():'',
              end:v[1]?v[1].getTime():''
            }
          })

        }
      },

    },
    mounted(){
      if(this.$store.getters.userId!=-1){
        this.$store.dispatch(QUERY_BP_LIST, {
          propName: 'listViewData',
          query: {
            ...this.bpState.listViewQuery,
            userId:this.$store.getters.userId,

          }
        })
      }
    },
    methods: {
      submitForm () {
        this.$store.commit(SAVE_STATE_PROP,{
          propName:'listViewQuery',
          data:{
            ...this.bpState.listViewQuery,
            pageIndex:1
          }
        })
        this.$store.dispatch(QUERY_BP_LIST,{
          propName:'listViewData',
          query:this.bpState.listViewQuery
        })
      }
    }
  }
</script>
