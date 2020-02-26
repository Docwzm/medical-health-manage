<style lang="stylus" scoped>
  @import "./index.styl";
</style>
<template>
  <div class="pdf-download-layout">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
    <h2 class="title"><span class="left">健康数据报告</span><span class="right">{{date}}</span></h2>
    <div class="user-infos" :class="{'user-infos-female': userInfos.sex == '2','user-infos-male': userInfos.sex == '1' }">
        <span v-html="svg.female" class="img female-img"></span>
        <span v-html="svg.male" class="img male-img"></span>
        <p class="item"><span>姓名:</span>{{userInfos.name}}</p>
        <p class="item"><span>性别:</span>{{userInfos.sex | sexFilter}}</p>
        <p class="item"><span>年龄:</span>{{userInfos.age}}岁</p>
        <p class="item"><span>身高:</span><span v-if="userInfos.infoDto">{{userInfos.infoDto.height || '--'}}<span v-if="userInfos.infoDto.height">cm</span></span><span v-if="!userInfos.infoDto">--</span></p>
        <p class="item"><span>疾病类型:</span>{{userInfos.sickType | sickTypeFilter}}</p>
        <p class="item"><span>区域:</span>{{address}}</p>
    </div>
    <div class="mod" v-show="showBp">
      <h2 class="title2">血压数据（最近30天）</h2>
      <h3>最近30天血压变化趋势</h3>
      <div id="bpChart" class="chart-con"></div>

      <div class="pdf-tab">
        <my-table
                :data="bpTabList"
                stripe
                empty-text="暂无测量数据"
                :row-style="markAbnormalRows"
        >
          <my-table-column
                  inline-template
                  label="测量时间"
                  width="200"
          >
            <div class="fon">{{dateTimeFilter(row.measurementDate, 'YYYY-MM-DD HH:mm')}}</div>
          </my-table-column>
          <my-table-column
                  inline-template
                  label="测量结果"
                  width="230"
          >
            <div class="fon">
              <span v-show="row.systolicPressure">{{row.systolicPressure}}</span>
              <span v-show="row.diastolicPressure">/{{row.diastolicPressure}}<span class="cTips"
                                                                                   style="margin-right: 10px;">&nbsp;mmHg</span></span>
              <span v-show="row.heartRate">{{row.heartRate}}<span class="cTips">&nbsp;次/分</span></span>
              <span v-show="!row.systolicPressure && !row.diastolicPressure && !row.heartRate">未测量</span>
            </div>
          </my-table-column>
          <my-table-column
                  inline-template
                  label="数据来源"
                  width="120"
          >
            <div class="fon">{{dataSource(row.source)}}</div>
          </my-table-column>
          <my-table-column
                  inline-template
                  label="备注"
          >
            <div class="fon">{{row.remark}}</div>
          </my-table-column>
        </my-table>
      </div>
    </div>

    <div class="mod" v-show="showBs">
      <h2 class="title2 title3">血糖数据（最近30天）</h2>
      <div class="pdf-tab">
        <my-table :data="bsTabList"
                  stripe
                  empty-text="暂无测量数据"
                  width="100%"
        >
          <my-table-column min-width="210px" label="测量时间" inline-template>
            <div class="fon">{{row.date}}</div>
          </my-table-column>
          <my-table-column min-width="100px" label="空腹" inline-template>
            <div :class="liClass(row.fasting)">
              <div v-show="row.fasting">{{row.fasting && row.fasting.glucoseConcentration}}</div>
              <div v-show="!row.fasting">--</div>
            </div>
          </my-table-column>
          <my-table-column min-width="100px" label="早餐后" :show-overflow-tooltip="true" inline-template>
            <div :class="liClass(row.afBreakfast)">
              <div v-show="row.afBreakfast">{{row.afBreakfast && row.afBreakfast.glucoseConcentration}}</div>
              <div v-show="!row.afBreakfast">--</div>
            </div>
          </my-table-column>
          <my-table-column min-width="100px" label="午餐前" inline-template>
            <div :class="liClass(row.beLunch)">
              <div v-show="row.beLunch">{{row.beLunch && row.beLunch.glucoseConcentration}}</div>
              <div v-show="!row.beLunch">--</div>
            </div>
          </my-table-column>
          <my-table-column min-width="100px" label="午餐后" inline-template>
            <div :class="liClass(row.afLunch)">
              <div v-show="row.afLunch">{{row.afLunch && row.afLunch.glucoseConcentration}}</div>
              <div v-show="!row.afLunch">--</div>
            </div>
          </my-table-column>
          <my-table-column min-width="100px" label="晚餐前" inline-template>
            <div :class="liClass(row.beDinner)">
              <div v-show="row.beDinner">{{row.beDinner && row.beDinner.glucoseConcentration}}</div>
              <div v-show="!row.beDinner">--</div>
            </div>
          </my-table-column>
          <my-table-column min-width="100px"  label="晚餐后" inline-template>
            <div :class="liClass(row.afDinner)">
              <div v-show="row.afDinner">{{row.afDinner && row.afDinner.glucoseConcentration}}</div>
              <div v-show="!row.afDinner">--</div>
            </div>
          </my-table-column>
          <my-table-column min-width="100px" label="睡前" inline-template>
            <div :class="liClass(row.beSleep)">
              <div v-show="row.beSleep">{{row.beSleep && row.beSleep.glucoseConcentration}}</div>
              <div v-show="!row.beSleep">--</div>
            </div>
          </my-table-column>
        </my-table>
      </div>
    </div>

    <div class="mod mod2" v-show="showWeight">
      <h2 class="title2 title4">体重数据（最近30天）</h2>
      <h3>最近30次体重变化趋势</h3>
      <div id="weightChart" class="chart-con"></div>

      <div class="pdf-tab pdf-tab2">
        <my-table
                :data="weigthTabList"
                stripe
                empty-text="暂无测量数据"
        >
          <my-table-column
                  inline-template
                  label="测量时间"
                  width="200"
          >
            <div class="fon">{{dateTimeFilter(row.measurementDate, 'YYYY-MM-DD HH:mm')}}</div>
          </my-table-column>
          <my-table-column
                  inline-template
                  label="体重"
                  width="230"
          >
            <div class="fon">
                {{row.weight}}kg
            </div>
          </my-table-column>
          <my-table-column
                  inline-template
                  label="BMI"
          >
            <div class="fon">{{row.bmi | weightToFixed}} {{row.bmi | bmiFilter}}</div>
          </my-table-column>
          <my-table-column
                  inline-template
                  label="数据来源"
          >
            <div class="fon">
              <div v-if="row.deviceId && row.deviceId != 'useradd'">设备采集</div>
              <div v-if="!row.deviceId || row.deviceId == 'useradd'">手工添加</div>
            </div>
          </my-table-column>
        </my-table>
      </div>
    </div>
  </div>
</template>
<script>
  import MyTable from '../../components/common/table/MyTable'
  import MyTableColumn from '../../components/common/table/MyTableColumn'
  import actions from './actions'
  import {
    sexFilter,
    sickTypeFilter,
    dateTimeFilter,
    dataSource,
    dateFilter,
    bmiFilter,
    weightToFixed,
  } from '../../filters/index'
  export default{
    data() {
      return {
        pdfType: '',
        userId: '',
        userInfos: {},
        area: {},
        bpList: [],
        bpTabList: [],
        bsList: [],
        bsTabList: [],
        weightList: [],
        weigthTabList: [],
        chartTitle: '暂无测量数据',
        isDone:0,
        showBp: true,
        showBs: true,
        showWeight: true,
        date: '',
        address: '--',
        loading: true,
        pageSize: 60,
        dataNum: 5,
        svg: {
          female: require('!raw-loader!!../../../static/pdf/img_female.svg'),
          male: require('!raw-loader!!../../../static/pdf/img_male.svg'),
        }
      }
    },
    mounted () {
      this.init()
    },
    components: {
      MyTable,
      MyTableColumn,
    },
    methods: {
      ...actions,
      dateTimeFilter,
      dataSource,
      dateFilter,
      liClass (v) {
        return {
          'fon': true,
          'tip': v && v.memo,
          'highColor': v && v.level > 2,
          'lowColor': v && v.level < 2,
          'normalColor': v && v.level === 2
        }
      },
      setName (key) {
        return {
          0: 'fasting',
          1: 'afBreakfast',
          2: 'beLunch',
          3: 'afLunch',
          4: 'beDinner',
          5: 'afDinner',
          6: 'beSleep'
        }[key]
      },
      fles (dada, time) { // 按年月日分类，去重 排序
        const newArr = [] // 结果
        const soArr = new Array(...new Set(dada.map(d => dateFilter(d[time])))).map((n) => (new Date(n)).getTime()) // 转换成年份去重 毫秒数排序
        soArr.sort((a, b) => b - a).filter(t => {
          const list = dada.filter(da => dateFilter(t) === dateFilter(da[time]))
          let obs = {}
          list.forEach(item => {
            obs[`${this.setName(item.mealPeroid)}`] = item
          })
          return newArr.push({...{'date': dateFilter(t), ...obs}})
        })
        return newArr
      },
    },
    filters: {
      sexFilter,
      sickTypeFilter,
      bmiFilter,
      weightToFixed,
    },
    watch: {
      'isDone' (val) {
        console.log(val)
        const _this = this
        if(val == _this.dataNum) {
          _this.loading = false
        setTimeout(function(){
          window.scrollTo(0,0)
          _this.download()
        },1000)
        }
      },
      'userInfos' ({infoDto}) {
        if(infoDto) {
          this.addressFilter(this, infoDto)
        }
      }
    }
  }
</script>