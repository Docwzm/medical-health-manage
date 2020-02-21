/**
 * Created by 吴豪 on 2017/5/31.
 */

const unitName = function () {
  return {day:'日', week: '周', month:'月', year:'年'}[this.timeRange]
}
const tipName = function () {
  return {day: '时', week: '周', month: '天', year: '月'}[this.timeRange]
}

const timeRange = function () {
  return this.$route.query.timeRange ||  'day'
}

const chartType = function () {
  return this.$route.query.chartType || 'steps'
}

const dateRangeTabs = function () {
  return [
    {label: '1天', name: 'day'},
    {label: '7天', name: 'week'},
    {label: '30天', name: 'month'},
//            {label: '1年', name: 'year'}
  ]
}
const title = function () {
  const {timeRange} = this
  const rangeDesc = {'day': '最近1天', 'week': '最近7天', 'month': '最近30天', 'year': '最近1年'}[timeRange]
  return `${rangeDesc}步数变化趋势`
}
const tip = function () {
  return '暂无测量数据'
}

const graphTypeName = function () {
  return  '步数变化趋势'
}

export default {
  graphTypeName,
  tip,
  title,
  dateRangeTabs,
  chartType,
  timeRange,
  tipName,
  unitName,
}
