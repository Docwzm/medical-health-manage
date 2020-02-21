import {request} from './common'
import md5 from 'md5'
const DOCTOR_URL = '/doctor_service'
const apiList = {
  'SENDCODE': '/send_code',
  'CHECKCODE': '/check_code',
  'RESETPASSWORD': '/reset_password',
  'REGISTERCHECK': '/register/check',
}

//检查手机号
export const phoneCheckApi = ({mobile}) => {
  return request({
    url: `${DOCTOR_URL}${apiList.REGISTERCHECK}/${mobile}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}

//发送验证码
export const sendCodeApi = ({mobile}) => {
  return request({
    url: `${DOCTOR_URL}${apiList.SENDCODE}`,
    data: {mobile, type: 0},
  }).then((response) => {
    return response
  })
}

//检验验证码
export const checkCodeApi = ({mobile, code}) => {
  return request({
    url: `${DOCTOR_URL}${apiList.CHECKCODE}`,
    data: {mobile, code},
  }).then((response) => {
    return response
  })
}

//重置密码
export const resetPasswordApi = ({mobile, password, code}) => {
  return request({
    url: `${DOCTOR_URL}${apiList.RESETPASSWORD}`,
    data: {mobile, password: md5(password), code},
  }).then((response) => {
    return response
  })
}
