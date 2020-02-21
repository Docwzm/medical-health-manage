import {request} from './common'
const BP_URL = '/patient_service/bpdata'

// 获取指定用户的最值
export const getPatientBpMostApi = (userId) => {
  return request({
    method: 'get',
    url: `${BP_URL}/hm/extremely_bloodpressure/${userId}`,
  })
}

// 添加血压测量数据
export const addBpRecordApi = ({patientId, measurementDate, systolicPressure, diastolicPressure, heartRate, remark, movementError = 0, temperature = 0}) => {
  return request({
    url: '/patient_service/bpdata/add_bp_record',
    data: {
      patientId,
      measurementDate,
      systolicPressure,
      diastolicPressure,
      heartRate,
      remark,
      movementError,
      temperature,
    }
  })
}



// 更新血压测量数据
export const setBpRecordApi = (data) => {
  return request({
    url: '/patient_service/bpdata/update_bp_record',
    data
  })
}

// 删除血压测量数据
export const delBpRecordApi = (id) => {
  return request({
    method: 'get',
    url: `/patient_service/bpdata/delete_bp_record/${id}`,
  })
}

// 获取最高
export const getHigheBpApi = ({userId, year, month, day, week}) => {
  return request({
    url: `${BP_URL}/get_highest_bp_record`,
    data: {
      userId,
      year,
      month,
      day,
      week
    }
  })
}
// 获取最低
export const getLowestBpApi = ({userId, year, month, day, week}) => {
  return request({
    url: `${BP_URL}/get_lowest_bp_record`,
    data: {
      userId,
      year,
      month,
      day,
      week
    }
  })
}
