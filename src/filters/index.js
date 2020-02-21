import moment from 'moment'
// 星期过滤器
export const weekFilter = (timestamp) => {
  const weeklist = ['周日', '星期一', '星期二', '星期三', '星期四', '星期五', '周六']
  return weeklist[moment(timestamp).weekday()]
}
// % 1000
export const kFilter = (d, n = 1000) => d/n
// 性别过滤器
export const sexFilter = (sex) => ['未知', '男', '女'][sex] || '未知'
// 疾病选择过滤
export const isSickFilter = (value = 0) => ['否', '是'][value] || '否'
// 疾病类型过滤
export const sickTypeFilter = (value = 0) => ['无', '其他', '高血压', '糖尿病', '高血压及糖尿病'][value] || '无'
// 血糖值类型
export const bsTypeFilter = (value = 0) => ['空腹', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '睡前'][value] || '空腹'
// 日期格式化过滤器
export const dateFilter = (date, pattern = 'YYYY-MM-DD') => moment(date).format(pattern)
// 日期-时分格式化
export const dateTimeFilter = (date, pattern = 'YYYY年MM月DD日 HH:mm') => moment(date).format(pattern)
//日期
export const dateTimeFilter2 = (date, pattern = 'YYYY-MM-DD HH:mm') => moment(date).format(pattern)
// 渠道过滤
export const patientSourceFilter = (value = 1) => ['医生app', '健康管理平台', '公众号'][value] || '无'
// 等级过滤器
export const levelFilter = (value = 1) => ['无', '低', '中', '高'][value] || '无'
// 数据来源
export const dataSource = (value = 0) => ['设备采集', '手工添加'][value] || '无'
// 省市过滤
export const pcaFilter = (pId = '', cId = '', prs = []) => prs.filter((p) => pId === p.id).map(({name: prName, citys}) => {
  const {name} = citys.filter((c) => c.id === cId).find(({name}) => name)
  return `${prName} ${name}`
}).toString() || '无'
// 转分分钟数为 **小时 **分钟 格式
export const toMinuteFilter = (minutes) => (Math.floor(minutes / 60) + " 小时 " + (minutes % 60) + " 分钟");

// 转分分钟数为 **小时 **分钟 （0分钟时不显示分钟） 格式 不够1小时 为 ***分钟
export const toMinuteForHoursFilter = (minutes = 0, gaps = ' ') => {
  return (minutes >= 60) ? ((minutes % 60)>0?`${Math.floor(minutes / 60)}${gaps} 小时 ${(minutes % 60)}${gaps}分钟`:`${Math.floor(minutes / 60)}${gaps} 小时`) : `${minutes}${gaps}分钟`
}

//bmi
export const bmiFilter = (val) => {
  if(val < 18.5) {
    return `偏瘦`
  }else if(val >= 18.5 && val <= 23.9) {
    return `理想`
  } else if(val >= 24 && val <= 28) {
    return `偏胖`
  } else {
    return `肥胖`
  }
}

export const weightToFixed = (val) => {
  if(val) {
    var newVal = val.toFixed(1)
    if(newVal.split('.')[1] == 0) {
      return newVal.split('.')[0]
    } else {
      return newVal
    }
  }
}
