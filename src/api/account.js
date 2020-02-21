import {request, getlocalStorage, savelocalStorage} from './common'
import md5 from 'md5'
const DOCTOR_URL = '/doctor_service',
    FOLLOW_URL = '/followup_service',
    DOCTORAPP_URL = '/doctor_service',
    DOCTORADMIN_URL = '/doctor_service'
const apiList = {
  'LOGIN': '/healthmanagement/login',
  'LOGINOUT': '/login_out',
  'RESETPASSWORD': '/update_password',
  'GETDOCTOR': '/get_current_doctor',
  'GETASSISTANTCOUNT': '/get_assistant_count',
  'GETQRCODE': '/get_qrcode',
  'GETFOLLOW': '/get_followup_record_count/this_doctor',
  'GETPATIENT': '/get_patient_count',
  'GETADMIN': '/get_current_admin',
  'GETORGANDETAIL': '/supportplatform/organ/detail/',
  'UPDATEPASSWORD': '/doctor_admin/update_password'
}
// 登录
export const loginApi = ({username, password, roleType}) => {
  return request({
    url: `${DOCTOR_URL}${apiList.LOGIN}`,
    data: {username, password, roleType},
  }).then((response) => {

    const {accessToken} = response
    if (accessToken) {
      savelocalStorage('accessToken', accessToken)
      savelocalStorage('roleType', roleType)
    }
    return response
  })
}

// 登出
export const logoutApi = () => {
  return request({
    url: `${DOCTOR_URL}${apiList.LOGINOUT}`,
  }).then((response) => {
    return response
  })
}

//修改密码
export const updatePasswordApi = ({oldPassword, newPassword}) => {
  const url = getlocalStorage('roleType') != 1 || !getlocalStorage('roleType') ? `${DOCTOR_URL}${apiList.RESETPASSWORD}` : `${DOCTORADMIN_URL}${apiList.UPDATEPASSWORD}`
  return request({
    url: url,
    data: {oldPassword: md5(oldPassword), newPassword: md5(newPassword)},
  })
}

//获取医生信息
export const getDoctorApi = () => {
  if (getlocalStorage('roleType') != 1 || !getlocalStorage('roleType')) {
    return request({
      url: `${DOCTOR_URL}${apiList.GETDOCTOR}`,
    }).then((response) => {
      return response
    })
  }
}

//获取医生助手
export const getAssistantCountAPi = () => {
  return request({
    url: `${DOCTOR_URL}${apiList.GETASSISTANTCOUNT}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}

//获取医生二维码ticket
export const getQrCodeApi = () => {
  return request({
    url: `${DOCTOR_URL}${apiList.GETQRCODE}`,
  }).then((response) => {
    return response
  })
}


//获取医生随访次数
export const getFollowCountApi = () => {
  return request({
    url: `${FOLLOW_URL}${apiList.GETFOLLOW}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}

//获取医生患者数
export const getPatientCountApi = () => {
  return request({
    url: `${DOCTOR_URL}${apiList.GETPATIENT}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}

//获取管理员信息
export const getAdminApi = () => {
  return request({
    url: `${DOCTOR_URL}${apiList.GETADMIN}`,
  }).then((response) => {
    return response
  })
}

//机构详情
export const getOrganDetailApi = ({organId}) => {
  return request({
    url: `${DOCTORAPP_URL}${apiList.GETORGANDETAIL}${organId}`,
    method: 'get',
  }).then((response) => {
    return response
  })
}
