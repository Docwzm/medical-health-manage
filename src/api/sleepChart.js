/**
 * Created by 吴豪 on 2017/5/27.
 */
import {request} from './common'
const DATACHART_URL = '/patient_service'
const apiList = {
  'SLEEPHISTORYLIST':'/sleepdata/getSleepRecordsByTimePage',
  'SLEEPHOURLYCHARTDATA':'/sleepdata/getDaySleepRecord',
  'SLEEPDAYCHARTDATA':'/sleepdata/getWeekOrMonthSleepRecords',
  'GETLASTRECORD':'/sleepdata/get_last_record'
}

// 列表查询接口
export const querySleepHistoryList = ({userId,startDate,endDate,pageSize,pageNum}) => {
  return request({
    url: `${DATACHART_URL}${apiList.SLEEPHISTORYLIST}`,
    data: {
      // userId:4519177,
      userId,
      startDate,
      endDate,
      pageSize,
      pageNum
    }
  }).then((response) => {
    return response
  })
}
//获取一天的统计数据
export const queryStepsHourlyChartData = ({userId,startTime }) => {
  return request({
    url: `${DATACHART_URL}${apiList.SLEEPHOURLYCHARTDATA}`,
    data: {
      // userId:4519177,
      userId,
      startTime
    }
  }).then((response) => {
    return response
  })
}
//获取多天的统计数据
export const queryStepsDayChartData = ({userId,beginDate,endDate}) => {
  return request({
    url: `${DATACHART_URL}${apiList.SLEEPDAYCHARTDATA}`,
    data: {
      // userId:4519177,
      userId,
      beginDate,
      endDate
    }
  }).then((response) => {
    return response
  })
}

//获取最后一条睡眠数据
export const getLastRecord = ({userId}) => {
  return request({
    url: `${DATACHART_URL}${apiList.GETLASTRECORD}`,
    method:'get',
    params: {
      // userId:4519177,
      userId,
    }
  })
}


