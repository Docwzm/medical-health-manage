/**
 * Created by 吴豪 on 2017/5/27.
 */
import {request} from './common'
const DATACHART_URL = '/patient_service'
const apiList = {
  'STEPSHISTORYLIST':'/walkdata/queryPedometerRecordHistory',
  'STEPSHOURLYCHARTDATA':'/walkdata/queryPedometerRecordListHourly',
  'STEPSDAYCHARTDATA':'/walkdata/queryPedometerRecordListDay'
}
//列表查询接口
export const queryStepsHistoryList = ({userId,begin,end,pageSize,pageNum}) => {
  return request({
    url: `${DATACHART_URL}${apiList.STEPSHISTORYLIST}`,
    data: {
      // userId:4520229,
      userId,
      begin,
      end,
      pageSize,
      pageNum
    }
  }).then((response) => {
    return response
  })
}
//获取一天的统计数据
export const queryStepsHourlyChartData = ({userId,beginDate,endDate}) => {
  return request({
    url: `${DATACHART_URL}${apiList.STEPSHOURLYCHARTDATA}`,
    data: {
      // userId:4520229,
      userId,
      beginDate,
      endDate
    }
  }).then((response) => {
    return response
  })
}
//获取多天的统计数据
export const queryStepsDayChartData = ({userId,beginDate,endDate}) => {
  return request({
    url: `${DATACHART_URL}${apiList.STEPSDAYCHARTDATA}`,
    data: {
      // userId:4520229,
      userId,
      beginDate,
      endDate
    }
  }).then((response) => {
    return response
  })
}
