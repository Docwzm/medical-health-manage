<style lang="less" scoped>
  @import "../../../style.less";
</style>
<style lang="stylus" scoped>
  @import "index.styl";
</style>

<template>
  <div class="chart_sleep_statis">
    <!--loading-->
    <!--<div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>&lt;!&ndash;&ndash;&gt;</div></div>-->
    <!--图表显示层-->
    <div class="sleep_chart_layer chart">
      <!--标题-->
      <div class="title">{{title}}</div>
      <!--右侧按钮-->
      <el-button-group class="otherRight">
        <el-button @click="setChartQuery(tab,'timeRange')" v-for="(tab,index) in dateRangeTabs" :key="index" :class="{'active': tab.name === timeRange}">
          {{tab.label}}
        </el-button>
      </el-button-group>
      <!--图表-->
      <echarts :data-tip="tip" :options="charData" ref="bar" theme="ovilia-green" :class="{'noneData': isData}" auto-resize></echarts>
    </div>
    <!--时间轴-->
    <div class="sleep_chart_timeaxis" v-if="timeRange == 'day'">
      <span>{{statis.sleepDayBeginDate}}</span>
      <span>{{statis.sleepDayEndDate}}</span>
    </div>
    <!--其他统计层-->
    <div class="sleep_statis_layer" v-if="timeRange == 'day'">
      <div class="sleep_statis_item">
        <div>
          <img src="../../../../../../../../../static/chart/icon-health-data-sleep.svg">
        </div>
        <div>
          <span>睡眠时长</span>
          <span>
            <span class="num" v-if="statis.sleepH > 0">{{statis.sleepH}}</span>
            <span v-if="statis.sleepH > 0">小时</span>
            <span class="num">{{statis.sleepM}}</span>
            <span>分钟</span>
          </span>
        </div>
      </div><!--
      --><div class="sleep_statis_item ">
        <div>
          <img src="../../../../../../../../../static/chart/icon-health-data-morning-veins.svg">
        </div>
        <div>
          <span>晨脉</span>
          <span>
            <span class="num">{{statis.heartRate}}</span>
            <span>次/分</span>
          </span>
        </div>
      </div><!--
      --><div class="sleep_static_item_cate">
          <span>
            <span class="num" v-if="statis.deepSleepH > 0">{{statis.deepSleepH}}</span>
            <span v-if="statis.deepSleepH > 0">小时</span>
            <span class="num" v-if="!(statis.deepSleepH > 0 && statis.deepSleepM == '--')">{{statis.deepSleepM}}</span>
            <span v-if="!(statis.deepSleepH > 0 && statis.deepSleepM == '--')">分钟</span>
          </span>
          <span>
            <span class="sleep_static_item_cate_color"></span>
            <span>深睡</span>
            <span>{{statis.deepSleepPer}}</span>
          </span>
      </div><!--
      --><div class="sleep_static_item_cate">
          <span>
            <span class="num" v-if="statis.lightSleepH > 0">{{statis.lightSleepH}}</span>
            <span v-if="statis.lightSleepH > 0">小时</span>
            <span class="num" v-if="!(statis.lightSleepH > 0 && statis.lightSleepM == '--')">{{statis.lightSleepM}}</span>
            <span v-if="!(statis.lightSleepH > 0 && statis.lightSleepM == '--')">分钟</span>
          </span>
          <span>
            <span class="sleep_static_item_cate_color"></span>
            <span>浅睡</span>
            <span>{{statis.lightSleepPer}}</span>
          </span>
      </div><!--
      --><div class="sleep_static_item_cate">
          <span>
            <span class="num" v-if="statis.awakeH > 0">{{statis.awakeH}}</span>
            <span v-if="statis.awakeH > 0">小时</span>
            <span class="num" v-if="!(statis.awakeH > 0 && statis.awakeM == '--')">{{statis.awakeM}}</span>
            <span v-if="!(statis.awakeH > 0 && statis.awakeM == '--')">分钟</span>
          </span>
          <span>
            <span class="sleep_static_item_cate_color"></span>
            <span>清醒</span>
            <span>{{statis.awakePer}}</span>
          </span>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import echarts from '../../../../../../../../components/common/echarts/MyEcharts.vue'

  import actions from './actions'
  import computed from './computed'
  import {MUTATION_NAME} from '../../../mutations'

  export default {
    props:{},
    data() {
        return {
          loading: false,
          isData: true,
          charData: {
            tooltip : this.chartTooltip(),
            legend: this.chartLegendInit(),
            grid: this.chartGrid(),
            xAxis: this.chartXAxis(),
            yAxis: this.chartYAxis(),
            series:this.chartSeries()
          },
          statis: {
            sleepH: 0,
            sleepM: '--',
            heartRate:'--',
            deepSleepH:0,
            deepSleepM:'--',
            deepSleepPer:'--',
            lightSleepH:0,
            lightSleepM:'--',
            lightSleepPer:'--',
            awakeH:0,
            awakeM:'--',
            awakePer:'--',
            ymax: 12,
            sleepDayBeginDate:'',
            sleepDayEndDate:'',
          }
        }
    },
    components: {
      echarts,
    },
    computed: {
      ...computed,
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
    },
    watch: {
      Def ({userId}) {
        const _this = this
        if(userId) {
          _this.initChart()
        }
      },
      "loading": function (value) {
        const _this = this
        if(value) {
          _this.$refs.bar.showLoading({
            text: ' ',
            color: '#4ea397',
            maskColor: 'rgba(255, 255, 255, 0.4)'
          })
        } else {
          _this.$refs.bar.hideLoading()
        }
      }
    },
    methods: {
      ...actions,
    },
    created () {
      const _this = this
      _this.initChart()
    },
  }

</script>
