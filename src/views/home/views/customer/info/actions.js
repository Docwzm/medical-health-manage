import {mapActions} from '../../../../../utils/vuex'
import {showAlert} from '../../../../../store/actions/alert'

// 图表标题设置
const getTitle = (store, {timeRange, graphType, chartType}) => {
  const rangeDesc = {'day': '最近1天', 'week': '最近7天', 'month': '最近30天', 'year': '最近1年'}[timeRange]
  const graphDesc = {'trend': '变化趋势', 'errCount': '异常分布'}[graphType]
  const chartDesc = {'bp': '血压', 'bs': '血糖', 'steps': '步数', 'weight': '体重', 'heartRate': '心率', 'temperature': '体温', 'sleep': '睡眠'}[chartType]
  return `${rangeDesc}${chartDesc}${graphDesc}`
}

// 根据数值 设置颜色
const markAbnormalRows = function (store, row) {
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

const tabLink = function (store, {name}) {
  const {name: paName, bindWechat} = this.Def
  if (name === 'customer_chat' && bindWechat === 0) {
    this.tabsActiveName = 'patient_doctor_info'
    this.$refs.tabActve.currentName = 'patient_doctor_info'
    showAlert(`用户还未关联微信,不能与“${paName}”对话`, 'warning')
  }
}

// 筛选
const fles = (store, list = [], key) => {
  let departmentsNames = []
  list && list.map((li) => {
    departmentsNames.push(li[key])
  })
  return departmentsNames = departmentsNames.join(',')
}

// 去重
const fill = (store, arr, t1, t2) => {
  const map = {}
  arr.forEach(item => {
    map[item[t1] + item[t2]] = item
  })
  return Object.keys(map).map(key => map[key])
}

// 弹窗取消
const cancel = function (store, type) {
  this[type] = !this[type]
  this.$refs[type].resetFields()
}

// 表单提交
const submitForms = function (store, formName, callback, tip) {
  this.$refs[formName].validate((valid) => {
    if (valid) {
      (typeof callback === "function") && callback()
      this[formName] = !this[formName]
      this.$refs[formName].resetFields()
    } else {
      const text = tip || '数据'
      showAlert(`${text}有误，请修正错误信息！`, 'error')
      return false;
    }
  })
}

export default mapActions({
  fles,
  fill,
  cancel,
  submitForms,
  markAbnormalRows,
  tabLink,
  getTitle,
})