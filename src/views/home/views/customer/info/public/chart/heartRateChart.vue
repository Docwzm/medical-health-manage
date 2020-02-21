<style lang="less" scoped>
  @import "../../style.less";
</style>

<template>
  <div class="chart" :key="data.dateStamp">
    <div v-show="titleShow" class="title">心率数据变化趋势</div>

    <echarts :key="data.dateStamp" :data-tip="tip" :options="polar" :ref="`heartRate_${data.dateStamp}`" theme="ovilia-green" :class="{'noneData': isData}"
             auto-resize></echarts>

    <div class="colorBar">
      <span><span class="title">热身</span>
        <span class="bar"><div :style="`background-color: #ffe400;width:${percent.exetimeWarmUp && percent.exetimeWarmUp.w || 0}%`"></div></span>
        <span class="time">{{percent.exetimeWarmUp && toMinuteForHoursFilter(percent.exetimeWarmUp.v, '') || '0分钟'}}</span></span>
      <span><span class="title">耐力</span>
        <span class="bar"><div :style="`background-color: #f26b08;width:${percent.exetimeCpm && percent.exetimeCpm.w || 0}%`"></div>
        </span><span class="time">{{percent.exetimeCpm && toMinuteForHoursFilter(percent.exetimeCpm.v, '') || '0分钟'}}</span></span>
      <span><span class="title">燃脂</span>
        <span class="bar"><div :style="`background-color: #ffb500;width:${percent.exetimeLf && percent.exetimeLf.w || 0}%`"></div></span>
        <span class="time">{{percent.exetimeLf && toMinuteForHoursFilter(percent.exetimeLf.v, '') || '0分钟'}}</span></span>
      <span><span class="title">极限</span>
        <span class="bar"><div :style="`background-color: #e51111;width:${percent.exetimeSup && percent.exetimeSup.w || 0}%`"></div>
        </span><span class="time">{{percent.exetimeSup && toMinuteForHoursFilter(percent.exetimeSup.v, '') || '0分钟'}}</span></span>
    </div>

  </div>
</template>

<script>
  // components
  import echarts from '../../../../../../../components/common/echarts/MyEcharts.vue'

  // API
  import {getHeartRateAnalysisApi} from '../../../../../../../api/datachart'
  // actios
  import actions from '../../actions'
  // mutations
  import {MUTATION_NAME} from '../../mutations'
  // filters
  import {
    toMinuteForHoursFilter
  } from '../../../../../../../filters'
  // t
  import moment from 'moment'
  import * as s from '../../util'
  import {polar, defHeartRateData} from '../../chartsDef'

  export default{
    name: 'info_chart',
    props: {
      titleShow: {
        type: [Boolean],
        default: true
      },
      type: {
        type: [String, Number],
        default: 'admin'
      },
      datas: [Array, Object],
    },
    data () {
      return {
        isData: 0,
        data: {},
        percent: {},
        polar,
      }
    },
    components: {
      echarts,
    },
    computed: {
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
      tipName () {
        return {day: '1天', week: '7天', month: '30天', year: '一年'}[this.timeRange]
      },
      timeRange () {
        return this.$route.query.timeRange || 'day'
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
    },
    watch: {
      Def () {
        this.initChart()
      }
    },
    methods: {
      toMinuteForHoursFilter,
      ...actions,
      flet (test) {
        if (!test) return
        let les = []
        const lsTime = new Date(moment().format('YYYY/MM/DD 24:00')).getTime()
        const t = 5 * 60 * 1000
        const fsTime = new Date(moment().format('YYYY/MM/DD 00:00')).getTime()
        for (let i = 0; i < (test.length/2); i++) {
          const value = parseInt(test.substr(i * 2, 2), 16)
          les.push(value === 0 ? {value: [fsTime + (i * t)]} : {name: value, value: [fsTime + (i * t), value]})
        }
        les.push({value: [lsTime]})
        return les
      },
      getCls (heartRates, age = 25) {
        if (!heartRates) return
        const unit = 220 - age
        const normal = {v: unit * 0.5, c: '#1ad4d0'}
        const WarmUp = {v: unit * 0.5, c: '#ffe400'}
        const Cpm = {v: unit * 0.6, c: '#f26b08'}
        const Lf = {v: unit * 0.7, c: '#ffb500'}
        const Sup = {v: unit * 0.85, c: '#e51111'}

        let hrs = []
        for (let i = 0; i < (heartRates.length/2); i++) {
          hrs.push(parseInt(heartRates.substr(i * 2, 2), 16))
        }
        const hrsMax = hrs.reduce((f, l) => f > l ? f : l)
        const hrsMin = hrs.filter(h => h > 0).reduce((f, l) => f < l ? f : l)

        let te = []
        Array.from([Sup, Lf, Cpm, WarmUp], (a) => {
          if (a.v <= hrsMax && a.v >= hrsMin) {
            te.push({v: a.v, c: a.c, b: (1 - (a.v - hrsMin)/(hrsMax - hrsMin))})
          }
        })
        te.push({...normal, b: 1})
        return te
      },
      async initChart () {
        const {userId} = this.Def
        if (this.type === 'admin' && !userId) return
//        const res = this.datas || (userId && await getHeartRateAnalysisApi({userId: 4519647, dateStamp: 1491753939000}) || {})
        const res = this.datas || (userId && await getHeartRateAnalysisApi({userId, dateStamp: new Date().getTime()}) || {})
        this.data = res
        this.isData = res && JSON.stringify(res) !== '{}' ? 0 : 1
        const {exetimeLf, exetimeSup, exetimeCpm, exetimeWarmUp, heartRates, age} = res
        const max = [exetimeLf, exetimeSup, exetimeCpm, exetimeWarmUp].reduce((f, l) => f > l ? f : l)
        this.percent = {exetimeLf: {w: Math.round((exetimeLf/max)*100), v: exetimeLf}, exetimeSup: {w: Math.round((exetimeSup/max)*100), v: exetimeSup},
          exetimeCpm: {w: Math.round((exetimeCpm/max)*100), v: exetimeCpm}, exetimeWarmUp: {w: Math.round((exetimeWarmUp/max)*100), v: exetimeWarmUp}}

        this.type === 'admin' && this.$refs[`heartRate_${this.data.dateStamp}`] &&  s.loading(this.$refs[`heartRate_${this.data.dateStamp}`])

        const {graphType, chartType} = this
        const series = s.seriesDefSet(graphType, '心率', this.flet(heartRates), this.getCls(heartRates, age)) || defHeartRateData()

        if (!this.isData) {
          this.polar = {
            ...this.polar,
//          title: s.titleSet({graphType, timeRange, chartType}),
            legend: {show: false},
            tooltip: s.defSooltipSet({chartType}),
//            visualMap: s.visualMapSet(age),
            xAxis: s.xAxisMinutesSet(),
            yAxis: s.yAxisSet({graphType, chartType}),
            series
          }
        }
      },
    },
    async created () {
      const {graphType, chartType} = this
      this.polar = {...this.polar, xAxis: s.xAxisMinutesSet(), 'yAxis': s.yAxisSet({graphType, chartType}, 1),
        series: defHeartRateData(), legend: {show: false}, tooltip: {show: false}}
    },
    mounted () {
      this.datas && this.initChart()
      if (this.Def && !this.datas) {
//        this.initChart()
//        setInterval(() => {
//          this.$refs[`heartRate_${this.data.dateStamp}`].clear()
          this.initChart()
//        }, 300000)
      }
    },
    destroyed () {
    }
  }
</script>
