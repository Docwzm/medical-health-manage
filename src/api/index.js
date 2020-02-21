import {request} from './common'
const DOCTOR_URL = '/doctor_service',
    ABNORMAL_URL = '/abnormal_service',
    IM_URL = '/im_service',
    PATIENT_URL = '/patient_service',
    FOLLOWUP_URL = '/followup_service',
    SCHEDULE_URL = '/schedule_service'
const apiList = {
  'GETEXCEPTION': '/get_exception_count_by_doctor',
  'IM': '/get_unread_count',
  'GETUNHANDLE': '/get_unhandle',
  'GETFOLLOWUP': '/get_followup_record_count/overdue',
  'GETFOLLOW': '/get_followup_record_count/this_week',
  'GETCOUNT': '/get_last_few_days_count',
  'STATPATIENTCOUNT': '/stat_patient/count',
  'GROUPCOUNT': '/health_manage/query_group_count',
  'GETDOCTORDATASTAT': '/get_doctor_data_stat',
}
// 获取异常
export const getExceptionApi = (id) => {
  return request({
    url: `${ABNORMAL_URL}${apiList.GETEXCEPTION}`,
    data: {
      doctorId: id,
      detectionType: [1],
      type: 1,
    },
  }).then((response) => {
    return response
  })
}
// 获取对话
export const getImApi = () => {
  return request({
    url: `${IM_URL}${apiList.IM}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}
// 获取关联申请
export const getUnhandleApi = () => {
  return request({
    url: `${PATIENT_URL}${apiList.GETUNHANDLE}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}

// 获取过期随访
export const getFollowApi = () => {
  return request({
    url: `${FOLLOWUP_URL}${apiList.GETFOLLOWUP}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}

// 获取本周随访
export const getFollowRecordApi = () => {
  return request({
    url: `${FOLLOWUP_URL}${apiList.GETFOLLOW}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}

// 获取指定日程
export const getDayCountApi = () => {
  return request({
    url: `${SCHEDULE_URL}${apiList.GETCOUNT}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}

// 获取患者总数接口
export const getStatPatientCoutApi = ({doctorId}) => {
  return request({
    url: `${PATIENT_URL}${apiList.STATPATIENTCOUNT}`,
    data: {
      doctorId
    },
  }).then((response) => {
    return response
  })
}

//获取分组总数
export const getGroupCountApi = () => {
  return request({
    url: `${PATIENT_URL}${apiList.GROUPCOUNT}`,
  }).then((response) => {
    return response
  })
}

//获取医生数据统计
export const getDoctorDataStatApi = () => {
  return request({
    url: `${PATIENT_URL}${apiList.GETDOCTORDATASTAT}`
  }).then((response) => {
    return response
  })
}