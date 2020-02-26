<style lang="less" scoped>
  @import "../style.less";
</style>

<template>
  <page>
    <div class="admin">
      <div class="infoBox">
        <div class="left">
          <left type="admin"></left>
        </div>

        <div class="right">
          <h2 class="right-title">健康数据</h2>
          <div class="tabsBox">
            <div class="back" @click="go">返回列表</div>
            <el-button-group class="tabs">
              <el-button @click="setQuery(tab.name,'chartType')" v-for="(tab,index) in chartTabs" :key="index"
                         :class="{'active': tab.name === chartType}">
                {{tab.label}}
              </el-button>
            </el-button-group>
          </div>

          <!-- 图表 -->
          <bpChart v-if="!!(chartType === 'bp')"></bpChart>
          <bsChart v-if="!!(chartType === 'bs')"></bsChart>
          <heartRateChart v-if="!!(chartType === 'heartRate')"></heartRateChart>
          <temperatureChart v-if="!!(chartType === 'temperature')"></temperatureChart>
          <weightChart v-if="!!(chartType === 'weight')"></weightChart>
          <sleepChart v-if="!!(chartType === 'sleep')"></sleepChart>
          <stepsChart v-if="!!(chartType === 'steps')"></stepsChart>

          <!-- 列表 -->
          <bpList v-if="chartType === 'bp'" type="admin"></bpList>
          <bsList v-if="chartType === 'bs'" type="admin"></bsList>
          <heartRateList v-if="chartType === 'heartRate'" type="admin"></heartRateList>
          <temperatureList v-if="chartType === 'temperature'"></temperatureList>
          <weightList v-if="chartType === 'weight'"></weightList>
          <sleepList v-if="chartType === 'sleep'"></sleepList>
          <stepsList v-if="chartType === 'steps'"></stepsList>
        </div>
      </div>
    </div>
  </page>
</template>

<script>
  // components
  import page from '../../../../../../components/common/page/Page'

  import bpChart from '../public/chart/bpChart'
  import bsChart from '../public/chart/bsChart'
  import heartRateChart from '../public/chart/heartRateChart'
  import temperatureChart from '../public/chart/temperatureChart'
  import weightChart from '../public/chart/weightChart'
  import sleepChart from '../public/chart/sleep/index'
  import stepsChart from '../public/chart/steps/index'
  import left from '../public/left'
  import bpList from '../public/list/bpList'
  import bsList from '../public/list/bsList'
  import heartRateList from '../public/list/heartRateList'
  import temperatureList from '../public/list/temperatureList'
  import weightList from '../public/list/weightList'
  import sleepList from '../public/list/sleep/index'
  import stepsList from '../public/list/steps/index'

  // actionss
//  import actions from '../actions'

  export default{
    data () {
      return {
        Def: {},
        chartTabs: [
          {label: '血压', name: 'bp'},
          {label: '体重', name: 'weight'},
          {label: '心率', name: 'heartRate'},
          {label: '步数', name: 'steps'},
          {label: '血糖', name: 'bs'},
          {label: '睡眠', name: 'sleep'},
          {label: '体温', name: 'temperature'},
        ],
      }
    },
    components: {
      page,
      bpList,
      bsList,
      heartRateList,
      temperatureList,
      weightList,
      sleepList,
      stepsList,
      left,
      bpChart,
      bsChart,
      heartRateChart,
      temperatureChart,
      weightChart,
      sleepChart,
      stepsChart,
    },
    computed: {
      chartType () {
        return this.$route.query.chartType || 'bp'
      },
    },
    methods: {
//      ...actions,
      setQuery(name, queryName){
        this.$router.replace({query: {}})
        this.$router.replace({query: {...this.$route.query, [queryName]: name}})
      },
      go () {
        this.$router.push({name: 'patient_admin_info'})
      }
    },
    created () {
    },
    mounted () {
    },
    destroyed () {
    }
  }
</script>
