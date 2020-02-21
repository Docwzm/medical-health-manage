import { request } from './common'
const PATIENT_DEVICE = '/doctor_service/patient_device'
const DOCTOR_DEVICE = '/doctor_service/doctor_device'

// 获取患者设备信息
export const getPatientDeviceApi = (userId) => {
  return request({
    isAppType: false,
    url: `${PATIENT_DEVICE}/get_patientdevice/${userId}`,
  })
}

// 获取医生设备信息
export const getDoctorDeviceApi = (doctorId) => {
  return request({
    url: `${DOCTOR_DEVICE}/get_device`,
    data: {
      doctorId
    }
  })
}
