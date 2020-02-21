// 引用
import merge from 'lodash/merge'
import echarts from 'echarts'
import {defSeries1, defYaxis1, defYaxis2, defEmphasis} from './chartsDef'
import {getNums} from '../../../../../components/common/echarts/util'
import moment from 'moment'

// loading 加载
export const loading = function (bar) {
  if (!bar) return
  let seconds = 3
  bar.showLoading({
    text: ' ',
    color: '#4ea397',
    maskColor: 'rgba(255, 255, 255, 0.4)'
  })
  let timer = setInterval(() => {
    seconds--
    if (seconds === 0) {
      clearTimeout(timer)
      bar.hideLoading()
    }
  }, 200)
}

// 图表标题设置
export const titleSet = ({timeRange, graphType, chartType}) => {
  const rangeDesc = {'day': '最近一天', 'week': '最近7天', 'month': '最近30天', 'year': '最近一年'}[timeRange]
  const graphDesc = {'trend': '变化趋势', 'errCount': '异常分布'}[graphType]
  const chartDesc = {'bp': '血压', 'bs': '血糖', 'steps': '步数', 'weight': '体重', 'heartRate': '心率', 'temperature': '体温', 'sleep': '睡眠'}[chartType]
  return {'text': `${rangeDesc}${chartDesc}${graphDesc}`, x: 'center'}
}

// 针对虚实线 与 线条 与 柱体设置
export const seriesSet = (graphType, name, arr) => {
  // '收缩压', systolicPressure, '#20a0ff'
  // '舒张压', diastolicPressure, '#35bf32'
  const {systolicPressure, diastolicPressure, bloodSugar} = defSeries1
  const {dip, sys, bs} = defEmphasis
  const type = {trend: 'line', errCount: 'bar'}[graphType]
  const color = {'收缩压': '#20a0ff', '舒张压': '#35bf32', '血糖': '#6282d5'}[name]
  const def = {'收缩压': systolicPressure, '舒张压': diastolicPressure, '血糖': bloodSugar}[name]
  const emphasis = {'收缩压': sys, '舒张压': dip, '血糖': bs}[name]

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

// 针对
export const seriesDefSet = (graphType, name, data, cs) => {
  if (!data) return
  const {heartRate} = defSeries1
  const type = {trend: 'line', errCount: 'bar'}[graphType]
  const def = {'心率': heartRate}[name]
  // const color = {'心率': '#6282d5'}[name]

  let sData = []
  sData.push({
    ...def, name,
    lineStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            cs.map((c) => ({offset: c.b, color: c.c}))
        ),
        width: 4
      }
    },
    type, data
  })
  return sData
}

// 图表Y轴线设置
export const yAxisSet = ({graphType, chartType}) => {
  let mLen = null
  let defYaxis = null

  let axisLabel= {
    axisLabel: {
      textStyle: {
        color: '#333',
        align: 'right'
      },
      inside: true,
      margin: -8
    }
  }

  if (chartType === 'bp') {
    mLen = {trend: [{name: 'mmHg', max: 200, min: 40, interval: 40, ...axisLabel,}],
      errCount: [{name: '次', max: 20, min: 0, interval: 5}]}[graphType]
    defYaxis = {trend: defYaxis1, errCount: defYaxis2}[graphType]
  }
  if (chartType === 'bs') {
    mLen = [{name: 'mmol/L', max: 35, min: 0, interval: 7, ...axisLabel,}]
    defYaxis = defYaxis1
  }
  if (chartType === 'heartRate') {
    mLen = [{name: '次/分', min: 40, max: 200, interval: 40, ...axisLabel,}]
    defYaxis = defYaxis1
  }

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
  const name = {'day': '时', 'month': '天'}[timeRange]

  return [{...xAxisLineSet(), name, data}]
}

// 图表X轴设置 一天中的所有分钟
export const xAxisMinutesSet = () => {
  const ls = new Date(moment().add(1, 'days').format('YYYY/MM/DD 00:00')).getTime()
  const fs = new Date(moment().format('YYYY/MM/DD 00:00')).getTime()
  return {
    type: 'time',
    name: '时',
    nameLocation: 'end',
    // interval: 10 * 60 * 1000,
    splitLine: {show: false},
    nameTextStyle: {
      fontSize: 14,
      color: '#000',
    },
    nameGap: 10,
    axisLine: {
      lineStyle: {
        color: '#ededed',
        width: 2
      }
    },
    axisTick: {
      inside: true,
    },
    axisLabel: {
      textStyle: {
        color: '#000',
      },
      formatter: function(value) {
        return value === ls ? '24' : value === fs ? '0' : moment(value).format('HH')
      }
    },
  }
}

// 图表X轴线设置
const xAxisLineSet = () => {
  return {
    nameLocation: 'end',
    nameTextStyle: {
      fontSize: 14,
      color: '#000',
    },
    nameGap: 10,
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
      // formatter: function (value, index) {
      //   if (index === 0 && value === 0) {
      //     return '时'
      //   } else {
      //     return value
      //   }
      // }
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

// 悬浮数据提示2
export const bsSooltipSet = ({chartType, bsName, tipArr}) => {
  const unit = {bs: 'mmol/L'}[chartType]
  return {
    trigger: 'axis',
    backgroundColor: '#404c5a',
    padding: 10,
    textStyle: {
      fontSize: 12
    },
    extraCssText: 'border-radius: 8px;',
    formatter: function (params) {
      let dName = ''
      let TName = ''
      params.map((p) => {
        // TName = p.name
        if (p.seriesName === '血糖' && p.data != '--') {
          dName = `${bsName}: ${p.data} ${unit}`
          TName = moment(tipArr[p.dataIndex]).format('YYYY-MM-DD HH:mm')
        }
      })
      if (dName) {
        return `<div style='line-height: 20px;'>${dName}<br/>${TName}</div>`
      }
    }
  }
}

// 悬浮数据提示2
export const defSooltipSet = ({chartType}) => {
  const unit = {heartRate: '次/分'}[chartType]
  return {
    trigger: 'axis',
    backgroundColor: '#404c5a',
    padding: 10,
    textStyle: {
      fontSize: 12
    },
    extraCssText: 'border-radius: 8px;',
    formatter: function (params) {
      let dName = ''
      let TName = ''
      params.map((p) => {
        // TName = p.name
        if (p.seriesName === '心率' && p.name !== '') {
          dName = `${p.name} ${unit}`
          TName = moment(p.axisValue).format('YYYY-MM-DD HH:mm')
        }
      })
      if (dName) {
        return `<div style='line-height: 20px;'>${dName}<br/>${TName}</div>`
      }
    }
  }
}

// 色值
export const visualMapSet = (age = 25) => {
  // exetimeLf燃
  // exetimeSup极限
  // exetimeCpm耐力
  // exetimeWarmUp热身
  const unit = 220 - age
  const normal = {v: unit * 0.5, c: '#1ad4d0'}
  const WarmUp = {v: unit * 0.5, c: '#ffe400'}
  const Cpm = {v: unit * 0.6, c: '#f26b08'}
  const Lf = {v: unit * 0.7, c: '#ffb500'}
  const Sup = {v: unit * 0.85, c: '#e51111'}

  // console.log('阀值', JSON.stringify([WarmUp,Cpm,Lf,Sup]) )

  return {
    show: false,
    pieces: [{
      gt: 0,
      lte: normal.v,
      color: normal.c
    }, {
      gt: WarmUp.v,
      lte: Cpm.v,
      color: WarmUp.c
    }, {
      gt: Cpm.v,
      lte: Lf.v,
      color: Cpm.c
    }, {
      gt: Lf.v,
      lte: Sup.v,
      color: Lf.c
    }],
    outOfRange: {
      color: Sup.c
    }
  }
}

export default {
  sooltipSet,
  bsSooltipSet,
  defSooltipSet,
  xAxisSet,
  xAxisMinutesSet,
  seriesSet,
  seriesDefSet,
  yAxisSet,
  titleSet,
  visualMapSet,
  loading,
}
