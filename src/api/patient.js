import {request} from './common'
const PATIENT_URL = '/patient_service/health_manage'

// 医生账户获取患者信息
export const getPatientInfo = (id) => {
  return request({
    method: 'get',
    url: `${PATIENT_URL}/queryuser_byid/${id}`,
  })
}

// 管理员账户获取患者信息
export const getPatient = ({id, organId, doctorId} = {}) => {
  return request({
    method: 'post',
    url: `/patient_service/stat_patient/getById`,
    data: {
      id,
      organId,
      doctorId
    }
  })
}

// 管理员账户获取患者信息
export const getPatientAs = (id) => {
  return request({
    method: 'get',
    url: `/patient_service/getById/${id}`,
  })
}

// 编辑患者信息
export const editPatientInfo = (data) => {
  return request({
    url: `${PATIENT_URL}/edituser`,
    data: {
      ...data
    }
  })
}

// 编辑患者备注
export const editPatientRemarkApi = ({id, remark}) => {
  return request({
    url: `${PATIENT_URL}/edituserremark`,
    data: {
      id,
      remark
    }
  })
}

// 新增患者信息
export const addPatientInfo = (data) => {
  return request({
    url: `${PATIENT_URL}/adduser`,
    data: {
      ...data
    }
  })
}

// 删除患者信息
export const delPatientInfo = (id) => {
  return request({
    url: `${PATIENT_URL}/deluser/${id}`,
  })
}

// 编辑患者备注信息
export const createPatientRemark = ({id, remark}) => {
  return request({
    url: `${PATIENT_URL}/edituserremark`,
    data: {
      id,
      remark
    }
  })
}

// 编辑患者备注信息
export const getPatientCounts = ({id}) => {
  return request({
    url: `/patient_service/stat_patient/data_count`,
    data: {
      id,
    }
  })
}
