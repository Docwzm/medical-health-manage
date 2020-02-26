<style lang="less" scoped>
  @import "../../style.less";
</style>

<template>
  <div class="chart">
    <!--<div class="graph-toggles">-->
    <!--<el-popover ref="popover2" placement="bottom" width="400" trigger="click">-->
    <!--<div class="bp-desc-box">-->
    <!--<p>血压是指血管内的血液在单位面积上的侧压力，即压强，习惯以毫米汞柱 (mmHg) 为单位。</p>-->
    <!--<p>心脏有收缩及放松期，当心脏收缩，左心室便会将血液泵出到主动脉，主动脉压产生最高血压，又称收缩压。</p>-->
    <!--<p>接下来，心脏会舒张，血液流入右心房，这个时候压力最低，称为低血压或舒张压。</p>-->
    <!--<div class="table">-->
    <!--<table>-->
    <!--<tr>-->
    <!--<th>-->
    <!--<div class="cc"><span>血压(mmHg)</span> <span>等级</span></div>-->
    <!--</th>-->
    <!--<th>收缩压(SYS)</th>-->
    <!--<th>舒张压(DIA)</th>-->
    <!--</tr>-->
    <!--<tr>-->
    <!--<td>低血压</td>-->
    <!--<td><90</td>-->
    <!--<td><60</td>-->
    <!--</tr>-->
    <!--<tr>-->
    <!--<td>正常血压</td>-->
    <!--<td>90~119</td>-->
    <!--<td>60~79</td>-->
    <!--</tr>-->
    <!--<tr>-->
    <!--<td>正常高值</td>-->
    <!--<td>120~139</td>-->
    <!--<td>80~89</td>-->
    <!--</tr>-->
    <!--<tr>-->
    <!--<td>轻度高血压</td>-->
    <!--<td>140~159</td>-->
    <!--<td>90~99</td>-->
    <!--</tr>-->
    <!--<tr>-->
    <!--<td>中度血压</td>-->
    <!--<td>160~179</td>-->
    <!--<td>100~109</td>-->
    <!--</tr>-->
    <!--<tr>-->
    <!--<td>高度血压</td>-->
    <!--<td>180</td>-->
    <!--<td>110</td>-->
    <!--</tr>-->
    <!--</table>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-popover>-->
    <!--<div class="des"><span v-html="img.des"></span>-->
    <!--<el-button type="text" v-popover:popover2>血压说明</el-button>-->
    <!--</div>-->

    <!--<my-dropdown class="right" :label="graphTypeName" butype="text"-->
                 <!--:menu="[{key: 'trend', name: '血压趋势变化图'}, {key: 'errCount', name: '血压异常分布图'}]"-->
                 <!--:value="0" async="graphType"></my-dropdown>-->
    <div class="title">{{title}}</div>

    <el-button-group class="otherRight">
      <el-button @click="setQuery(tab,'timeRange')" v-for="(tab,index) in dateRangeTabs" :key="index"
                 :class="{'active': tab.name === timeRange}">
        {{tab.label}}
      </el-button>
    </el-button-group>

    <echarts :data-tip="tip" :options="polar" ref="bp" theme="ovilia-green" :class="{'noneData': isData}"
             auto-resize></echarts>

  </div>
</template>

<script>
  // components
  import MyDropdown from '../../../../../../../components/common/dropdown/MyDropdown.vue'
  import echarts from '../../../../../../../components/common/echarts/MyEcharts.vue'

  // API
//  import {getDoctorApi} from '../../../../../../../api/account'
  // actios
  import actions from '../../actions'
  // mutations
  import {MUTATION_NAME} from '../../mutations'
  import {DOCTOR}from '../../../../../../../store/mutation-types'
  // t
  import * as s from '../../util'
  import {polar, defBpData} from '../../chartsDef'
  import {getTrendGraphDataApi, getErrCountGraphDataApi} from '../../../../../../../api/abnormal'
  import {getlineArr, splitArr} from '../../../../../../../components/common/echarts/util'

  export default{
    name: 'info_chart',
    props: {},
    data () {
      return {
        isData: 0,
        polar,
        dateRangeTabs: [
          {label: '1天', name: 'day'},
          {label: '7天', name: 'week'},
          {label: '30天', name: 'month'},
          {label: '1年', name: 'year'}
        ],
      }
    },
    components: {
      MyDropdown,
      echarts,
    },
    computed: {
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
      doctorId () {
        return this.$store.state[DOCTOR].id
      },
      tipName () {
        return {day: '时', week: '周', month: '天', year: '月'}[this.timeRange]
      },
      timeRange () {
        return this.$route.query.timeRange || ((this.chartType === 'bs') ? 'week' : 'day')
      },
      graphType () {
        return this.$route.query.graphType || 'trend'
      },
      chartType () {
        return this.$route.query.chartType || 'bp'
      },
      title () {
        const {graphType, timeRange, chartType} = this
        return this.getTitle({graphType, timeRange, chartType})
      },
      tip () {
        return this.graphType === 'trend' ? '暂无测量数据' : '暂无异常数据'
      },
      graphTypeName () {
        return (this.$route.query.graphType === 'errCount') ? '血压异常分布图' : '血压趋势变化图'
      },
    },
    watch: {
//      'graphType' () {
//        this.initChart()
//      },
      'chartType' () {
        this.initChart()
      },
      Def () {
        this.initChart()
      }
    },
    methods: {
      ...actions,
      async initChart () {
        const {userId} = this.Def
        console.log(userId)
        if (!userId) return
        !!this.Def && this.$refs.bp && s.loading(this.$refs.bp)
//        const {id: doctorId} = await getDoctorApi()
        const {graphType, timeRange, chartType} = this
        const series = await this.getApiData()
        this.polar = series && {
          ...this.polar,
//          title: s.titleSet({graphType, timeRange, chartType}),
          tooltip: s.sooltipSet({graphType, timeRange}),
          xAxis: s.xAxisSet(timeRange),
          yAxis: s.yAxisSet({graphType, chartType}),
          series
        }
      },
      setQuery(tab, queryName){
        this.$router.replace({query: {...this.$route.query, [queryName]: tab.name}})
        this.initChart()
      },
      async getApiData () { // 获取血压相关数据
        console.log("获取数据")
        let {graphType, timeRange} = this
        const {userId, id: patientId} = this.Def
        // '收缩压', systolicPressure,  '舒张压', diastolicPressure
        let spData = null
        let dpData = null
        if (graphType === 'trend') {
          const res = await getTrendGraphDataApi({type: timeRange, userId})
          this.isData = res && res.length !== 0 ? 0 : 1
          spData = splitArr(getlineArr(res, 'systolicPressure', timeRange))
          dpData = splitArr(getlineArr(res, 'diastolicPressure', timeRange))
        } else {
          const res = await getErrCountGraphDataApi({type: timeRange, patientId, doctorId: this.doctorId})
          this.isData = res && res.length !== 0 ? 0 : 1
          spData = getlineArr(res, 'systolicPressureTimes', timeRange)
          dpData = getlineArr(res, 'diastolicPressureTimes', timeRange)
        }
        return this.isData ? defBpData({timeRange}) : [...s.seriesSet(graphType, '收缩压', spData), ...s.seriesSet(graphType, '舒张压', dpData)]
      }
    },
    created () {
      const {graphType, timeRange, chartType} = this
      this.polar = {...this.polar, xAxis: s.xAxisSet(timeRange), 'yAxis': s.yAxisSet({graphType, chartType})}
    },
    mounted(){
//      this.initChart()
      if (this.Def) {
//        this.initChart()
//        setInterval(() => {
//          this.$refs.bp.clear()
          this.initChart()
//        }, 300000)
      }
    },
    destroyed () {
    }
  }
</script>
