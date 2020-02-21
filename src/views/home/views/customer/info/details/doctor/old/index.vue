<style lang="less" scoped>
  @import "./style.less";
</style>

<template>
  <page :loading="!Def.info">
    <div class="doctor">
      <my-tabs ref="tabActve" class="flex" @tab-click="tabLink" v-model="tabsActiveName">
        <my-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name"></my-tab-pane>
      </my-tabs>
      <div class="infoBox">
        <div class="left">
          <div class="info">
            <div class="myTitle" style="padding-right: 0">
              <span>用户资料</span>
              <my-dropdown class="right" label="更多" butype="text"
                           :menu="[{key: 'warn', name: '设置预警'}, {key: 'info', name: '查看详情'}]"
                           :value="0" @check="rightGo"></my-dropdown>
            </div>
            <div class="isBox">
          <span class="imgBar">
            <img class="head" v-if="info.headImgurl"
                 :src="info.headImgurl || '../../../static/icon_user_no_man.png'">
            <!--<img v-if="info.qrcode" :src="info.qrcode.qrcodeUrl">-->
          </span>
              <div><label>姓名：</label><span>{{info.name || '无'}}</span></div>
              <div><label>性别：</label><span>{{sexFilter(info.sex) || '无'}}</span></div>
              <div><label>年龄：</label><span>{{(info.age || info.age === 0) && `${info.age}岁` || '无'}}</span></div>
              <!--<div><label>关联医生：</label><span>{{info.doctorNames || '无'}}</span></div>-->
              <div><label>地区：</label><span>{{info.prs || info.address || '无'}}</span></div>
              <div><label>疾病类型：</label><span>{{info.sickType && sickTypeFilter(info.sickType) || '无'}}</span></div>
              <span class="tip"></span>
              <div>心血管病危险因素：</div>
              <div class="bar">
                <span><label>吸烟：</label><span>{{info.cardiovascularRiskFactors && isSickFilter(info.cardiovascularRiskFactors.isSmoking) || '无'}}</span></span>
                <span><label>血脂异常：</label><span>{{info.cardiovascularRiskFactors && isSickFilter(info.cardiovascularRiskFactors.dyslipidemia) || '无'}}</span></span>
              </div>
              <div class="bar">
                <span><label>肥胖：</label><span>{{info.cardiovascularRiskFactors && isSickFilter(info.cardiovascularRiskFactors.isFat) || '无'}}</span></span>
                <span><label>缺乏运动：</label><span>{{info.cardiovascularRiskFactors && isSickFilter(info.cardiovascularRiskFactors.lackOfPhysical) || '无'}}</span></span>
              </div>
              <div>
                <label>C反应异常：</label><span>{{info.cardiovascularRiskFactors && isSickFilter(info.cardiovascularRiskFactors.reactiveProteinC) || '无'}}</span>
              </div>
            </div>
          </div>

          <div class="devices">
            <div class="infoTitle">设备</div>
            <div class="li" v-if="device.length">
              <ms-popover v-for="(d, i) in device" :device="d" :value="i"></ms-popover>
            </div>
            <div v-if="!device.length" class="dviIno">暂无设备</div>
          </div>

          <div :class="{'notes': true, 'in': isNotesEdit}">
            <div class="infoTitle">
              <span>备注</span>
              <span class="right" @click="notesEdit">
              <div v-show="isNotesEdit" class="text">保存</div>
              <div v-show="!isNotesEdit" v-html="img.remarks" style="margin-top: 6px;"></div>
            </span>
            </div>
            <div class="leftNotes" v-if="isNotesEdit">
              <my-input class="infoLeft" type="textarea" :value="info.remark"
                        placeholder="请输入内容" :maxlength="100" @input="changeValue('remark', $event)"></my-input>
              <div class="length">{{`${info.remark && info.remark.length || '0'}/100`}}</div>
            </div>
            <div class="leftNotes" v-if="!isNotesEdit">
              <div class="text" v-show="info.remark">{{info.remark}}</div>
              <div class="dviIno" v-show="!info.remark">暂无备注</div>
            </div>
          </div>
        </div>

        <div class="right">
          <!-- 图表 -->
          <div class="chart">

            <div class="graph-toggles">
              <el-popover ref="popover2" placement="bottom" width="400" trigger="click">
                <div class="bp-desc-box">
                  <p>血压是指血管内的血液在单位面积上的侧压力，即压强，习惯以毫米汞柱 (mmHg) 为单位。</p>
                  <p>心脏有收缩及放松期，当心脏收缩，左心室便会将血液泵出到主动脉，主动脉压产生最高血压，又称收缩压。</p>
                  <p>接下来，心脏会舒张，血液流入右心房，这个时候压力最低，称为低血压或舒张压。</p>
                  <div class="table">
                    <table>
                      <tr>
                        <th>
                          <div class="cc"><span>血压(mmHg)</span> <span>等级</span></div>
                        </th>
                        <th>收缩压(SYS)</th>
                        <th>舒张压(DIA)</th>
                      </tr>
                      <tr>
                        <td>低血压</td>
                        <td><90</td>
                        <td><60</td>
                      </tr>
                      <tr>
                        <td>正常血压</td>
                        <td>90~119</td>
                        <td>60~79</td>
                      </tr>
                      <tr>
                        <td>正常高值</td>
                        <td>120~139</td>
                        <td>80~89</td>
                      </tr>
                      <tr>
                        <td>轻度高血压</td>
                        <td>140~159</td>
                        <td>90~99</td>
                      </tr>
                      <tr>
                        <td>中度血压</td>
                        <td>160~179</td>
                        <td>100~109</td>
                      </tr>
                      <tr>
                        <td>高度血压</td>
                        <td>180</td>
                        <td>110</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </el-popover>
              <div class="des"><span v-html="img.des"></span>
                <el-button type="text" v-popover:popover2>血压说明</el-button>
              </div>
              <my-dropdown class="right" :label="graphTypeName" butype="text"
                           :menu="[{key: 'trend', name: '血压趋势变化图'}, {key: 'errCount', name: '血压异常分布图'}]"
                           :value="0" async="graphType"></my-dropdown>
              <el-button-group class="otherRight">
                <el-button @click="setQuery(tab,'timeRange')" v-for="tab in dateRangeTabs"
                           :class="{'active': tab.name === timeRange}">
                  {{tab.label}}
                </el-button>
              </el-button-group>
            </div>

            <echarts :data-tip="tip" :options="polar" ref="bar" theme="ovilia-green" :class="{'noneData': isData}"
                     auto-resize></echarts>

          </div>

          <!-- 血压最值 -->
          <div class="bpInfo">
            <div class="title">血压历史最高与最低值</div>
            <my-row>
              <my-col :span="12" class="biLi">
                <my-row type="flex" justify="center">
                  <my-col :span="4" class="ti">
                    <div v-html="img.ssy" class="svg"></div>
                    <span>收缩压</span>
                  </my-col>
                  <my-col :span="20" class="ti">
                <span>
                  最高 <b>{{most.maxSystolic.systolicPressure}}</b>/{{most.maxSystolic.diastolicPressure}} mmHg <span
                        style="margin-left: 10px;">{{most.maxSystolic.heartRate || '--'}} 次/分</span>
                  <div class="tip">{{most.maxSystolic.measurementDate && dateTimeFilter(most.maxSystolic.measurementDate) || '--'}}</div>
                </span>
                    <span>
                  最低 <b>{{most.minSystolic.systolicPressure}}</b>/{{most.minSystolic.diastolicPressure}} mmHg <span
                            style="margin-left: 10px;">{{most.minSystolic.heartRate || '--'}} 次/分</span>
                  <div class="tip">{{most.minSystolic.measurementDate && dateTimeFilter(most.minSystolic.measurementDate) || '--'}}</div>
                </span>
                  </my-col>
                </my-row>
              </my-col>
              <my-col :span="12" class="biLi">
                <my-row type="flex" justify="center">
                  <my-col :span="4" class="ti">
                    <div v-html="img.szy" class="svg"></div>
                    <span>舒张压</span>
                  </my-col>
                  <my-col :span="20" class="ti">
                <span>
                  最高 {{most.maxDiastolic.systolicPressure}}/<b>{{most.maxDiastolic.diastolicPressure}}</b> mmHg <span
                        style="margin-left: 10px;">{{most.maxDiastolic.heartRate || '--'}} 次/分</span>
                  <div class="tip">{{most.maxDiastolic.measurementDate && dateTimeFilter(most.maxDiastolic.measurementDate) || '--'}}</div>
                </span>
                    <span>
                  最低 {{most.minDiastolic.systolicPressure}}/<b>{{most.minDiastolic.diastolicPressure}}</b> mmHg <span
                            style="margin-left: 10px;">{{most.minDiastolic.heartRate || '--'}} 次/分</span>
                  <div class="tip">{{most.minDiastolic.measurementDate && dateTimeFilter(most.minDiastolic.measurementDate) || '--'}}</div>
                </span>
                  </my-col>
                </my-row>
              </my-col>
            </my-row>
          </div>

          <!-- 测量数据 搜索 添加 -->
          <div class="measureServer">
            <el-date-picker type="daterange" v-model="search.mDateRange" placeholder="请选择时间区间"
                            style="width:242px;"></el-date-picker>
            <my-select style="width:242px;" class="source-select" v-model="search.source" placeholder="请选择数据来源">
              <my-option label="设备采集" :value="0"></my-option>
              <my-option label="手工添加" :value="1"></my-option>
              <my-option label="全部" :value="-1"></my-option>
            </my-select>
            <span class="se" v-html="img.holder" @click="serach"></span>
            <my-button style="width: 100px" type="primary" @click.native="bpFrom = !bpFrom">添加数据</my-button>
          </div>

          <!-- 测量数据列表 -->
          <div class="measureList" style="margin-top: 0;">
            <my-table :data="meLi" :row-style="markAbnormalRows" stripe>
              <my-table-column width="156px" label="测量时间" inline-template>
                <div class="fon">{{dateTimeFilter(row.measurementDate, 'YYYY-MM-DD HH:mm')}}</div>
              </my-table-column>
              <my-table-column width="226px" label="测量结果" inline-template>
                <div class="fon">
                  <span v-show="row.systolicPressure">{{row.systolicPressure}}</span>
                  <span v-show="row.diastolicPressure">/{{row.diastolicPressure}}<span class="cTips"
                                                                                       style="margin-right: 10px;">&nbsp;mmHg</span></span>
                  <span v-show="row.heartRate">{{row.heartRate}}<span class="cTips">&nbsp;次/分</span></span>
                  <span v-show="!row.systolicPressure && !row.diastolicPressure && !row.heartRate">未测量</span>
                </div>
              </my-table-column>
              <my-table-column width="96px" label="数据来源" inline-template>
                <div class="fon">{{dataSource(row.source)}}</div>
              </my-table-column>
              <my-table-column width="132px" label="备注" inline-template>
                <div class="fon">{{row.remark}}</div>
              </my-table-column>
              <my-table-column width="110px" label="操作" inline-template>
                <div class="fon">
                  <remarks :item="row" :patientId="Def.userId" @input="set"></remarks>
                </div>
              </my-table-column>
            </my-table>
            <div>
              <my-pagination style="text-align: right" @current-change="serach" :current-page="pagination.pageIndex"
                             layout="prev, pager, next, jumper"
                             :pageSize="pagination.pageSize" :total="pagination.totalRecord">
              </my-pagination>
            </div>
          </div>

          <!-- 设置自定义预警值 -->
          <my-dialog ref="warr" class="my_dialog win520" v-model="warrFrom" title="自定义预警值">
            <my-form style="" ref="warrFrom" :model="warr" :rules="warrFromRules"
                     label-position="left" label-width="80px">
              <div class="aks">
                <span @click="backWarr">恢复默认值</span>
                <span @click="switchWarr">{{warnSwitch?'关闭':'开启'}}预警</span>
              </div>
              <my-row>
                <my-col :span="8" :offset="4">
                  <my-item label="血压高压:" prop="bpHL" style="width: 160px; margin: 0">
                    <el-input style="width: 80px" class="my-input" v-model="warr.bpHL" :maxlength="3">
                    </el-input>
                  </my-item>
                </my-col>
                <my-col :span="10">
                  <span style="display: inline-block; vertical-align: top;margin: 0 10px;line-height: 36px;">至:</span>
                  <my-item prop="bpHH" style="width: 80px; margin: 0;display: inline-block; vertical-align: middle;">
                    <el-input style="width: 80px" class="my-input" v-model="warr.bpHH" :maxlength="3">
                    </el-input>
                  </my-item>
                  <span style="display: inline-block; vertical-align: top;line-height: 36px;">mmHg</span>
                </my-col>
              </my-row>
              <my-row>
                <my-col :span="8" :offset="4">
                  <my-item label="血压低压:" prop="bpLL" style="width: 160px; margin: 0">
                    <el-input style="width: 80px" class="my-input" v-model="warr.bpLL" :maxlength="3">
                    </el-input>
                  </my-item>
                </my-col>
                <my-col :span="10">
                  <span style="display: inline-block; vertical-align: top;margin: 0 10px;line-height: 36px;">至:</span>
                  <my-item prop="bpLH" style="width: 80px; margin: 0;display: inline-block; vertical-align: middle;">
                    <el-input style="width: 80px" class="my-input" v-model="warr.bpLH" :maxlength="3">
                    </el-input>
                  </my-item>
                  <span style="display: inline-block; vertical-align: top;line-height: 36px;">mmHg</span>
                </my-col>
              </my-row>
              <div class="dialog-footer">
                <my-button style="width: 100px" @click.native="cancel('warrFrom')">取 消</my-button>
                <my-button style="width: 100px" type="primary" @click.native="submitForm('warrFrom')">保 存</my-button>
              </div>
            </my-form>
          </my-dialog>

          <!-- 添加数据弹窗 -->
          <my-dialog ref="dialog" class="my_dialog win622" v-model="bpFrom" title="添加血压数据">
            <my-form style="padding: 0 40px" :model="formFields" :rules="bpFromRules" ref="bpFrom"
                     label-position="left" label-width="80px">
              <my-item label="测量时间:" prop="measurementDate">
                <my-date-picker style="width: 160px" type="datetime" v-model="formFields.measurementDate"
                                :picker-options="datePickerOptions" slot="input"></my-date-picker>
              </my-item>
              <my-row>
                <my-col :span="10">
                  <my-item label="收缩压:" prop="systolicPressure">
                    <el-input style="width: 160px" class="my-input" v-model="formFields.systolicPressure" :maxlength="3">
                      <template slot="append">mmhg</template>
                    </el-input>
                  </my-item>
                </my-col>
                <my-col :span="10" :offset="3">
                  <my-item label="舒张压:" prop="diastolicPressure">
                    <el-input style="width: 160px" class="my-input" v-model="formFields.diastolicPressure" :maxlength="3">
                      <template slot="append">mmhg</template>
                    </el-input>
                  </my-item>
                </my-col>
              </my-row>
              <my-item label="脉搏:" prop="heartRate">
                <el-input class="my-input" style="width: 160px" v-model="formFields.heartRate" :maxlength="3">
                  <template slot="append">次/分</template>
                </el-input>
              </my-item>
              <my-item label="备注:" prop="remark">
                <my-input v-model="formFields.remark" style="width:440px ;display: inline-block"
                          :maxlength="20"></my-input>
              </my-item>
            </my-form>
            <div class="dialog-footer">
              <el-button style="width: 100px" @click="cancel('bpFrom')">取消</el-button>
              <el-button style="width: 100px" type="primary" @click="submitForm('bpFrom')">保存</el-button>
            </div>
          </my-dialog>

        </div>
      </div>
    </div>
  </page>
</template>

<script>
  // components
  import page from '../../../../../../../../components/common/page/Page'
  import MsPopover from '../../../../../../../../components/common/popover/msPopover.vue'
  import MyTable from '../../../../../../../../components/common/table/MyTable'
  import MyTableColumn from '../../../../../../../../components/common/table/MyTableColumn'
  import MyPagination from '../../../../../../../../components/common/pagination/MyPagination'
  import {MyRow, MyCol} from '../../../../../../../../components/common/layout'
  import MyDropdown from '../../../../../../../../components/common/dropdown/MyDropdown.vue'
  import echarts from '../../../../../../../../components/common/echarts/MyEcharts.vue'
  import MyTabs from '../../../../../../../../components/common/tabs/MyTabs'
  import MyTabPane from '../../../../../../../../components/common/tabs/MyTabPane'
  import MyInput from '../../../../../../../../components/common/input/MyInput'
  import MyButton from '../../../../../../../../components/common/button/MyButton'
  import MyForm from '../../../../../../../../components/common/form/MyForm'
  import MyItem from '../../../../../../../../components/common/form/MyItem'
  import MySelect from '../../../../../../../../components/common/select/MySelect'
  import MyOption from '../../../../../../../../components/common/select/MyOption'
  import MyDatePicker from '../../../../../../../../components/common/date/MyDatePicker'
  import MyDialog from '../../../../../../../../components/common/modal/MyDialog'
  import remarks from '../../../../../../../../components/common/popover/remarks.vue'

  // filters
  import {
    sexFilter,
    sickTypeFilter,
    isSickFilter,
    dateTimeFilter,
    dataSource,
  } from '../../../../../../../../filters'
  import gs from '../../../rules'

  // actionss
  import actions from './actions'
  // t
  import * as s from './util'
  import {polar} from './chartsDef'

  export default{
    data () {
      return {
        tabs: [
          {label: '健康数据', name: 'patient_doctor_info'},
          {label: '对话', name: 'customer_chat'},
        ],
        warnSwitch: 0,
        warrFrom: false,
        bpFrom: false,
        formFields: {
          measurementDate: '',
          diastolicPressure: '',
          systolicPressure: '',
          heartRate: '',
          remark: ''
        },
        warr: {
          bpHL: '',
          bpHH: '',
          bpLL: '',
          bpLH: ''
        },
        datePickerOptions: {
          disabledDate(d){
            let today = new Date()
            today.setHours(23)
            today.setMinutes(59)
            today.setSeconds(59)
            return d > today
          }
        },
        Def: {},
        polar,
        isNotesEdit: false,
        search: {
          source: null,
          mDateRange: []
        },
        isData: 0,
        info: {},
        device: [],
        meLi: [],
        pagination: {
          pageIndex: 1,
          pageSize: 5,
          totalRecord: 5
        },
        most: {
          maxDiastolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
          minDiastolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
          maxSystolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
          minSystolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
        },
        dateRangeTabs: [
          {label: '日', name: 'day'},
          {label: '周', name: 'week'},
          {label: '月', name: 'month'},
          {label: '年', name: 'year'}
        ],
        img: {
          szy: require('!!raw!../../../../../../../../../static/diastolicPressure.svg'),
          ssy: require('!!raw!../../../../../../../../../static/icon_user_data_bloodpressure_systolic.svg'),
          des: require('!!raw!../../../../../../../../../static/icon-introduction.svg'),
          save: require('!!raw!../../../../../../../../../static/icon-save.svg'),
          remarks: require('!!raw!../../../../../../../../../static/icon-remarks.svg'),
          holder: require('!!raw!../../../../../../../../../static/assets/icon-search.svg'),
        },
      }
    },
    components: {
      page,
      MsPopover,
      MyTable,
      MyTableColumn,
      MyPagination,
      MyDatePicker,
      MyButton,
      MyRow,
      MyCol,
      MyDropdown,
      echarts,
      MyTabs,
      MyTabPane,
      MyInput,
      MyForm,
      MyItem,
      MySelect,
      MyOption,
      MyDialog,
      remarks,
    },
    computed: {
      ...gs,
      tabsActiveName: {
        get () {
          return this.$route.name
        },
        set (name) {
          this.$router.replace({name})
        }
      },
      tipName () {
        return {day: '时', week: '周', month: '天', year: '月'}[this.timeRange]
      },
      timeRange () {
        return this.$route.query.timeRange || 'day'
      },
      graphType () {
        return this.$route.query.graphType || 'trend'
      },
      tip () {
        return this.graphType === 'trend' ? '暂无测量数据' : '暂无异常数据'
      },
      graphTypeName () {
        return (this.$route.query.graphType === 'errCount') ? '血压异常分布图' : '血压趋势变化图'
      },
    },
    watch: {
      'graphType' () {
        this.initChart()
      },
    },
    methods: {
      sexFilter,
      sickTypeFilter,
      isSickFilter,
      dateTimeFilter,
      dataSource,
      ...actions,
      set (v) {
        if (v) {
          this.serach()
        }
      },
      async initChart () {
        !!this.Def.info && s.loading(this.$refs.bar)
        const {graphType, timeRange} = this
        const {userId, doctorId, patientId} = this.Def
        this.polar = {
          ...this.polar,
          title: s.titleSet({graphType, timeRange}),
          tooltip: s.sooltipSet({graphType, timeRange}),
          xAxis: s.xAxisSet(timeRange),
          yAxis: s.yAxisSet(graphType)
        }

        const {series, isData} = await s.getData({graphType, timeRange, userId, doctorId, patientId})
        this.polar = {...this.polar, series}
        this.isData = isData
      },
      setQuery(tab, queryName){
        this.$router.replace({query: {...this.$route.query, [queryName]: tab.name}})
        this.initChart()
      },
      notesEdit () {
        this.isNotesEdit = !this.isNotesEdit
        if (!this.isNotesEdit) {
          this.editPatientRemark()
        }
      },
    },
    created () {
      const {graphType, timeRange} = this
      this.polar = {...this.polar, xAxis: s.xAxisSet(timeRange), 'yAxis': s.yAxisSet(graphType)}
    },
    mounted(){
      this.init()
      if (this.Def.info) {
        setInterval(() => {
          this.$refs.bar.clear()
          this.initChart()
        }, 300000)
      }
    },
    destroyed () {
//      this.$refs.bar.clear()
    }
  }
</script>
