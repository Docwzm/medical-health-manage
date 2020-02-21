import {request} from './common'
const BS_URL = '/patient_service/bs/doctor'
const HEART_RATE = '/patient_service/heartratedata'

// 获取血糖趋势数据
export const getBloodSugarApi = ({userId, mealPeroid = 0, startTime, endTime}) => {
  return request({
    url: `${BS_URL}/get_meal_peroid_last_records`,
    data: {
      userId,
      mealPeroid,
      startTime,
      endTime,
    }
  })
}

// 获取血糖数据列表
export const getPeroidLastApi = ({userId, startTime, endTime, source, pageNo = 1, pageSize = 5}) => {
  return request({
    url: `${BS_URL}/get_days_meal_peroid_last_record`,
    data: {
      userId,
      startTime,
      endTime,
      source,
      pageNo,
      pageSize,
    }
  })
}

// 添加血糖数据
export const addPeroidLastApi = ({userId, measurementDate, glucoseConcentration, mealPeroid, memo}) => {
  return request({
    url: `${BS_URL}/add_record`,
    data: {
      userId,
      measurementDate,
      glucoseConcentration,
      mealPeroid,
      memo,
    }
  })
}
// 删除血糖数据
export const delPeroidLastApi = (id) => {
  return request({
    url: `${BS_URL}/delete_record/${id}`,
  })
}
// 编辑血糖数据
export const setPeroidLastApi = ({id, userId, mealPeroid, memo}) => {
  return request({
    url: `${BS_URL}/update_record`,
    data: {
      id,
      userId,
      mealPeroid,
      memo
    }
  })
}

// 获取常规心率数据
export const getHeartRateAnalysisApi = ({userId, dateStamp}) => {
  return request({
    url: `${HEART_RATE}/getListHeartRateAnalysis`,
    data: {
      userId,
      dateStamp,
    }
  })
}


// 获取常规心率列表 数据
export const getHeartRateAnalysisListApi = ({userId, startDate, endDate, pageSize = 5, pageNum = 1}) => {
  return request({
    url: `${HEART_RATE}/getPagingHeartRateAnalysis`,
    data: {
      userId,
      startDate,
      endDate,
      pageSize,
      pageNum,
    }
  })
}

// 获取动态心率数据
export const getHeartRateApi = ({userId, dateStamp}) => {
  return request({
    url: `${HEART_RATE}/getSportHeartRateAnalysis`,
    data: {
      userId,
      dateStamp,
    }
  })
}

// 获取动态心率列表 数据
export const getHeartRateListApi = ({userId, startDate, endDate, pageSize = 5, pageNum = 1}) => {
  return request({
    url: `${HEART_RATE}/getSportHeartRateAnalysisList`,
    data: {
      userId,
      startDate,
      endDate,
      pageSize,
      pageNum,
    }
  })
}
