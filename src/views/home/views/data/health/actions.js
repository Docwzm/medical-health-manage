import echarts from 'echarts'
import {
  mapActions,
} from '../../../../../utils/vuex'
import {
  getOrganBaseApi,
  getUserBpApi,
} from '../../../../../api/data'
import {apiTips} from '../../../../../components/customer/actions'

const init = function ({state}) {
  const _this = this
  _this.doctorInfos = state['doctor-info']
}

//获取基础数据
const getOrganBase = async function ({}, id) {
  const _this = this
  try {
    const res = await getOrganBaseApi({organId: id})
    _this.baseData = {
      ...res,
    }
    sickTypeChart(_this, [res.sickType, res.sickType1, res.sickType2, res.sickType3, res.sickType4])
    _this.chart1Count = res.total
    if(res.total == 0) {
      _this.chart1Show = true
    }
  } catch (res) {
    apiTips(_this, `用户疾病分布 ${res.msg}`, '错误', 'error')
    console.log("chart error!")
  }
}

//血压分析
const getUserBp = async function ({}, id) {
  const _this = this
  try {
    const res = await getUserBpApi({organId: id})
    _this.bpData = {
      ...res,
    }
    bpTypeChart(_this, [res.bpLevel1, res.bpLevel2, res.bpLevel3, res.bpLevel4, res.bpLevel5, res.bpLevel6])
    bpCheckChart(_this, res.bpHabit)
    _this.chart2Count = res.total
    if(res.total == 0) {
      _this.chart2Show = true
    }

  } catch (res) {
    apiTips(_this, `血压分析 ${res.msg}`, '错误', 'error')
    console.log("chart error!")
  }
}

const sickTypeChart = function (_this, data) {
  _this.sickType = data

  chartInit('health-sickType-chart', ['无', '普通', '高血压', '糖尿病', '高血压+糖尿病'], '用户疾病类型分布', _this.sickType, ['#20A0FF', '#35BF32', '#F7BA2A', '#FF9404', '#FF4949', '#27C1C8'], '人数', 40, "{b} ：{c}人")
}

const bpTypeChart = function (_this, data) {
  _this.bpType = data
  chartInit('health-bpType-chart', ['低血压', '正常血压', '正常高值', '高血压1级', '高血压2级', '高血压3级'], '用户血压类型分布', _this.bpType, ['#F7BA2A', '#35BF32', '#35BF32', '#F7BA2A', '#FF4949', '#FF4949'], '测量笔数', 40, "{b} ：{c}笔")
}

const bpCheckChart = function (_this, data) {
  _this.chart3Show = true
  if (data) {
    var data2 = []
    for (var i = 0; i < 24; i++) {
      if (data[i]) {
        data2.push(data[i])
      } else {
        data2.push(0)
      }
    }
    data = data2
  } else {
    var data = []
    for (var i = 0; i < 24; i++) {
      data.push(0)
    }
  }
  _this.bpCheck = data

  var array = [],
      nums = 0
  for (var i = 0; i < 24; i++) {
    nums += parseInt(data[i])
    if(nums > 0) {
      _this.chart3Show = false
    }
    array.push(i + '')
  }
  _this.chart3Count = nums
  chartInit('health-bpCheck-chart', array, '用户血压测量习惯', _this.bpCheck, ['#20A0FF'], '测量笔数', 10, "{b}点：{c}笔测量数据", '时')
}

const chartInit = function (dom, legendData, name, seriesData, colors, yName, bWidth, formatter, xName) {
  var chart = echarts.init(document.getElementById(dom)),
      max = 120
  seriesData.forEach( (item) => {
    if(parseInt(item) > max) {
      max = item
    }
  })
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: formatter ? formatter : "{b} : {c}"
    },
    xAxis: [
      {
        type: 'category',
        data: legendData,
        name: xName ? xName : '',
        nameTextStyle: {
          fontSize: 14,
          color: '#000',
        },
        axisLine: {
          lineStyle: {
            color: '#EDEDED',
            width: 2,
          }
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
        },
        splitLine: {
          lineStyle: {
            color: '#EDEDED',
            width: 2,
          }
        },

      },
    ],
    yAxis: [
      {
        type: 'value',
        name: yName,
        min: 0,
        max: max > 120 ? null : max,
        splitNumber: 4,
        nameTextStyle: {
          fontSize: 14,
          color: '#000',
        },
        axisLine: {
          lineStyle: {
            color: '#EDEDED',
            width: 2,
          }
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#EDEDED',
            width: 2,
          }
        }
      },
      {
        axisLine: {
          lineStyle: {
            color: '#EDEDED',
            width: 2,
          }
        },
      }
    ],
    series: [
      {
        name: name,
        type: 'bar',
        barWidth: bWidth ? bWidth : 40,
        data: seriesData,
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = colors
              return colorList[params.dataIndex]
            },
          }
        },
      }
    ]
  })
}

const titleTipsShow = function ({}, type, {clientX, clientY, offsetX, offsetY, target}) {
  const _this = this
  console.log(target)
  switch (type) {
    case 1:
      _this.titleTipsTxt = '截止统计时间，包括高血压、糖尿病以及其他各种类型的疾病相应的的人数分布情况。'
      break
    case 2:
      _this.titleTipsTxt = '截止统计时间，包括正常血压、正常高值、高血压1级、高血压2级、高血压3级、低血压等五种血压等级相应的测量笔数的分布情况。'
      break
    case 3:
      _this.titleTipsTxt = '截止统计时间，用户在24小时中各个时间段的血压测量笔数分布情况，不同日期的同一时间段的测量笔数做累计处理。'
      break
  }
  _this.titleTipsTxt += '<br><br>注：当天新增的数据将在第二天统计，已被统计过的用户的历史测量数据即使被删除，则仍会被计入统计数据图表中。'

  var dom = document.getElementsByClassName('title-tips-win')[0],
      left = clientX - offsetX + 'px',
      top = clientY - offsetY + 42 + 'px'
  dom.style.cssText = `left:${left};top:${top}`
  _this.titleToggle = true
}

export default mapActions({
  init,
  titleTipsShow,
  getUserBp,
  getOrganBase,
})