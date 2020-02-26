<style lang="less" scoped>
  @import "../../style.less";
</style>

<template>
  <div class="chart">
    <div class="title">{{title}}</div>

    <my-dropdown v-show="chartType === 'bs'" class="bpOption" :label="bsTypeText" butype="text" :menu="bsTabs" :change="true" async="bsType"></my-dropdown>

    <el-button-group class="otherRight">
      <el-button @click="setQuery(tab,'timeRange')" v-for="(tab,index) in dateRangeTabs" :key="index"
                 :class="{'active': tab.name === timeRange}">
        {{tab.label}}
      </el-button>
    </el-button-group>

    <echarts :data-tip="tip" :options="polar" ref="bs" theme="ovilia-green" :class="{'noneData': isData}"
             auto-resize></echarts>

  </div>
</template>

<script>
  // components
  import MyDropdown from '../../../../../../../components/common/dropdown/MyDropdown.vue'
  import echarts from '../../../../../../../components/common/echarts/MyEcharts.vue'

  // API
  // actios
  import actions from '../../actions'
  // mutations
  import {MUTATION_NAME} from '../../mutations'
//  import {DOCTOR}from '../../../../../../../store/mutation-types'
  // t
  import moment from 'moment'
  import * as s from '../../util'
  import {polar, defBsData} from '../../chartsDef'
  import {getBloodSugarApi} from '../../../../../../../api/datachart'
  import {getlineArr, splitArr} from '../../../../../../../components/common/echarts/util'

  export default{
    name: 'info_chart',
    props: {},
    data () {
      return {
        isData: 0,
        data: [],
        polar,
        dateRangeTabs: [
          {label: '7天', name: 'week'},
          {label: '30天', name: 'month'},
        ],
        bsTabs: [
          {name: '空腹', key: 0},
          {name: '早餐后', key: 1},
          {name: '午餐前', key: 2},
          {name: '午餐后', key: 3},
          {name: '晚餐前', key: 4},
          {name: '晚餐后', key: 5},
          {name: '睡前', key: 6},
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
//      doctorId () {
//        return this.$store.state[DOCTOR].id
//      },
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
      bsType () {
        return this.$route.query.bsType || 0
      },
      bsTypeText () {
        return this.setName(this.bsType)
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
      'bsType' () {
        this.initChart()
      },
      'chartType' () {
        this.initChart()
      },
      Def () {
        this.initChart()
      }
    },
    methods: {
      ...actions,
      setName (key) {
        return {
          0: '空腹',
          1: '早餐后',
          2: '午餐前',
          3: '午餐后',
          4: '晚餐前',
          5: '晚餐后',
          6: '睡前'
        }[key]
      },
      async initChart () {
        const {userId} = this.Def
        if (!userId) return
        !!this.Def && this.$refs.bs && s.loading(this.$refs.bs)
//        const {id: doctorId} = await getDoctorApi()
        const {graphType, timeRange, chartType, bsType} = this
        const series = await this.getApiData()
        this.polar = series && {
          ...this.polar,
//          title: s.titleSet({graphType, timeRange, chartType}),
          legend: {show: false},
          tooltip: s.bsSooltipSet({chartType, 'bsName': await this.setName(bsType), tipArr: this.getTimes(this.data)}),
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
        const {userId} = this.Def
        const {graphType, timeRange, bsType} = this
//        startTime, endTime
        const endTime = moment().valueOf()
        const startTime = timeRange === 'week' ? moment().subtract(7,'day').valueOf() : moment().subtract(30,'day').valueOf()
        const res = await getBloodSugarApi({userId, mealPeroid: bsType, startTime, endTime})
        this.data = res
        this.isData = res && res.length !== 0 ? 0 : 1
        const bsData = splitArr(getlineArr(res, 'glucoseConcentration', timeRange, 'measurementDate'))
        return this.isData ? defBsData({timeRange}) : [...s.seriesSet(graphType, '血糖', bsData)]
      },
      getTimes (arr = []) {
        if (arr.length === 0) return
        const tipArr = {
          'week': [...new Array(7)].map((t, index) => moment().subtract(index,'day').valueOf()).sort((a, b) => a - b),
          'month': [...new Array(30)].map((t, index) => moment().subtract(index,'day').valueOf()).sort((a, b) => a - b),
        }[this.timeRange]
        return tipArr.map(t => {
          return {...arr.filter(a => moment(a.measurementDate).format('YYYY-MM-DD') === moment(t).format('YYYY-MM-DD'))[0]}.measurementDate || '--'
        })
      },
    },
    created () {
      const {graphType, timeRange, chartType} = this
      this.polar = {...this.polar, xAxis: s.xAxisSet(timeRange), 'yAxis': s.yAxisSet({graphType, chartType}), legend: {show: false}}
    },
    mounted () {
      if (this.Def) {
//        this.initChart()
//        setInterval(() => {
//          this.$refs.bs.clear()
          this.initChart()
//        }, 300000)
      }
    },
    destroyed () {
    }
  }
</script>
