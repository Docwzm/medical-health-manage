<style lang="less" scoped>
  @import "../style.less";
</style>

<template>
  <div>
    <div class="info">
      <div class="myTitle">
        <span>用户资料</span>
        <span v-show="type === 'admin'" class="right" @click="go">查看详情</span>
        <my-dropdown v-show="type === 'doctor'" class="right menu" label="更多" butype="text"
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
        <div><label>手机：</label><span>{{info.phone || '--'}}</span></div>
        <div v-show="type === 'admin'"><label>关联医生：</label><span>{{info.doctorNames || '无'}}</span></div>
        <div><label>地区：</label><span>{{info.prs || info.address || '无'}}</span></div>
        <div><label>疾病类型：</label><span>{{info.sickType && sickTypeFilter(info.sickType) || '无'}}</span></div>
        <span class="tip"></span>
        <div>心血管病危险因素：</div>
        <div>
          <div class="bar">
            <span><label>吸烟：</label><span>{{info.sickRiskDto && isSickFilter(info.sickRiskDto.smoking) || '无'}}</span></span>
            <span><label>血脂异常：</label><span>{{info.sickRiskDto && isSickFilter(info.sickRiskDto.dyslipidemia) || '无'}}</span></span>
          </div>
          <div class="bar">
            <span><label>肥胖：</label><span>{{info.sickRiskDto && isSickFilter(info.sickRiskDto.obesity) || '无'}}</span></span>
            <span><label>缺乏运动：</label><span>{{info.sickRiskDto && isSickFilter(info.sickRiskDto.lackOfExercise) || '无'}}</span></span>
          </div>
          <div class="bar">
            <label>C反应异常：</label><span>{{info.sickRiskDto && isSickFilter(info.sickRiskDto.reactiveProteinC) || '无'}}</span>
          </div>
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

    <div v-show="type === 'doctor'" :class="{'notes': true, 'in': isNotesEdit}">
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

    <!-- 设置自定义预警值 -->
    <my-dialog ref="warr" class="my_dialog win600 maxH620" top="10%" v-model="warrFrom">
      <div slot="title" class="titles">
        <span>自定义预警值</span>
        <div class="aks" style="float: right">
          <span @click="backWarr">恢复默认值</span>
          <span @click="switchWarr">{{warnSwitch?'关闭':'打开'}}预警</span>
        </div>
      </div>
      <my-form style="" ref="warrFrom" :model="warr" :rules="warrFromRules"
               label-position="left" label-width="80px">

        <div class="liBar"><span>血压上限与下限值</span>
          <my-switch v-model="os.bp"></my-switch>
        </div>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="收缩压:" prop="bpHL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="89" class="my-input win80" v-model="warr.bpHL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="bpHH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="140" class="my-input win80" v-model="warr.bpHH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">mmHg</span>
          </my-col>
        </my-row>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="舒张压:" prop="bpLL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="59" class="my-input win80" v-model="warr.bpLL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="bpLH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="90" class="my-input win80" v-model="warr.bpLH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">mmHg</span>
          </my-col>
        </my-row>

        <div class="liBar"><span>血糖上限与下限值</span>
          <my-switch v-model="os.bs"></my-switch>
        </div>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="空腹:" prop="bgEmptyL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="4.4" class="my-input win80" v-model="warr.bgEmptyL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="bgEmptyH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="7.0" class="my-input win80" v-model="warr.bgEmptyH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">mmol/L</span>
          </my-col>
        </my-row>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="餐前:" prop="bgBeforemealL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="4.4" class="my-input win80" v-model="warr.bgBeforemealL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="bgBeforemealH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="7.7" class="my-input win80" v-model="warr.bgBeforemealH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">mmol/L</span>
          </my-col>
        </my-row>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="餐后:" prop="bgAftermealL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="4.4" class="my-input win80" v-model="warr.bgAftermealL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="bgAftermealH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="10.0" class="my-input win80" v-model="warr.bgAftermealH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">mmol/L</span>
          </my-col>
        </my-row>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="睡前:" prop="bgBeforesleepL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="4.4" class="my-input win80" v-model="warr.bgBeforesleepL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="bgBeforesleepH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="10.0" class="my-input win80" v-model="warr.bgBeforesleepH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">mmol/L</span>
          </my-col>
        </my-row>

        <div class="liBar"><span>脉搏上限与下限值</span>
          <my-switch v-model="os.heartRate"></my-switch>
        </div>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="脉搏:" prop="heartRateL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="59" class="my-input win80" v-model="warr.heartRateL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="heartRateH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="100" class="my-input win80" v-model="warr.heartRateH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">次/分</span>
          </my-col>
        </my-row>

        <div class="liBar"><span>步数上限与下限值</span>
          <my-switch v-model="os.steps"></my-switch>
        </div>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="步数:" prop="stepL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="5" class="my-input win80" v-model="warr.stepL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="stepH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="10" class="my-input win80" v-model="warr.stepH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">千步</span>
          </my-col>
        </my-row>

        <div class="liBar"><span>体重上限与下限值</span>
          <my-switch v-model="os.weight"></my-switch>
        </div>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="体重:" prop="weightL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="40" class="my-input win80" v-model="warr.weightL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="weightH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="80" class="my-input win80" v-model="warr.weightH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">kg</span>
          </my-col>
        </my-row>

        <div class="liBar"><span>体温上限与下限值</span>
          <my-switch v-model="os.temperature"></my-switch>
        </div>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="体温:" prop="temperatureL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="36" class="my-input win80" v-model="warr.temperatureL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="temperatureH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="37" class="my-input win80" v-model="warr.temperatureH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">&#176;C</span>
          </my-col>
        </my-row>

        <div class="liBar"><span>睡眠上限与下限值</span>
          <my-switch v-model="os.sleep"></my-switch>
        </div>
        <my-row>
          <my-col :span="7" :offset="5">
            <my-item label="睡眠:" prop="sleepL" style="margin: 0">
              <el-input :disabled="!warnSwitch" placeholder="5" class="my-input win80" v-model="warr.sleepL"
                        :maxlength="3">
              </el-input>
            </my-item>
          </my-col>
          <my-col :span="12">
            <span class="lt">至</span>
            <my-item prop="sleepH" style="display: inline-block; vertical-align: middle;">
              <el-input :disabled="!warnSwitch" placeholder="8" class="my-input win80" v-model="warr.sleepH"
                        :maxlength="3">
              </el-input>
            </my-item>
            <span class="lt">小时</span>
          </my-col>
        </my-row>
      </my-form>
      <div slot="footer" class="dfooter">
        <my-button style="width: 100px" @click.native="cancel('warrFrom')">取 消</my-button>
        <my-button style="width: 100px" type="primary" @click.native="save('warrFrom')">保 存</my-button>
        <!--<div v-show="!warnSwitch" class="clo">预警已关闭</div>-->
      </div>
    </my-dialog>

    <my-dialog title="用户详情" class="my_dialog win1000 maxHeight600 admin-detail-dialog" top="10%" v-model="detailDialog">
      <detail :isDialog="true" @click="closeDialog">
      </detail>
    </my-dialog>


  </div>
</template>

<script>
  // components
  import MsPopover from '../../../../../../components/common/popover/msPopover.vue'
  import MyDialog from '../../../../../../components/common/modal/MyDialog'
  import MyInput from '../../../../../../components/common/input/MyInput'
  import MyButton from '../../../../../../components/common/button/MyButton'
  import MyForm from '../../../../../../components/common/form/MyForm'
  import MyItem from '../../../../../../components/common/form/MyItem'
  import MySwitch from '../../../../../../components/common/radio/MySwitch'
  import {MyRow, MyCol} from '../../../../../../components/common/layout'
  import MyDropdown from '../../../../../../components/common/dropdown/MyDropdown.vue'
  import detail from '../../../customer/edit/index.vue'

  // API
  import {getPatient, editPatientRemarkApi} from '../../../../../../api/patient'
  import {getPatientDeviceApi} from '../../../../../../api/device'
  import {getWarningApi, setWarningApi} from '../../../../../../api/abnormal'

  import router from '../../../../../../router'
  import rules from '../rules'
  import {showConfirm} from '../../../../../../store/actions/confirm'
  // actios
  import actions from '../actions'

  // getters
  import {paramsGetter, queryGetter} from '../../../../../../store/getters/route'
  import {commonGetter} from '../../../../../../store/getters/common'

  // mutations
  import {
    CUSTOMER_DEF
  } from '../../../../../../store/mutation-types'
  import {MUTATION_NAME, MUTATION_NAME2} from '../../../../top/mutations'

  // filters
  import {
    sexFilter,
    sickTypeFilter,
    isSickFilter,
    dateTimeFilter,
    dataSource,
    pcaFilter,
  } from '../../../../../../filters'

  const def = {
    bpHL: 89,
    bpHH: 140, // 收缩压
    bpLH: 90, // 舒张压
    bpLL: 59,
    bgEmptyL: 4.4,
    bgEmptyH: 7.0,
    bgBeforemealL: 4.4,
    bgBeforemealH: 7.7,
    bgAftermealL: 4.4,
    bgAftermealH: 10.0,
    bgBeforesleepL: 4.4,
    bgBeforesleepH: 10.0,
    heartRateH: 100,
    heartRateL: 59, // 心率
    stepL: 5000,
    stepH: 10000, // 步数
    weightH: 60,
    weightL: 40, // 体重
    temperatureH: 37,
    temperatureL: 36, // 体温
    sleepH: 8,
    sleepL: 5, // 睡眠
    bpHOnOff: 1,
    bpLOnOff: 1,
    bgEmptyOnOff: 1,
    bgBeforemealOnOff: 1,
    bgAftermealOnOff: 1,
    bgBeforesleepOnOff: 1,
    hrOnOff: 1,
    stepOnOff: 0,
    weightOnOff: 0,
    temperatureOnOff: 0,
    sleepOnOff: 0,
  }

  export default{
    name: 'info_left',
    props: {
      type: {
        type: [String, Number],
        default: 'admin'
      },
    },
    data () {
      return {
        info: {},
        device: [],
        warnSwitch: true,
        warrFrom: false,
        isNotesEdit: false,
        warr: {
          bpHL: 89,
          bpHH: 140, // 收缩压
          bpLH: 90, // 舒张压
          bpLL: 59,
          stepL: 5000,
          stepH: 10000, // 步数
          weightH: 60,
          weightL: 40, // 体重
          temperatureH: 37,
          temperatureL: 36, // 体温
          heartRateH: 100,
          heartRateL: 59, // 心率
          sleepH: 8,
          sleepL: 5, // 睡眠
        },
        os: {
          bp: true,
          bs: true,
          heartRate: true,
          steps: false,
          weight: false,
          temperature: false,
          sleep: false,
        },
        img: {
          remarks: require('!!raw!../../../../../../../static/icon-remarks.svg'),
        },
        detailDialog: false,
      }
    },
    components: {
      MsPopover,
      MyDialog,
      MyInput,
      MyButton,
      MyForm,
      MyItem,
      MyRow,
      MyCol,
      MySwitch,
      MyDropdown,
      detail,
    },
    computed: {
      ...rules,
      id () {
        return paramsGetter(this.$store.state).id
      },
      ogId () {
        return this.$store.state[MUTATION_NAME].infos.id
      },
      doctorId () {
        return this.$store.state[MUTATION_NAME2].infos.id
      },
    },
    watch: {
      'ogId' () {
        this.init()
      },
      'doctorId' () {
        this.init()
      },
      os: {
        handler({bp, bs, heartRate, steps, weight, temperature, sleep}) {
          if (bp === false && bs === false && heartRate === false && steps === false && weight === false && temperature === false && sleep === false) {
            this.warnSwitch = false
          } else {
            this.warnSwitch = true
          }
        },
        deep: true
      }
    },
    methods: {
      ...actions,
      sexFilter,
      sickTypeFilter,
      isSickFilter,
      dateTimeFilter,
      pcaFilter,
      dataSource,
      async init () {
        await this.getPatientData()
//        await this.setWarnSwitch()
//        if (this.type === 'doctor') lt = await getWarningApi({patientId: this.id})
        await this.getDevices()
      },
      async getPatientData () {
        const admin = (this.type === 'admin')
        const doctor = (this.type === 'doctor')
        const data = admin && await getPatient({
              organId: this.ogId,
              id: this.id
            }) || doctor && await getPatient({doctorId: this.doctorId, id: this.id})
        const doctorNames = admin && data.doctorList && this.fles(data.doctorList, 'name') || ''
        const address = admin && data.infoDto && data.infoDto.address || ''
        const prs = data.infoDto && data.infoDto.province && data.infoDto.city && pcaFilter(data.infoDto.province, data.infoDto.city, commonGetter(this.$store.state).pros) || ''
        this.info = admin && {...data, address, prs, doctorNames} || doctor && {...data, prs}
        this.$store.commit(CUSTOMER_DEF, data)
      },
      setDef (data = {}) {
        const {
            stepL, stepH, bpHOnOff, bpLOnOff, bgEmptyOnOff, bgBeforemealOnOff, bgAftermealOnOff, bgBeforesleepOnOff,
            hrOnOff, stepOnOff, weightOnOff, sleepOnOff, temperatureOnOff, ...res
        } = data
        this.os = {
          ...this.os,
          bp: (bpHOnOff === 1 && bpLOnOff === 1) ? true : false,
          bs: (bgEmptyOnOff === 1 && bgBeforemealOnOff === 1 && bgAftermealOnOff === 1 && bgBeforesleepOnOff === 1) ? true : false,
          heartRate: !!hrOnOff,
          steps: !!stepOnOff,
          weight: !!weightOnOff,
          temperature: !!temperatureOnOff,
          sleep: !!sleepOnOff,
        }
        const {bp, bs, heartRate, steps, weight, temperature, sleep} = this.os
        if (bp === false && bs === false && heartRate === false && steps === false && weight === false && temperature === false && sleep === false) {
          this.warnSwitch = false
        } else {
          this.warnSwitch = true
        }
        this.warr = {
          ...this.warr, ...res,
          bpHOnOff,
          bpLOnOff,
          bgEmptyOnOff,
          bgBeforemealOnOff,
          bgAftermealOnOff,
          bgBeforesleepOnOff,
          hrOnOff,
          stepOnOff,
          weightOnOff,
          sleepOnOff,
          temperatureOnOff,
          stepL: stepL / 1000,
          stepH: stepH / 1000
        }
      },
      async rightGo(key) { // 预警值 与  查看详情
        if (key === 'warn') {
          this.warrFrom = !this.warrFrom
          this.setDef({...await getWarningApi({patientId: this.id})})
        } else {
          this.go()
        }
      },
      go () { // 查看详情跳转
        if (this.type === 'admin') {
          //router.push({name: 'customer_edit', params: {id: this.id}, query: {from: 'patient_admin_info'}})
          this.detailDialog = true
        }
        if (this.type === 'doctor') {
          router.push({name: 'customer_edit', params: {id: this.id}, query: {from: 'patient_doctor_info'}})
        }
      },
      backWarr () {
        showConfirm('恢复后，所有自定义的预警值、预警开关都会恢复默认状态。', '确定恢复默认设置？').then(() => {
          this.setDef(def)
        }).catch(() => {

        })
      },
      async setWarnSwitch () {
        const {bp, bs, heartRate, steps, weight, temperature, sleep} = this.os
        this.warnSwitch = (bp === true && bs === true && heartRate === true && steps === true && weight === true && temperature === true && sleep === true) ? true : false
        const {stepL, stepH, ...res} = this.warr
        const sw = {
          bpHOnOff: bp ? 1 : 0,
          bpLOnOff: bp ? 1 : 0,
          bgEmptyOnOff: bs ? 1 : 0,
          bgBeforemealOnOff: bs ? 1 : 0,
          bgAftermealOnOff: bs ? 1 : 0,
          bgBeforesleepOnOff: bs ? 1 : 0,
          hrOnOff: heartRate ? 1 : 0,
          stepOnOff: steps ? 1 : 0,
          weightOnOff: weight ? 1 : 0,
          sleepOnOff: sleep ? 1 : 0,
          temperatureOnOff: temperature ? 1 : 0
        }
        await setWarningApi({...this.warr, stepL: stepL * 1000, stepH: stepH * 1000, ...res, ...sw})
      },
      switchWarr () {
        const off = {
          bpHOnOff: 0, bpLOnOff: 0, hrOnOff: 0, stepOnOff: 0, weightOnOff: 0, sleepOnOff: 0,
          bgEmptyOnOff: 0, bgBeforemealOnOff: 0, bgAftermealOnOff: 0, bgBeforesleepOnOff: 0, temperatureOnOff: 0
        }

        const on = {
          bpHOnOff: 1, bpLOnOff: 1, hrOnOff: 1, stepOnOff: 1, weightOnOff: 1, sleepOnOff: 1,
          bgEmptyOnOff: 1, bgBeforemealOnOff: 1, bgAftermealOnOff: 1, bgBeforesleepOnOff: 1, temperatureOnOff: 1
        }

        if (this.warnSwitch) {
          showConfirm('禁用后，您将无法在健康管理平台和乐心医生app接收到所有异常数据提醒。', '确定禁用预警？').then(() => {
            this.warnSwitch = false
            this.os = {
              bp: false,
              bs: false,
              heartRate: false,
              steps: false,
              weight: false,
              temperature: false,
              sleep: false
            }
            this.warr = {...this.warr, ...off}
          }).catch(() => {
            this.warnSwitch = true
            this.os = {bp: true, bs: true, heartRate: true, steps: true, weight: true, temperature: true, sleep: true}
            this.warr = {...this.warr, ...on}
          })
        } else {
          this.warnSwitch = true
          this.os = {bp: true, bs: true, heartRate: true, steps: true, weight: true, temperature: true, sleep: true}
          this.warr = {...this.warr, ...on}
        }
      },
      save (formName) {
        this.submitForms(formName, async() => {
          await this.setWarnSwitch()
        }, '设置预警值')
      },
      async getDevices () {
        try {
          const res = await getPatientDeviceApi(this.info.userId)
          this.device = this.fill(res, 'id', 'sn')
          this.$store.commit(CUSTOMER_DEF, {...this.info, device: this.device})
        } catch (e) {
          console.info(e.msg)
        }
      },
      changeValue (key, value) {
        this.info[key] = value
      },
      async notesEdit () {
        this.isNotesEdit = !this.isNotesEdit
        if (!this.isNotesEdit) {
          const {patientId: id, remark} = this.info
          await editPatientRemarkApi({id, remark})
          await this.getPatientData()
        }
      },
      closeDialog (val) {
        this.detailDialog = false
      }
    },
    created () {
    },
    mounted () {
      if (this.type === 'admin' && this.ogId) {
        this.init()
      }
      if (this.type === 'doctor') {
        this.init()
      }
    },
    destroyed () {
    }
  }
</script>
