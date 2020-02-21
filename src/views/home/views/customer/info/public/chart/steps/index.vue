<style lang="less" scoped>
  @import "../../../style.less";
</style>
<style lang="stylus" scoped>
  @import "index.styl";
</style>

<template>
  <div class="chart_steps_statis">
    <!--loading-->
    <!--<div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>&lt;!&ndash;&ndash;&gt;</div></div>-->
    <!--图表显示层-->
    <div class="steps_chart_layer chart">
      <!--标题-->
      <div class="title">{{title}}</div>
      <!--右侧按钮-->
      <el-button-group class="otherRight">
        <el-button @click="setChartQuery(tab,'timeRange')" v-for="tab in dateRangeTabs" :class="{'active': tab.name === timeRange}">
          {{tab.label}}
        </el-button>
      </el-button-group>
      <!--图表-->
      <echarts :data-tip="tip" :options="charData" ref="bar" theme="ovilia-green" :class="{'noneData': isData}" auto-resize></echarts>
    </div>
    <!--其他统计层-->
    <div class="steps_statis_layer">
      <div class="steps_statis_item">
        <div>
          <img src="../../../../../../../../../static/chart/icon-health-data-steps.svg">
        </div>
        <div>
            <span>{{ unitName }}总步数</span>
            <span>
              <span>{{ statis.steps }}</span>
              <span>步</span>
            </span>
        </div>
      </div><!--
      --><div class="steps_statis_item">
        <div>
          <img src="../../../../../../../../../static/chart/icon-health-data-distance.svg">
        </div>
        <div>
          <span>{{ unitName }}总距离</span>
          <span>
            <span>{{ statis.dist }}</span>
            <span>公里</span>
          </span>
        </div>
      </div><!--
      --><div class="steps_statis_item">
        <div>
          <img src="../../../../../../../../../static/chart/icon-health-data-calories.svg">
        </div>
        <div>
          <span>{{ unitName }}总消耗</span>
          <span>
            <span>{{ statis.consume }}</span>
            <span>大卡</span>
          </span>
        </div>
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
    props:{

    },
    data() {
        return {
          loading: false,
          isData: true,
          charData: {
            color: ['#50B2FD'],
            tooltip : this.chartTooltip(),
            grid: this.chartGrid(),
            xAxis: this.chartXAxis(),
            yAxis: this.chartYAxis(),
            series:this.chartSeries()
          },
          statis:{
            steps: '--',
            dist : '--',
            consume : '--',
            ymax : 8
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
      const _this = this,
          {userId} = _this.Def
      if(userId) {
        _this.initChart()
      }
    },
  }

</script>
