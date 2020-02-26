<style lang="less" scoped>
  @import "../../style.less";
</style>
<style lang="stylus" scoped>
  @import "temperature/index.styl";
</style>
<template>
  <div class="chart">
    <div class="title">{{title}}</div>
    <el-button-group class="otherRight">
      <el-button @click="setQuery(tab,'timeRange')" v-for="(tab,index) in dateRangeTabs" :key="index"
                 :class="{'active': tab.name === timeRange}">
        {{tab.label}}
      </el-button>
    </el-button-group>


    <div id="temperatureChart" class="temperature-chart">

    </div>


  </div>
</template>
<script>
  import actions from '../chart/temperature/temperature_actions'
  import globalActions from '../../actions'
  // mutations
  import {MUTATION_NAME} from '../../mutations'

  export default{
    data (){
      return {
        isData: 0,
        userId: '',
        timeType:1,
        xLabel: [],
        chartTitle: "暂无测量数据",
      }
    },
    computed: {
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
      tipName () {
        return {day: '时', week: '周', month: '天', year: '月'}[this.timeRange]
      },
      timeRange () {
        return this.$route.query.timeRange || ((this.chartType === 'temperature') ? 'day' : 'week')
      },
      graphType () {
        return this.$route.query.graphType || 'trend'
      },
      chartType () {
        return this.$route.query.chartType || 'temperature'
      },
      title () {
        const {graphType, timeRange, chartType} = this
        return this.getTitle({graphType, timeRange, chartType})
      },
      dateRangeTabs () {
          return [
            {label: '1天', name: 'day'},
            {label: '7天', name: 'week'},
            {label: '30天', name: 'month'},
          ]
      } ,
      tip () {
        return this.graphType === 'trend' ? '暂无测量数据' : '暂无异常数据'
      },
    },
    watch: {
      Def ({userId}) {
        const _this  = this
        if(userId) {
          _this.userId = userId
          _this.initChart(_this)
        }
      }
    },
    mounted(){
      const _this = this,
            {userId} = _this.Def
      if(userId) {
        _this.userId = userId
      }
      _this.initChart()
    },
    methods: {
        ...globalActions,
        ...actions,
    }
  }
</script>