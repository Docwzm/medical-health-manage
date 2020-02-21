/**
 * Created by 吴豪 on 2017/5/27.
 */
import moment from 'moment'

import {queryStepsHourlyChartData,queryStepsDayChartData} from '../../../../../../../../api/sleepChart'

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
      // let xLabel = param[0].axisValue
      let rawObj1 = param[1].data
      let rawObj2 = param[2].data
      return `${rawObj.labelTitle}${rawObj.labelContent}${rawObj1.labelContent}${rawObj2.labelContent}`
    },
    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
      type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
    }
  }
}

//颜色标注
const chartLegendInit = function () {
  return {
    data: [],
    top: 'bottom',
    left:'7%'
  }
}

//颜色标注
const chartLegend = function ({timeRange}) {

  return {
    ...chartLegendInit(),
    ...{
      data:timeRange=='day'?[]:["深睡","浅睡","清醒"]
    }
  }
}

//表格设置
const chartGrid = function () {
  return {
    left: '60',
    right: '0',
    bottom: '7%',
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
    data: ['','',''],
    axisTick: {
      alignWithLabel: true
    },
    ...chartPubAxis(),
  }

  return [xAxis]
}
//1天的Y轴设置
const chartYAxis = function () {
  let yAxis = {
    name: '',
    max: 10,
    min: 0,
    type: 'value',
    ...chartPubAxis(),
    ...{
      splitNumber: 1,
      axisLabel: {
        show : false,
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
//周月的y轴
const chartYAxisForWeekMonth = function () {
  let yAxis = {
    name: '小时',
    max: 1,
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
//初始化默认
const chartSeries = function () {
  let series = {
    name:'',
    type: 'bar',
    barWidth: '',
    itemStyle:{
      normal:{
        color:'#5C2AAB'
      }
    },
    data: []
  }
  return [series]
}

//图标数据及展现形式
const chartSeriesWeekOrMonth = function ({deepData, lightData, awakeData,timeRange}) {

  let seriesDay = {}

  if(timeRange == 'day') {
    seriesDay = {
      barWidth: '100%',
      barMaxWidth: "100%",
      barGap: "0%",
      barCategoryGap:"0",
      animation:false,
    }

  }


  let seriesDeep = {
    name:'深睡',
    type: 'bar',
    barWidth: '50%',
    stack: '睡眠',
    animation:true,
    itemStyle:{
      normal:{
        color:'#5C2AAB',
        borderColor:'#5C2AAB',
        shadowColor:'#5C2AAB',
        borderWidth:0,
        shadowBlur:0
      }
    },
    data: deepData || []
  }

  let seriesLight = {
    name:'浅睡',
    type: 'bar',
    barWidth: '50%',
    stack: '睡眠',
    animation:true,
    itemStyle:{
      normal:{
        color:'#9E82FF',
        borderColor:'#9E82FF',
        shadowColor:'#9E82FF',
        borderWidth:0,
        shadowBlur:0
      }
    },
    data: lightData || []
  }

  let seriesAwake = {
    name:'清醒',
    type: 'bar',
    barWidth: '50%',
    stack: '睡眠',
    animation:true,
    itemStyle:{
      normal:{
        color:'#DD53AC',
        borderColor:'#DD53AC',
        shadowColor:'#DD53AC',
        borderWidth:0,
        shadowBlur:0
      }
    },
    data: awakeData || []
  }

  // console.log([{...seriesDeep,...seriesDay},{...seriesLight,...seriesDay},{...seriesAwake,...seriesDay}])
  return [{...seriesDeep,...seriesDay},{...seriesLight,...seriesDay},{...seriesAwake,...seriesDay}]
}
//初始化图表
const initChart = async function () {
  const _this = this
  const weeks = {7: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六'}

  let seriesObj = await _this.getChartSeriesData()
  //数据
  _this.charData.series = seriesObj
  //x轴名称
  _this.charData.xAxis[0].name = {day: '时', week: '', month: '天', year: '月'}[_this.timeRange]

  _this.charData.yAxis = chartYAxis()
  _this.charData.legend = chartLegend({timeRange:_this.timeRange})
  // _this.charData.grid.right = '4%'

  if(_this.timeRange == "day") {//天
    // _this.charData.grid.right = '1%'
    if(seriesObj && seriesObj.length > 0 && seriesObj[0].data && seriesObj[0].data.length > 0) {
      let xAxisData = []
      for(let i=0,len=seriesObj[0].data.length;i<len;i++) {
        xAxisData.push("")
      }
      _this.charData.xAxis[0].data = xAxisData
    } else {
      _this.charData.xAxis[0].data = [""]
    }

  } else if(_this.timeRange == "week") {//周
    let datas = []
    for(let i=0;i<7;i++) {
      datas.push(weeks[moment().subtract(6-i, "days").format("E")])
    }
    _this.charData.xAxis[0].data = datas
    _this.charData.yAxis = chartYAxisForWeekMonth()
    //y轴最大值
    _this.charData.yAxis[0].max = _this.statis.ymax
  } else if(_this.timeRange == "month") {//月
    let datas = []
    for(let i=0;i<30;i++) {
      datas.push(moment().subtract(29-i, "days").format("D"))
    }
    _this.charData.xAxis[0].data = datas
    _this.charData.yAxis = chartYAxisForWeekMonth()
    //y轴最大值
    _this.charData.yAxis[0].max = _this.statis.ymax
  }

  // console.log(_this.charData)
  // console.log(JSON.stringify(_this.charData))
}
//图表数据重置
const getChartSeriesData = async function () {
  const _this = this
  const rangeCount = {'day': 0, 'week': 6, 'month': 29, 'year': 365}[_this.timeRange]

  let param = {
    userId : _this.Def.userId,
    startTime:parseInt(moment().format('x')),
    endDate: parseInt(moment().format('x')),
    beginDate: parseInt(moment().subtract(rangeCount,'days').format('x'))
  }
  let seriesDeepData = []
  let seriesLightData = []
  let seriesAwakeData = []
  let series = []
  let statisYmax = 12
  _this.isData = false

  _this.loading = true
  try {
    if(_this.timeRange == 'day') {
      let res = await queryStepsHourlyChartData(param)
      if(res && res.analysisDate && res.sleepTime) {
        _this.isData = false

        let deepSleepPer = getMinuteToPer({sumM:res.sleepHoursM,nowM:res.deepSleepHoursM})
        let awakePer = getMinuteToPer({sumM:res.sleepHoursM,nowM:res.awakeningHoursM})
        let lightSleepPer = 100 - deepSleepPer - awakePer

        _this.statis.heartRate = res.silentHeartRate || '--'
        _this.statis.sleepH = getSumMinuteToHour(res.sleepHoursM)
        _this.statis.sleepM = getSumMinuteToMinuteStr(res.sleepHoursM)
        _this.statis.deepSleepH = getSumMinuteToHour(res.deepSleepHoursM)
        _this.statis.deepSleepM = getSumMinuteToMinuteStr(res.deepSleepHoursM)
        _this.statis.lightSleepH = getSumMinuteToHour(res.shllowSleepHoursM)
        _this.statis.lightSleepM = getSumMinuteToMinuteStr(res.shllowSleepHoursM)
        _this.statis.awakeH = getSumMinuteToHour(res.awakeningHoursM)
        _this.statis.awakeM = getSumMinuteToMinuteStr(res.awakeningHoursM)
        _this.statis.deepSleepPer = deepSleepPer>0?`${deepSleepPer}%`:'--'
        _this.statis.awakePer =  awakePer>0?`${awakePer}%`:'--'
        _this.statis.lightSleepPer =  lightSleepPer>0?`${lightSleepPer}%`:'--'

        _this.statis.sleepDayBeginDate = res.sleepTime?moment(res.sleepTime).format("HH:mm"):''
        _this.statis.sleepDayEndDate = res.getupTime?moment(res.getupTime).format("HH:mm"):''

        try {
          let sleepDate = moment(res.sleepTime)
          let sleepValues = res.yValues.split(",")
          let sleepTypes = res.xLabels.split(",")
          if(sleepTypes.length == sleepValues.length) {

            let sdataObj = {
              value:0,
              labelTitle:'',
              labelContent:''
            }

            for(let i=0,len=sleepValues.length;i<len;i++) {
              let sleepValue = parseInt(sleepValues[i])
              let sleepType = parseInt(sleepTypes[i])
              let sleepLabelContent = sleepDate.format("HH:mm")
              sleepDate = sleepDate.add(sleepValue,'m')

              let labelContent = `${sleepLabelContent} - ${sleepDate.format("HH:mm")}`

              let sleepSDeepObj = {}
              let sleepSLightObj = {}
              let sleepSAwakeObj = {}

              switch(sleepType) {
                case 1:
                  sleepSAwakeObj = {
                    value : 5,
                    labelContent : `清醒<br>${labelContent}`,
                    itemStyle:{
                      normal:{
                        color:'#DD53AC',
                        borderColor:'#DD53AC',
                        shadowColor:'#DD53AC',
                        borderWidth:0,
                        shadowBlur:0
                      }
                    }
                  }
                  break;
                case 2:
                  sleepSLightObj = {
                    value : 5,
                    labelContent : `浅睡<br>${labelContent}`,
                    itemStyle:{
                      normal:{
                        color:'#9E82FF',
                        borderColor:'#9E82FF',
                        shadowColor:'#9E82FF',
                        borderWidth:1,
                        shadowBlur:0
                      }
                    }
                  }
                  break;
                case 3:
                  sleepSDeepObj = {
                    value : 4,
                    labelContent : `深睡<br>${labelContent}`,
                    itemStyle:{
                      normal:{
                        color:'#5C2AAB',
                        borderColor:'#5C2AAB',
                        shadowColor:'#5C2AAB',
                        borderWidth:1,
                        shadowBlur:0
                      }
                    }
                  }
                  break;
              }

              for(let j=0;j<sleepValue;j++) {
                seriesDeepData.push({
                  ...sdataObj,
                  ...sleepSDeepObj
                })
                seriesLightData.push({
                  ...sdataObj,
                  ...sleepSLightObj
                })
                seriesAwakeData.push({
                  ...sdataObj,
                  ...sleepSAwakeObj
                })
              }
            }
          }
        } catch(e) {
          console.log(e)
        }
      } else {
        _this.isData = true
      }

      series = chartSeriesWeekOrMonth({
        deepData: seriesDeepData,
        lightData: seriesLightData,
        awakeData: seriesAwakeData,
        timeRange: _this.timeRange
      })

    } else {
      let res = await queryStepsDayChartData(param)
      if(res && res.sleepRecords && res.sleepRecords.length > 0) {
          _this.isData = false
          let resMap = {}
          for(let i=0,len=res.sleepRecords.length;i<len;i++) {
            let sleepObj = res.sleepRecords[i]
            let idx = moment(sleepObj.analysisTime).format("YYYY-MM-DD")
            resMap[idx] = sleepObj
          }

          let precount = 30
          if (_this.timeRange == 'week') {
            precount = 7
          }

        for (let i = precount; i > 0; i--) {
          let idx = moment().subtract(i-1, 'days').format("YYYY-MM-DD")
          if (resMap[idx]) {
            let resObj = resMap[idx]
            let deepSleepH = getSumMinuteToFloatHour(resObj.deepSleepMin)
            let shallowSleepH = getSumMinuteToFloatHour(resObj.shallowSleepMin)
            let awakeningH = getSumMinuteToFloatHour(resObj.awakeningMin)

            seriesDeepData.push({
              value: deepSleepH,
              labelTitle: idx,
              labelContent:`<br>深睡:${getMinuteToChineseDate(resObj.deepSleepMin)}`
            })
            seriesLightData.push({
              value:shallowSleepH,
              labelContent:`<br>浅睡:${getMinuteToChineseDate(resObj.shallowSleepMin)}`
            })
            seriesAwakeData.push({
              value:awakeningH,
              labelContent:`<br>清醒:${getMinuteToChineseDate(resObj.awakeningMin)}`
            })

            if(statisYmax < deepSleepH + shallowSleepH + awakeningH){
              statisYmax = null
            }

          } else {
            seriesDeepData.push({
              value:0,
              labelTitle: idx,
              labelContent:`<br>深睡:${getMinuteToChineseDate(0)}`
            })
            seriesLightData.push({
              value:0,
              labelContent:`<br>浅睡:${getMinuteToChineseDate(0)}`
            })
            seriesAwakeData.push({
              value:0,
              labelContent:`<br>清醒:${getMinuteToChineseDate(0)}`
            })
          }
        }
      } else {
        _this.isData = true
      }

      series = chartSeriesWeekOrMonth({
        deepData: seriesDeepData,
        lightData: seriesLightData,
        awakeData: seriesAwakeData,
        timeRange: _this.timeRange
      })
    }
  } catch(e) {
    console.log(e)
    _this.isData = true
    series = chartSeriesWeekOrMonth({
      deepData: seriesDeepData,
      lightData: seriesLightData,
      awakeData: seriesAwakeData,
      timeRange: _this.timeRange
    })
  }
  _this.loading = false

  _this.statis.ymax = statisYmax
  return series
}
//小时 转 h小时m分钟
const getHourlyToChineseDate = function (hourly) {
  if(hourly && hourly > 0) {
    let h = Math.floor(hourly)
    let m = Math.ceil(hourly%1*60)
    let res = ""
    if(h > 0){
      res += `${h}小时`
    }
    if(m > 0) {
      res += `${m}分钟`
    }

    return res
  } else {
    return "无"
  }
}
//分钟 转 h小时m分钟
const getMinuteToChineseDate = function (minute) {
  if(minute && minute > 0) {
    let h = getSumMinuteToHour(minute)
    let m = getSumMinuteToMinute(minute)
    let res = ""

    if(h > 0){
      res += `${h}小时`
    }
    if(m > 0) {
      res += `${m}分钟`
    }

    return res
  } else {
    return "0分钟"
  }
}

//总分钟数获取小时数---带小数点的小时
const getSumMinuteToFloatHour = function (minute) {
  if(minute && minute > 0) {
    let h = Math.ceil(minute/60*100)/100
    return isNaN(h)?0:h
  }

  return 0
}

//总分钟数获取小时值
const getSumMinuteToHour = function (minute) {
  if(minute && minute > 0) {
    let h = Math.floor(Math.ceil(minute/60*100)/100)
    if(isNaN(h)) {
      h = 0
    }

    return h
  }

  return 0
}
//总分钟数获取分钟值
const getSumMinuteToMinute = function (minute) {
  if(minute && minute > 0 ) {
    let m = Math.ceil(minute%60)
    if(isNaN(m)) {
      m = 0
    }

    return m
  }

  return 0
}
//总分钟数获取分钟值  0返回--
const getSumMinuteToMinuteStr = function (minute) {
  let m = getSumMinuteToMinute(minute)
  return m>0?m:'--'
}

//获取百分比--0~100的数字
const getMinuteToPer = function ({sumM,nowM}) {
  if(sumM && sumM > 0 && nowM && nowM > 0) {
    let per = Math.round(nowM/sumM*100)
    if(isNaN(per)) {
      per = 0
    }

    return per
  }

  return 0
}

export default {
  initChart,
  setChartQuery,
  chartTooltip,
  chartGrid,
  chartXAxis,
  chartYAxis,
  chartSeries,
  chartLegend,
  chartLegendInit,
  getChartSeriesData
}
