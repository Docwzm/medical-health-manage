import {mapActions} from '../../../../../../../../utils/vuex'
import router from '../../../../../../../../router'
import {showAlert} from '../../../../../../../../store/actions/alert'
import {showConfirm} from '../../../../../../../../store/actions/confirm'
// apis
import {getPatientInfo, editPatientRemarkApi} from '../../../../../../../../api/patient'
import {getPatientDeviceApi} from '../../../../../../../../api/device'
import {getPatientBpMostApi} from '../../../../../../../../api/bp'
import {getMeasureDataApi, getBpThreshold, setThreshold} from '../../../../../../../../api/abnormal'
import {getDoctorApi} from '../../../../../../../../api/account'
import {addBpRecordApi} from '../../../../../../../../api/bp'
// getres
import {paramsGetter, queryGetter} from '../../../../../../../../store/getters/route'
import {commonGetter} from '../../../../../../../../store/getters/common'
import {pcaFilter} from '../../../../../../../../filters'

let Def = {}
let lt = {}
const init = async function ({commit, state}) {
  const {id} = await getDoctorApi()
  await getInfo({commit, state}, this)
  await getPatientBpMost({commit, state}, this)
  await getDevices({commit, state}, this)
  await getMeasureData({commit, state}, this)
  this.Def = {...Def, 'patientId': paramsGetter(state).id, 'doctorId': id}
  await setWarnSwitch(this)
  if (this.Def.info) {
    this.initChart()
  }
}

const setWarnSwitch = async function (_this) {
  const res = await getBpThreshold({'patientId': Def.patientId})
  const {bpHL, bpHH, bpLL, bpLH, bpHOnOff, bpLOnOff} = res
  if (bpHOnOff === 0 && bpLOnOff === 0) {
    _this.warnSwitch = 0
  } else {
    _this.warnSwitch = 1
  }
  lt = {bpHL, bpHH, bpLL, bpLH, bpHOnOff, bpLOnOff}
}

const backWarr = function () {
  this.warr = {...this.warr, ...lt}
}
const switchWarr = function () {
  if (this.warnSwitch) {
    showConfirm('确定要关闭血压预警吗？', '关闭血压预警').then(() => {
      this.warnSwitch = 0
      this.warr = {...this.warr, bpHOnOff: 0, bpLOnOff: 0}
    }).catch(() => {
      this.warnSwitch = 1
      this.warr = {...this.warr, bpHOnOff: 1, bpLOnOff: 1}
    })
  } else {
    this.warnSwitch = 1
    this.warr = {...this.warr, bpHOnOff: 1, bpLOnOff: 1}
  }
}

// 患者详细 doctorList
const getInfo = async function (store, _this) {
  const {id} = paramsGetter(store.state)
  try {
    const data = await getPatientInfo(id)
    const prs = data.province && data.city && pcaFilter(data.province, data.city, commonGetter(store.state).pros) || ''
    _this.info = {...data, prs}
    Def.userId = data.userId
    Def.patientId = data.id
    Def.info = data
  } catch (err) {
    // if (!err.msg) {
    //   showAlert('获取接口失败！')
    // } else {
    //   showAlert(err.msg)
    // }
  }
}

// 去重
function fill(arr, t1, t2) {
  const map = {}
  arr.forEach(item => {
    map[item[t1] + item[t2]] = item
  })
  return Object.keys(map).map(key => map[key])
}

const getDevices = async function ({commit, state}, _this) {
  try {
    const res = await getPatientDeviceApi(Def.userId)
    _this.device = fill(res, 'id', 'sn')
  } catch (e) {
    console.info(e.msg)
  }
}

const serach = function (store) {
  getMeasureData(store, this)
}

// 获取患者测量数据
const getMeasureData = async function ({commit, state}, _this) {
  try {
    const {page: tPage} = queryGetter(state)
    let {mDateRange, source} = _this.search
    let begin = mDateRange[0] && mDateRange[0].getTime() || ''
    let end = mDateRange[1] && mDateRange[1].getTime() || ''
    const res = await getMeasureDataApi({
      userId: Def.userId,
      pageIndex: tPage,
      pageSize: _this.pagination.pageSize,
      begin,
      end,
      source: source || (source === 0 ? 0 : -1)
    })
    const {data, pageIndex, pageSize, totalRecord} = res
    _this.meLi = data
    _this.pagination = {..._this.pagination, pageIndex, pageSize, totalRecord}
  } catch (e) {
    // showAlert(e.msg, 'error')
  }
}

// 获取一个数组对象集合中指定键名的最值
const getMostSet = (data, key, want) => data.reduce((rs, item) => !item ? rs || {
      ...rs, diastolicPressure: '--', systolicPressure: '--', heartRate: '--',
    } : want === 'max' ? (rs[key] > item[key] ? rs : item) : (rs[key] > item[key] ? item : rs), data[0])

// 获取患者血压最值
const getPatientBpMost = async function ({commit, state}, _this) {
  const res = await getPatientBpMostApi(Def.userId)
  // 收缩压：systolicPressure, 舒张压：diastolicPressure
  const maxDiastolic = getMostSet(res, 'diastolicPressure', 'max')
  const minDiastolic = getMostSet(res, 'diastolicPressure', 'min')
  const maxSystolic = getMostSet(res, 'systolicPressure', 'max')
  const minSystolic = getMostSet(res, 'systolicPressure', 'min')
  _this.most = {maxDiastolic, minDiastolic, maxSystolic, minSystolic}
}

const go = function (store) {
  const {id} = paramsGetter(store.state)
  router.push({name: 'customer_edit', params: {id}, query: {from: 'patient_doctor_info'}})
}

// 根据数值 设置颜色
const markAbnormalRows = function ({commit, state}, row) {
  //todo  row.origin.level
  let color = 'inherit'
  if (row.diastolicPressure < 60
      || row.systolicPressure < 90) {
    color = '#FF9404'
  }

  if (row.diastolicPressure <= 99 && row.diastolicPressure >= 90
      || row.systolicPressure <= 159 && row.systolicPressure >= 140) {
    color = '#FF9404'
  }
  if (row.diastolicPressure <= 109 && row.diastolicPressure >= 100
      || row.systolicPressure <= 179 && row.systolicPressure >= 160) {
    color = '#FF4949'
  }
  if (row.diastolicPressure >= 109
      || row.systolicPressure >= 180) {
    color = '#FF4949'
  }
  return {
    color
  }
}

// 编辑患者备注
const editPatientRemark = async function ({commit, state}) {
  const {id, remark} = this.info
  await editPatientRemarkApi({id, remark})
  await getInfo({commit, state}, this)
}
const tabLink = function ({state, commit}, {name}) {
  const {name: paName, bindWechat} = Def.info
  if (name === 'customer_chat' && bindWechat === 0) {
    this.tabsActiveName = 'patient_doctor_info'
    this.$refs.tabActve.currentName = 'patient_doctor_info'
    showAlert(`用户还未关联微信,不能与“${paName}”对话`, 'warning')
  }
}
const changeValue = function ({state, commit}, key, value) {
  this.info[key] = value
}

// 预警值 与  查看详情
const rightGo = async function (store, key) {
  if (key === 'warn') {
    this.warrFrom = !this.warrFrom
    this.warr = {...await getBpThreshold({'patientId': Def.patientId})}
  } else {
    go(store)
  }
}

// 添加测量数据
const submitForm = async function (store, formName) {
  this.$refs[formName].validate(async(valid) => {
    if (valid) {
      if (formName === 'bpFrom') {
        await addBpRecordApi({...this.formFields, 'patientId': Def.userId})
        this.bpFrom = !this.bpFrom
        this.formFields = {measurementDate: '', diastolicPressure: '', systolicPressure: '', heartRate: '', remark: ''}
        this.$refs[formName].resetFields()
      }
      if (formName === 'warrFrom') {
        await setThreshold({...this.warr})
        this.warrFrom = !this.warrFrom
      }
      getMeasureData(store, this)
    } else {
      const text = formName === 'bpFrom' ? '添加数据' : '设置预警值'
      showAlert(`${text}有误，请修正错误信息！`, 'error')
      return false;
    }
  })
}

// 弹窗取消
const cancel = function (store, type) {
  if (type === 'warrFrom') {
    this.$refs.warrFrom.resetFields()
    this.warrFrom = !this.warrFrom
  } else {
    this.$refs.bpFrom.resetFields()
    this.bpFrom = !this.bpFrom
  }
}

export default mapActions({
  init,
  markAbnormalRows,
  editPatientRemark,
  tabLink,
  rightGo,
  serach,
  cancel,
  submitForm,
  changeValue,
  backWarr,
  switchWarr,
  go,
})
