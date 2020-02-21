// 引用
import merge from 'lodash/merge'
import {defSeries1, defYaxis1, defYaxis2, defEmphasis, defData} from './chartsDef'
import {getNums, getlineArr, splitArr} from '../../../../../../../../components/common/echarts/util'
import {getTrendGraphDataApi, getErrCountGraphDataApi} from '../../../../../../../../api/abnormal'

//
export const getData = async function (obj) {
  const {graphType, timeRange, userId, doctorId, patientId} = obj
  // const {graphType, timeRange} = this
  // const {userId, doctorId, patientId} = this.Def
  // '收缩压', systolicPressure,  '舒张压', diastolicPressure
  let spData = null
  let dpData = null
  let isData = 0
  if (graphType === 'trend') {
    const res = await getTrendGraphDataApi({type: timeRange, userId})
    isData = res && res.length !== 0 ? 0 : 1
    spData = splitArr(getlineArr(res, 'systolicPressure', timeRange))
    dpData = splitArr(getlineArr(res, 'diastolicPressure', timeRange))
  } else {
    const res = await getErrCountGraphDataApi({type: timeRange, patientId, doctorId})
    isData = res && res.length !== 0 ? 0 : 1
    spData = getlineArr(res, 'systolicPressureTimes', timeRange)
    dpData = getlineArr(res, 'diastolicPressureTimes', timeRange)
  }
  const series = isData ? defData : [...seriesSet(graphType, '收缩压', spData), ...seriesSet(graphType, '舒张压', dpData)]
  return {isData, series}
}

// loading 加载
export const loading = function (bar) {
  this.seconds = 3
  // let bar = this.$refs.bar
//        console.log('图表方法', bar)
  bar.showLoading({
    text: ' ',
    color: '#4ea397',
    maskColor: 'rgba(255, 255, 255, 0.4)'
  })
  let timer = setInterval(() => {
    this.seconds--
    if (this.seconds === 0) {
      clearTimeout(timer)
      bar.hideLoading()
//            bar.mergeOptions(obj)
    }
  }, 200)
}

// 图表标题设置
export const titleSet = ({timeRange, graphType}) => {
  const rangeDesc = {'day': '最近一天', 'week': '最近7天', 'month': '最近30天', 'year': '最近一年'}[timeRange]
  const graphDesc = {'trend': '血压变化趋势', 'errCount': '血压异常分布'}[graphType]
  return {'text': `${rangeDesc}${graphDesc}`, x: 'center'}
}

// 针对虚实线 与 线条 与 柱体设置
export const seriesSet = (graphType, name, arr) => {
  // '收缩压', systolicPressure, '#20a0ff'
  // '舒张压', diastolicPressure, '#35bf32'
  const {systolicPressure, diastolicPressure} = defSeries1
  const {dip, sys} = defEmphasis
  const type = {trend: 'line', errCount: 'bar'}[graphType]
  const color = {'收缩压': '#20a0ff', '舒张压': '#35bf32'}[name]
  const def = {'收缩压': systolicPressure, '舒张压': diastolicPressure}[name]
  const emphasis = {'收缩压': sys, '舒张压': dip}[name]

  let sData = []
  // Dashed  Solid
  if (graphType === 'trend') { // 趋势
    arr.Solid && arr.Solid.map((data) => {
      sData.push({
        ...def, name, lineStyle: {
          normal: {color, type: 'solid'}
        }, itemStyle: {normal: {color}, emphasis}, symbol: 'circle', type, data
      })
    })
    arr.Dashed && arr.Dashed.map((data) => {
      sData.push({
        ...def, name, lineStyle: {
          normal: {color, type: 'dashed'}
        }, itemStyle: {normal: {color}, emphasis}, symbol: 'circle', type, data
      })
    })
  } else {
    sData.push({
      ...def, name, lineStyle: {
        normal: {color}
      }, type, 'data': arr
    })
  }
  return sData
}

// 图表Y轴线设置
export const yAxisSet = (graphType) => {
  const mLen = {trend: [{name: 'mmHg', max: 200, min: 40, interval: 40}], errCount: [{name: '次', max: 20, min: 0, interval: 5}]}[graphType]
  const defYaxis = {trend: defYaxis1, errCount: defYaxis2}[graphType]
  return merge(defYaxis, mLen)
}

// 转化刻度
const getAsLable = (weeks, fil) => { // 当前时间 前7天 前12月
  let now = weeks[fil]
  let array = Object.keys(weeks).map((el) => weeks[el])
  const $index = array.findIndex((w) => w === now)
  const fir = array.slice(0, $index + 1)
  array.splice(0, $index + 1)
  return [...array, ...fir]
}

// 图表X轴设置 设置相关刻度
export const xAxisSet = (timeRange) => {
  const weeks = {0: '星期日', 1: '星期一', 2: '星期二', 3: '星期三', 4: '星期四', 5: '星期五', 6: '星期六'}
  const months = {0: '一月', 1: '二月', 2: '三月', 3: '四月', 4: '五月', 5: '六月', 6: '七月', 7: '八月', 8: '九月', 9: '十月', 10: '十一月', 11: '十二月'}
  const times = [...new Array(24)].map((t, index) => index)
  const data = {
    'day': times,
    'week': getAsLable(weeks, new Date().getDay()),
    'month': getNums(30),
    'year': getAsLable(months, new Date().getMonth()),
  }[timeRange]
  return [{...xAxisLineSet(), data}]
}

// 图表X轴线设置
const xAxisLineSet = () => {
  return {
    nameLocation: 'start',
    nameTextStyle: {
      fontSize: 14,
      color: '#000',
    },
    nameGap: 18,
    axisLine: {
      lineStyle: {
        color: '#ededed',
        width: 2
      }
    },
    axisTick: {
      inside: true,
      alignWithLabel: true
    },
    axisLabel: {
      textStyle: {
        color: '#000',
      },
      formatter: function (value, index) {
        if (index === 0 && value === 0) {
          return '时'
        } else {
          return value
        }
      }
    },
  }
}

// 悬浮数据提示
export const sooltipSet = ({timeRange, graphType}) => {
  const unit = {trend: 'mmHg', errCount: '次'}[graphType]
  const ti = {day: '时', month: '日'}[timeRange]
  const text = {trend: '平均数据', errCount: '异常出现次数'}[graphType]
  return {
    trigger: 'axis',
    backgroundColor: '#404c5a',
    padding: 10,
    textStyle: {
      fontSize: 12
    },
    extraCssText: 'border-radius: 8px;',
    formatter: function (params) {
      let sName = ''
      let dName = ''
      let TName = ''
      params.map((p) => {
        TName = p.name
        if (p.seriesName === '舒张压' && p.data != '--') {
          sName = `${p.seriesName}: ${p.data} ${unit}`
        }
        if (p.seriesName === '收缩压' && p.data != '--') {
          dName = `${p.seriesName}: ${p.data} ${unit}`
        }
      })
      TName = ti ? `${TName}${ti}` : TName
      if (sName || dName) {
        return `<div style='line-height: 20px;'>${TName}${text}<br/>${sName}<br/>${dName}</div>`
      }
    }
  }
}

// 默认血压最值
// export const dMost = {
// maxDiastolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
// minDiastolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
// maxSystolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
// minSystolic: {systolicPressure: '--', diastolicPressure: '--', measurementDate: '', heartRate: ''},
// }

// export const dvi = [
// {
//   sn: "12121221",
//   qrcode: "http://img.zcool.cn/community/03132e658574beea801219c775bb4db.jpg",
//   model: "12345324",
//   userNo: 0,
//   name: "名字",
//   picture: "http://img.zcool.cn/community/03132e658574beea801219c775bb4db.jpg",
// }, {
//   sn: "12121221",
//   qrcode: "http://img.zcool.cn/community/03132e658574beea801219c775bb4db.jpg",
//   model: "12345324",
//   userNo: 0,
//   name: "名字2222",
//   picture: "http://img.zcool.cn/community/03132e658574beea801219c775bb4db.jpg",
// }
// ]

export default {
  sooltipSet,
  xAxisSet,
  seriesSet,
  yAxisSet,
  titleSet,
  getData,
  loading,
}