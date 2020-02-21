/**
 * Created by 吴豪 on 2017/5/27.
 */
import moment from 'moment'

import {queryStepsHourlyChartData,queryStepsDayChartData} from '../../../../../../../../api/stepsChart'

//条件按钮跳转
const setChartQuery = function (tab, queryName){
  const _this = this
  _this.$router.replace({query: {...this.$route.query, [queryName]: tab.name}})
  _this.initChart()
}

//提示设置
const chartTooltip = function () {
  return {
    trigger: 'axis',
    formatter: function (param) {
      let rawObj = param[0].data
      let xLabel = param[0].axisValue
      return `${xLabel}${rawObj.label}<br>${rawObj.steps}步<br>${rawObj.dist}公里&nbsp;&nbsp;${rawObj.calor}大卡`
    },
    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
      type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
    }
  }
}
//表格设置
const chartGrid = function () {
  return {
    left: '60',
    right: '0',
    bottom:'7%',
    containLabel: true
  }
}
//XY轴公用设置
const chartPubAxis = function () {
  return {
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
  }
}
//X轴设置
const chartXAxis = function () {
  let xAxis = {
    name: '',
    nameLocation: 'end',
    nameGap: 10,
    data: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    axisTick: {
      alignWithLabel: true
    },
    ...chartPubAxis(),
  }

  return [xAxis]
}
//Y轴设置
const chartYAxis = function () {
  let yAxis = {
    name: '千步',
    max: 8,
    min: 0,
    type: 'value',
    ...chartPubAxis(),
    ...{
      axisLabel: {
        textStyle: {
          color: '#333',
          align: 'right'
        },
        inside: true,
        margin: -8
      }
    }
  }

  let yAxis1 = {
    axisLine: {
      lineStyle: {
        color: '#EDEDED',
        width: 2,
      }
    },
  }

  return [yAxis,yAxis1]
}
//图标数据及展现形式
const chartSeries = function () {

  let series = {
    type: 'bar',
    barWidth: '50%',
    data: []
  }
  return series
}

// 初始化图表
const initChart = async function () {
  const _this = this
  const weeks = {7: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六'}

  let seriesData = await _this.getChartSeriesData()

  //数据
  _this.charData.series.data = seriesData
  //x轴名称
  _this.charData.xAxis[0].name = {day: '时', week: '', month: '天', year: '月'}[_this.timeRange]

  if(_this.timeRange == "day") {//天
      _this.charData.xAxis[0].data = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  } else if(_this.timeRange == "week") {//周
    let datas = []
    for(let i=0;i<7;i++) {
      datas.push(weeks[moment().subtract(6-i, "days").format("E")])
    }
    _this.charData.xAxis[0].data = datas
  } else if(_this.timeRange == "month") {//月
    let datas = []
    for(let i=0;i<30;i++) {
      datas.push(moment().subtract(29-i, "days").format("D"))
    }
    _this.charData.xAxis[0].data = datas
  }

  //y轴最大值
  _this.charData.yAxis[0].max = _this.statis.ymax
}

const getChartSeriesData = async function () {
    const _this = this
    const rangeCount = {'day': 0, 'week': 6, 'month': 29, 'year': 364}[_this.timeRange]

    let param = {
      userId : _this.Def.userId,
      endDate: moment().format('YYYY-MM-DD'),
      beginDate: moment().subtract(rangeCount,'days').format('YYYY-MM-DD')
    }

    let seriesData = []
    let statisSteps = 0
    let statisDist = 0
    let statisConsume = 0
    let statisYmax = 8

    _this.loading = true
    _this.isData = false
    try {
      if(_this.timeRange == 'day') {
        let res = await queryStepsHourlyChartData(param)
        if(res && res.length > 0) {
          let {calories,distance,step} = res[0]

          let calors = calories.split(",")
          let dists = distance.split(",")
          let steps = step.split(",")

          let preCalorVal = 0
          let preDistVal = 0
          let preStepVal = 0
          for(let i=0,len=steps.length;i<len;i++) {
            let stepObj = steps[i] || 0
            let distObj = dists[i] || 0
            let calorObj = calors[i] || 0

            if(stepObj > 0) {
              stepObj = stepObj - preStepVal
              preStepVal = steps[i]
            }

            if(distObj > 0) {
              distObj = distObj - preDistVal
              preDistVal = dists[i]
            }

            if(calorObj > 0) {
              calorObj = calorObj - preCalorVal
              preCalorVal = calors[i]
            }

            stepObj = Math.round(stepObj*100)/100
            distObj = Math.round(distObj*100)/100
            calorObj = Math.round(calorObj*100)/100

            let obj = {
              value: stepObj/1000,
              dist: distObj/1000,
              calor: calorObj,
              steps:stepObj,
              label: '时'
            }

            seriesData.push(obj)

            if(Math.ceil(obj.value) > statisYmax) {
              statisYmax = null
            }
          }

          statisSteps = parseFloat(preStepVal)
          statisDist = Math.round(parseFloat(preDistVal/1000)*100)/100
          statisConsume = parseFloat(preCalorVal)

          _this.isData = false
        } else {
          _this.isData = true
        }
      } else {
        let res = await queryStepsDayChartData(param)

        if(res && res.length > 0) {

          let resMap = {}
          for (let i = 0, len = res.length; i < len; i++) {
            let obj = res[i]
            let idx = moment(obj.measurementTime).format("YYYY-MM-DD")
            resMap[idx] = obj
          }

          let precount = 30
          let label = '日'
          if (_this.timeRange == 'week') {
            precount = 7
            label = ''
          }

          for (let i = precount; i > 0; i--) {
            let idx = moment().subtract(i-1, 'days').format("YYYY-MM-DD")
            let obj = {
              value: '',
              dist: 0,
              calor: 0,
              steps: 0,
              label: label
            }

            if (resMap[idx]) {
              var idxObj = resMap[idx]
              obj = {
                value: idxObj["step"] / 1000,
                dist: idxObj["distance"] / 1000,
                calor: idxObj["calories"],
                steps: idxObj["step"],
                label: label
              }
            }

            seriesData.push(obj)

            statisSteps += parseFloat(obj['steps'])
            statisDist += parseFloat(obj['dist'])
            statisConsume += parseFloat(obj['calor'])

            if (Math.ceil(obj.value) > statisYmax) {
              statisYmax = null
            }
          }

          _this.isData = false
        } else {
          _this.isData = true
        }

      }

    } catch(e) {
      console.log(e)
      _this.isData = true
    }

    _this.statis.steps = Math.round(statisSteps*100)/100 || "--"
    _this.statis.dist = Math.round(statisDist*100)/100 || "--"
    _this.statis.consume = Math.round(statisConsume*100)/100 || "--"
    _this.statis.ymax = statisYmax

    _this.loading = false
    return seriesData
}

export default {
  initChart,
  setChartQuery,
  chartTooltip,
  chartGrid,
  chartXAxis,
  chartYAxis,
  chartSeries,
  getChartSeriesData
}
