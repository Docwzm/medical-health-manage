<style lang="less" scoped>
  @import "../../style.less";
</style>

<template>
  <page>
    <div class="doctor">
      <my-tabs ref="tabActve" class="flex" @tab-click="tabLink" v-model="tabsActiveName">
        <my-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name"></my-tab-pane>
      </my-tabs>
      <div class="infoBox">
        <div class="left">
          <left type="doctor"></left>
        </div>

        <div class="right">
          <div class="listBox">
            <div @click="go('bp')">
              <span class="title"><span class="img" v-html="img.bp"></span> <span>血压</span></span>
              <span class="datas">
                <b v-show="Def.bloodpressureDto && Def.bloodpressureDto.sp && Def.bloodpressureDto.dp">{{Def.bloodpressureDto && Def.bloodpressureDto.sp}}/{{Def.bloodpressureDto && Def.bloodpressureDto.dp}}</b>
                <b v-show="!Def.bloodpressureDto">--</b> mmHg
              </span>
              <span class="time">{{Def.bloodpressureDto && dateTimeFilter2(Def.bloodpressureDto.measurementDate) || '-- --'}}</span>
              <!--<span>{{`共${counts.bpCount || 0}笔测量数据`}}</span>-->
            </div>
            <div @click="go('bs')">
              <span class="title"><span class="img" v-html="img.bs"></span> <span>血糖</span></span>
              <span class="datas">
                <span>{{Def.bloodsugarDto && bsTypeFilter(Def.bloodsugarDto.mealPeroid)}}</span>
                <b>{{Def.bloodsugarDto && Def.bloodsugarDto.bloodsugar}}</b>
                <b v-show="!Def.bloodsugarDto">--</b> mmol/L
              </span>
              <span class="time">{{Def.bloodsugarDto && dateTimeFilter2(Def.bloodsugarDto.measurementDate) || '-- --'}}</span>
              <!--<span>{{`共${counts.bsCount || 0}笔测量数据`}}</span>-->
            </div>
            <div @click="go('weight')">
              <span class="title"><span class="img" v-html="img.weight"></span> <span>体重</span></span>
              <span class="datas"><b>{{Def.weightDto && Def.weightDto.weight || '--'}}</b> kg</span>
              <span class="time">{{Def.weightDto && dateTimeFilter2(Def.weightDto.measurementDate) || '-- --'}}</span>
              <!--<span>{{`共${counts.weightCount || 0}笔测量数据`}}</span>-->
            </div>
            <div @click="go('heartRate')">
              <span class="title"><span class="img" v-html="img.heartRate"></span> <span>心率</span></span>
              <span class="datas"><b>{{Def.heartRateDto && Def.heartRateDto.heartRate || '--'}}</b> 次/分</span>
              <span class="time">{{Def.heartRateDto && dateTimeFilter2(Def.heartRateDto.measurementDate) || '-- --'}}</span>
              <!--<span>{{`共${counts.hrCount || 0}笔测量数据`}}</span>-->
              <span></span>
            </div>
            <div @click="go('steps')">
              <span class="title"><span class="img" v-html="img.steps"></span> <span>步数</span></span>
              <span class="datas"><b>{{Def.stepDto && Def.stepDto.step || '--'}}</b> 步</span>
              <span class="time">{{Def.stepDto && dateTimeFilter2(Def.stepDto.measurementDate) || '-- --'}}</span>
              <!--<span>{{`共${counts.stepCount || 0}笔测量数据`}}</span>-->
              <span></span>
            </div>

            <div @click="go('sleep')">
              <span class="title"><span class="img" v-html="img.sleep"></span> <span>睡眠</span></span>
              <span class="datas">
                <b v-show="Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep >= 60">
                  {{Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep >= 60 && Math.floor(Def.sleepDto.sleep / 60)}}</b>
                <span v-show="Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep >= 60">小时</span>
                <b v-show="Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep > 60">
                  {{Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep > 60 && (Def.sleepDto.sleep % 60)}}</b>
                <span v-show="Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep > 60">分钟</span>

                <b v-show="Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep < 60">
                  {{Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep < 60 && Def.sleepDto.sleep}}</b>
                <span v-show="Def.sleepDto && Def.sleepDto.sleep && Def.sleepDto.sleep < 60">分钟</span>

                <b v-show="(Def.sleepDto && Def.sleepDto.sleep === 0) || !Def.sleepDto || (Def.sleepDto && !Def.sleepDto.sleep)">-- </b>
                <span v-show="(Def.sleepDto && Def.sleepDto.sleep === 0) || !Def.sleepDto || (Def.sleepDto && !Def.sleepDto.sleep)">小时</span>
              </span>
              <span class="time">{{Def.sleepDto && dateTimeFilter2(Def.sleepDto.measurementDate) || '-- --'}}</span>
              <!--<span>{{`共${counts.sleepCount || 0}笔测量数据`}}</span>-->
            </div>
            <div @click="go('temperature')">
              <span class="title"><span class="img" v-html="img.temperature"></span> <span>体温</span></span>
              <span class="datas"><b>{{Def.temperatureDto && Def.temperatureDto.degree || '--'}}</b> &#176;C</span>
              <span class="time">{{Def.temperatureDto && dateTimeFilter2(Def.temperatureDto.measurementDate) || '-- --'}}</span>
              <!--<span>{{`共${counts.temperatureCount || 0}笔测量数据`}}</span>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </page>
</template>

<script>
  // components
  import page from '../../../../../../../components/common/page/Page'
  import MyTabs from '../../../../../../../components/common/tabs/MyTabs'
  import MyTabPane from '../../../../../../../components/common/tabs/MyTabPane'

  import left from '../../public/left'

  // filters
  import {
    dateTimeFilter2, bsTypeFilter,
  } from '../../../../../../../filters'
  // actionss
  import actions from '../../actions'
  // getters
  import router from '../../../../../../../router'
  import {paramsGetter, queryGetter} from '../../../../../../../store/getters/route'
  // API
  import {getPatientCounts} from '../../../../../../../api/patient'
  // mutations
  import {MUTATION_NAME} from '../../mutations'

  export default{
    data () {
      return {
        tabs: [
          {label: '健康数据', name: 'patient_doctor_info'},
          {label: '对话', name: 'customer_chat'},
        ],
        counts: {},
        img: {
          bp: require('!!raw!../../../../../../../../static/chart/icon-health-data-list-blood-pressure.svg'),
          bs: require('!!raw!../../../../../../../../static/chart/icon-health-data-list-blood-sugar.svg'),
          steps: require('!!raw!../../../../../../../../static/chart/icon-health-data-list-steps.svg'),
          weight: require('!!raw!../../../../../../../../static/chart/icon-health-data-list-weight.svg'),
          heartRate: require('!!raw!../../../../../../../../static/chart/icon-health-data-list-heart-rate.svg'),
          temperature: require('!!raw!../../../../../../../../static/chart/icon-health-data-list-temperature.svg'),
          sleep: require('!!raw!../../../../../../../../static/chart/icon-health-data-list--sleep.svg'),
        }
      }
    },
    components: {
      page,
      MyTabs,
      MyTabPane,
      left,
    },
    computed: {
      tabsActiveName: {
        get () {
          return this.$route.name
        },
        set (name) {
          this.$router.replace({name})
        }
      },
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      }
    },
    watch: {
    },
    methods: {
      dateTimeFilter2, bsTypeFilter,
      ...actions,
      go (type) {
        const {id} = paramsGetter(this.$store.state)
        router.push({name: 'patient_doctor_chart', params: {id}, query: {chartType: type}})
      },
      async getCount () {
        const {id} = paramsGetter(this.$store.state)
        this.counts = await getPatientCounts({id}) || {}
      }
    },
    created () {
    },
    mounted () {
      this.getCount()
    },
    destroyed () {
    }
  }
</script>
