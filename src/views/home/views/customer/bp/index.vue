<style lang="stylus" rel="stylesheet/stylus" scoped>
  .nav-hd
  //display flex
    justify-content space-between
    position relative
  .bp-hd
    position relative

  .nav-tabs, .bp-tabs
    width 100%

  .setup-threshold
    position absolute
    right 0
    height 30px
    font-size 12px
    line-height 30px
    top 0
    padding 0 15px
  .thresholds
    //padding 13px 0 12px 0
    display inline-block
    position absolute
    top 12px
    line-height 20px
    right 0
    font-size 12px
    color #999999
    vertical-align middle
    dt,dd
      display inline-block
      vertical-align top
      margin-left 5px
</style>
<style lang="stylus" rel="stylesheet/stylus">
  @import "./customer-bp-g.styl"
  .customer-bp-g
    .bp-hd
      .el-tabs__item
        height inherit
        line-height inherit
        padding 20px 10px
      .el-tabs__header
        margin 0
</style>
<template>
  <div class="customer-bp-g">
    <div class="customer-info">
      <my-nav><span>用户管理</span><router-link to="/home/customer/list"><span>我的用户列表</span></router-link><span>用户详情</span></my-nav>
    </div>
    <customerLeft>
      <div class="nav-hd">
        <my-tabs @tab-click="navTopics" :activeName="'bp'" class="nav-tabs">
          <my-tab-pane v-for="tab in navTabs" :label="tab.name" :name="tab.id">
          </my-tab-pane>
        </my-tabs>
        <my-button
          @click="setThreshold"  class="setup-threshold"
        >自定义血压预警</my-button>
      </div>

      <div class="bp-hd">
        <el-tabs @tab-click="switchTab" :active-name="tabId" class="bp-tabs">
          <el-tab-pane v-for="tab in bpTabs" :label="tab.name" :name="tab.id"></el-tab-pane>

        </el-tabs>

        <dl class="thresholds">
          <dt>血压预警值：</dt>
          <dd>收缩压上限：{{threshold.systolic.alert==1?threshold.systolic.upperLimit:'--'}}mmhg<br>舒张压上限：{{threshold.systolic.alert==1?threshold.diastolic.upperLimit:'--'}}mmhg</dd>
          <dd>收缩压下限：{{threshold.systolic.alert==1?threshold.systolic.lowerLimit:'--'}}mmhg<br>舒张压下限：{{threshold.systolic.alert==1?threshold.diastolic.lowerLimit:'--'}}mmhg</dd>
        </dl>
      </div>
      <div class="customer-data">
        <graph-view v-if="tabId=='graph'"></graph-view>
        <list-view v-if="tabId=='list'"></list-view>
      </div>
      <threshold-dialog ref="thresholdDialog"></threshold-dialog>
    </customerLeft>

  </div>
</template>
<script type="text/babel">
  // todo
  // import Page from '../../../../../components/common/pages/Page'
  import MyButton from '../../../../../components/common/button/MyButton'
  import MyNav from '../../../../../components/common/nav/MyNav.vue'
  import customerLeft from '../../../../../components/customerLeft/index.vue'
  import MyTabs from '../../../../../components/common/tabs/MyTabs'
  import MyTabPane from '../../../../../components/common/tabs/MyTabPane'
  import GraphView from './Graph.vue'
  import ListView from './List.vue'
  import {paramsGetter, queryGetter, route} from '../../../../../store/getters/route'
  import {getPatient} from '../../../../../components/customerLeft/actions'
  import {
    STORE_NAME,
    OPEN_DIALOG,
    SAVE_STATE_PROP,
    QUERY_BP_THRESHOLD
  } from './constants'
  import ThresholdDialog from './SetupThresholdPop.vue'

  export default{
    components: {
      customerLeft,
      MyNav,
      MyTabs,
      MyTabPane,
      GraphView,
      ListView,
      MyButton,
      ThresholdDialog
    },
    data () {
      return {
        navTabs: [
          {
            name: '数据概览',
            id: 'patient_doctor_info'
          },
          {
            name: '血压',
            id: 'bp'
          }
        ],
        bpTabs: [
          {
            name: '数据列表',
            id: 'list'
          },
          {
            name: '数据图表',
            id: 'graph'
          }
        ]
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
      tabId () {
        // console.log(this.$route)
        return this.$route.query.tab || 'list'
      },
      bpState () {
        return this.$store.state[STORE_NAME]
      },
      threshold () {
        return this.bpState.threshold
      },
    },
    watch:{

    },
    methods: {
      setThreshold(){
        //console.log(this.$refs.thresholdDialog.$emit)
        //ThresholdDialog.$emit(OPEN_DIALOG,{name:ThresholdDialog.NAME})
        this.$refs.thresholdDialog.$emit(OPEN_DIALOG)
      },
      switchTab (tab) {
        // window.__router = this.$router
        this.$router.replace({
          query: {tab: tab.name}
        })
      },
      navTopics (t) {
        if(t.name=='patient_doctor_info'){
          this.$router.push({
            name:'patient_doctor_info',
            params:this.$route.params
          })
        }
      }
    },
    mounted () {

      if(this.$store.getters.userId==-1){
        getPatient(this.$store,this.$route.params.id)
      }

    }
  }
</script>
