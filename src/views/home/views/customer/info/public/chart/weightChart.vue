<style lang="less" scoped>
  @import "../../style.less";
</style>
<style lang="stylus" scoped>
  @import "weight/index.styl";
</style>
<template>
  <div class="chart">
    <div class="title">{{title}}</div>
    <el-button-group class="otherRight">
      <el-button @click="setQuery(tab,'timeRange')" v-for="tab in dateRangeTabs"
                 :class="{'active': tab.name === timeRange}">
        {{tab.label}}
      </el-button>
    </el-button-group>

    <div id="weightChart" class="weight-chart">

    </div>
  </div>
</template>
<script>
  import actions from '../chart/weight/weight_actions'
  import globalActions from '../../actions'
  // mutations
  import {MUTATION_NAME} from '../../mutations'

  export default{
    data (){
      return {
        userId: '',
        chartTitle: "暂无测量数据",
        title: "最近7次体重变化趋势",
        times: 7,
      }
    },
    computed: {
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
      tipName () {
        return {7: '7次', 14: '14次', 21: '21次'}[this.timeRange]
      },
      timeRange () {
        const _this = this
        _this.getTimeType(_this.$route.query.timeRange, _this)
        return _this.$route.query.timeRange || ((_this.chartType === 'weight') ? '7' : '14')
      },
      graphType () {
        return this.$route.query.graphType || 'trend'
      },
      chartType () {
        return this.$route.query.chartType || 'weight'
      },
      dateRangeTabs () {
        return [
          {label: '7次', name: '7'},
          {label: '14次', name: '14'},
          {label: '21次', name: '21'},
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