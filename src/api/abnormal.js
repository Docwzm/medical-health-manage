import {request} from './common'
const ABNORMAL_URL = '/abnormal_service'
const NOW = new Date().getTime()

// 忽略异常
export const ignoreAbnormalApi = (exceptionRecordIds = []) => {
  return request({
    url: `${ABNORMAL_URL}/ignore_exception`,
    data: {
      exceptionRecordIds
    }
  })
}

// 处理全部异常
export const dealAbnormalApi = (patientId) => {
  return request({
    url: `${ABNORMAL_URL}/cancel_all_read_mark/${patientId}`,
  })
}

// 获取最新的异常消息数 会查出未测量
export const getAbnormalMsgApi = (patientId) => {
  return request({
    url: `${ABNORMAL_URL}/get_dynamics/${patientId}`,
  })
}

// 获取最新的异常数据
export const getNewAbnormalApi = ({doctorId, patientId, handlerStatus = 1, type = 1, detectionType = [1], start = 0, count = 999}) => {
  return request({
    url: `${ABNORMAL_URL}/get_exception_records`,
    data: {
      doctorId,
      patientId,
      handlerStatus,
      type,
      detectionType,
      start,
      count,
    }
  })
}

// 获取预警值
export const getBpThreshold = ({patientId}) => {
  return request({
    method:'get',
    url:`/patient_service/health_manage/query_warning/${patientId}`,
  })
}
// 设置预警值
export const setThreshold = ({id, bpHL, bpHH, bpLL, bpLH, bpHOnOff = 1, bpLOnOff = 1}) => {
  return request({
    url:'/patient_service/health_manage/edit_warning',
    data: {
      id, bpHL, bpHH, bpLL, bpLH, bpHOnOff, bpLOnOff
    }
  })
}

// 获取预警值
export const getWarningApi = ({patientId}) => {
  return request({
    method:'get',
    url:`${ABNORMAL_URL}/warning_setting/get_warningset`,
    params: {
      patientId
    }
  })
}

// 设置预警值
export const setWarningApi = (data) => {
  return request({
    url:`${ABNORMAL_URL}/warning_setting/set_warningset`,
    data
  })
}

// 获取最新的测量数据
// export const getMeasureDataApi = ({pageIndex = 1, pageSize = 20, sort = 'measurementDate', order = 'desc', userId, begin = '', end = '', source = -1}) => {
//   return request({
//     url: `${apiUrl}/datachart_service/bpdata/hm/paged_list?requestId=${requestId}&pageIndex=${pageIndex}&pageSize=${pageSize}&sort=${sort}&order=${order}&userId=${userId}&begin=${begin}&end=${end}&source=${source}`,
//     common: true,
//     method: 'get',
//   })
// }
// 获取 测量数据
export const getMeasureDataApi = ({pageIndex = 1, pageSize = 10, sort = 'measurementDate', order = 'desc', userId, begin = '', end = '', source = -1}) => {
  return request({
    url: `/patient_service/bpdata/hm/paged_list`,
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      sort,
      order,
      userId,
      begin,
      end,
      source,
    }
  })
}

// 获取血压趋势变化图 getTrendGraphData PS 日： 'daily'  周： 'weekly'  月： 'monthly'  年 ： 'yearly'
export const getTrendGraphDataApi = ({type, userId}) => {
  console.log(type, userId)
  type = {day: 'daily', week: 'weekly', month: 'monthly', year: 'yearly'}[type]
  return request({
    url: `/patient_service/bpdata/hm/${type}_bloodpressure_average`,
    method: 'get',
    params: {
      day: NOW,
      userId
    }
  })
}

// 获取血压异常分布图 getErrCountGraphData PS 日： 'daily'  周： 'weekly'  月： 'monthly'  年 ： 'yearly'
export const getErrCountGraphDataApi = ({type, doctorId, patientId}) => {
  type = {day: 'daily', week: 'weekly', month: 'monthly', year: 'yearly'}[type]
  return request({
    url: `/abnormal_service/chart/${type}_abnormaldata_frequency`,
    method: 'get',
    params: {
      day: NOW,
      doctorId,
      patientId
    }
  })
}
