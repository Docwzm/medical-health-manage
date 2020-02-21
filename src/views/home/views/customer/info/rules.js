import {mapGetters} from '../../../../../utils/vuex'

// validator
import {
  inputValidator
} from '../../../../../../src/validator'

const check = (rule, value, callback) => {
  // if (!value) {
  //   return callback(new Error('不能为空'))
  // }
  if (isNaN(value)) {
    return callback(new Error('必须为数字'))
  }
  if (rule.field === 'diastolicPressure') {
    rlus(value, callback, 40, 130)
  }
  if (rule.field === 'systolicPressure') {
    rlus(value, callback, 60, 200)
  }
  if (rule.field === 'heartRate') {
    rlus(value, callback, 40, 120)
  }
  if (rule.field === 'glucoseConcentration') {
    rlus(value, callback, 1.1, 33.3, rule.field)
  }
  // console.log('111111', rule)
}

const noNull = (rule, value, callback) => {
  if (!value && value !== 0) {
    if (rule.field === 'measurementDate') {
      return callback(new Error('请输入测量日期'))
    }
    if (rule.field === 'mealPeroid') {
      return callback(new Error('请选择测量状态'))
    }
    return callback(new Error('请输入'))
  } else {
    if (rule.field === 'measurementDate' && value > new Date().getTime()) {
      return callback(new Error('请输入小于当前时间的测量日期'))
    }
    callback()
  }
}

function rlus(value, callback, t1, t2, type) {
  if (value < t1 || value > t2) {
    let text = `请输入${t1}-${t2}的数值`
    if (type === 'glucoseConcentration') {
      text = `请输入${t1}-${t2}范围的数字，精确到小数点后1位`
    }
    return callback(new Error(text))
  } else {
    callback()
  }
}

// 血糖校验规则
const bsFromRules = () => {
  return {
    measurementDate: [{validator: noNull, trigger: 'blur, change'}],
    glucoseConcentration: [{validator: check, trigger: 'blur, change'}],
    mealPeroid: [{validator: noNull, trigger: 'blur, change'}],
    memo: [{ max: 50, trigger: 'blur, change' }],
  }
}

// 血压校验规则
const bpFromRules = () => {
  return {
    measurementDate: [{validator: noNull, trigger: 'blur, change'}],
    diastolicPressure: [{validator: check, trigger: 'blur, change'}],
    systolicPressure: [{validator: check, trigger: 'blur, change'}],
    heartRate: [{validator: check, trigger: 'blur, change'}],
    remark: [{ max: 50, trigger: 'blur, change' }],
  }
}

const warrCheck = (rule, value, callback) => {
  if (isNaN(value)) {
    return callback(new Error('必须为数字'))
  }
  if (rule.field === 'bpLL' || rule.field === 'bpLH') {
    rlus(value, callback, 30, 130)
  }
  if (rule.field === 'bpHL' || rule.field === 'bpHH') {
    rlus(value, callback, 60, 200)
  }
  if (rule.field === 'bgEmptyL' || rule.field === 'bgBeforemealL' || rule.field === 'bgAftermealL' || rule.field === 'bgBeforesleepL') {
    rlus(value, callback, 1.1, 7.2)
  }
  if (rule.field === 'bgEmptyH' || rule.field === 'bgBeforemealH' || rule.field === 'bgAftermealH' || rule.field === 'bgBeforesleepH') {
    rlus(value, callback, 4.4, 33.3)
  }
  if (rule.field === 'heartRateL' || rule.field === 'heartRateH') {
    rlus(value, callback, 40, 120)
  }
  if (rule.field === 'stepL') {
    rlus(value, callback, 1, 50)
  }
  if (rule.field === 'stepH') {
    rlus(value, callback, 5, 50)
  }
  if (rule.field === 'weightL') {
    rlus(value, callback, 30, 100)
  }
  if (rule.field === 'weightH') {
    rlus(value, callback, 40, 100)
  }
  if (rule.field === 'temperatureL' || rule.field === 'temperatureH') {
    rlus(value, callback, 34, 41.9)
  }
  if (rule.field === 'sleepL') {
    rlus(value, callback, 1, 10)
  }
  if (rule.field === 'sleepH') {
    rlus(value, callback, 5, 10)
  }
}

// 预警值校验规则
const warrFromRules = () => {
  return {
    bpLL: [{validator: warrCheck, trigger: 'blur, change'}],
    bpLH: [{validator: warrCheck, trigger: 'blur, change'}],
    bpHL: [{validator: warrCheck, trigger: 'blur, change'}],
    bpHH: [{validator: warrCheck, trigger: 'blur, change'}],
    bgEmptyL: [{validator: warrCheck, trigger: 'blur, change'}],
    bgEmptyH: [{validator: warrCheck, trigger: 'blur, change'}],
    bgBeforemealL: [{validator: warrCheck, trigger: 'blur, change'}],
    bgBeforemealH: [{validator: warrCheck, trigger: 'blur, change'}],
    bgAftermealL: [{validator: warrCheck, trigger: 'blur, change'}],
    bgAftermealH: [{validator: warrCheck, trigger: 'blur, change'}],
    bgBeforesleepL: [{validator: warrCheck, trigger: 'blur, change'}],
    bgBeforesleepH: [{validator: warrCheck, trigger: 'blur, change'}],
    heartRateL: [{validator: warrCheck, trigger: 'blur, change'}],
    heartRateH: [{validator: warrCheck, trigger: 'blur, change'}],
    stepL: [{validator: warrCheck, trigger: 'blur, change'}],
    stepH: [{validator: warrCheck, trigger: 'blur, change'}],
    weightL: [{validator: warrCheck, trigger: 'blur, change'}],
    weightH: [{validator: warrCheck, trigger: 'blur, change'}],
    temperatureL: [{validator: warrCheck, trigger: 'blur, change'}],
    temperatureH: [{validator: warrCheck, trigger: 'blur, change'}],
    sleepL: [{validator: warrCheck, trigger: 'blur, change'}],
    sleepH: [{validator: warrCheck, trigger: 'blur, change'}],
  }
}

export default mapGetters({
  bpFromRules,
  bsFromRules,
  warrFromRules,
})