import {request} from './common'
import md5 from 'md5'
const DOCTORSERVICE = '/doctor_service',
    DOCTORDEVICE = '/doctor_service',
    PATIENT_SERVICE = '/patient_service',
    DOCTORAP_SERVICE = '/doctor_service'

const apiList = {
  'DOCTORLIST': '/doctor_admin/get_doctor_list',
  'TITLE': '/get_title',
  'DEPARTMENT': '/get_department',
  'ORGAN': '/doctor_admin/get_organ_list',
  'CREATE': '/doctor_admin/add_doctor',
  'DELETE': '/doctor_admin/delete_doctor',
  'EDITOR': '/doctor_admin/update_doctor',
  'DETAIL': '/doctor_admin/get_doctor_detail',
  'RESET': '/doctor_admin/reset_psw',
  'ORDER': '/doctor_admin/order_list',
  'GAINS': '/doctor_admin/get_gains',
  'DEVICELIST': '/doctor_device/get_device_list',
  'DEVICEDETAIL': '/doctor_device/device_details',
  'GETQCODE': '/doctor_patient/get_doctorqrcode',
}

//获取医生列表
export const getDoctorListApi = ({offset = 0, page = 1, pageSize = 20, doctorName, organId, departmentId, titleId, mobile, sort, order}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.DOCTORLIST}`,
    data: {
      page,
      pageSize,
      doctorName,
      organId,
      departmentId,
      titleId,
      mobile,
      sort,
      order,
    }
  })
}

//获取职称列表
export const getDoctorTitlesApi = ({offset = 0, page = 1, pageSize = 999}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.TITLE}`,
    data: {
      offset,
      page,
      pageSize,
    }
  })
}

//获取科室列表
export const getDepartmentApi = ({offset = 0, page = 1, pageSize = 999}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.DEPARTMENT}`,
    data: {
      offset,
      page,
      pageSize,
    }
  })
}

//获取机构列表
export const getOrganListApi = ({offset = 0, page = 1, pageSize = 999} = {}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.ORGAN}`,
    method: 'get',
  })
}

//新建医生
export const createDoctorApi = ({name, headimgurl, hospitalId, hospitalName, departmentId, departmentName, titleId, title, mobile, roleType = 1, password, sex = 1}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.CREATE}`,
    data: {
      name,
      headimgurl,
      hospitalId,
      hospitalName,
      departmentId,
      departmentName,
      titleId,
      title,
      mobile,
      roleType,
      sex,
      password: md5(password),
    }
  })
}

//编辑医生
export const editorDoctorApi = ({id, name, headimgurl, hospitalId, hospitalName, titleId, title, departmentName, departmentId,}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.EDITOR}`,
    data: {
      id,
      name,
      headimgurl,
      hospitalId,
      hospitalName,
      titleId,
      title,
      departmentName,
      departmentId,
    }
  })
}

//删除医生
export const deleteDoctorApi = ({doctorId}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.DELETE}/${doctorId}`,
  })
}

//获取医生详情
export const getDoctorDetailApi = ({doctorId}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.DETAIL}/${doctorId}`,
    method: 'get',
  })
}

//重置医生账号密码
export const restDoctorPasswordApi = ({doctorId}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.RESET}/${doctorId}`,
    method: 'get',
  })
}

//医生订单列表
export const getOrderListApi = ({page = 1, pageSize = 20, sort, order, name, mobile, beginTime, endTime, orderStatus, doctorId}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.ORDER}`,
    data: {
      page,
      pageSize,
      sort,
      order,
      name,
      mobile,
      beginTime,
      endTime,
      orderStatus,
      doctorId,
    }
  })
}

//医生订单收益信息
export const getGainsApi = ({doctorId}) => {
  return request({
    url: `${DOCTORSERVICE}${apiList.GAINS}/${doctorId}`,
    method: 'get',
  })
}

//医生设备列表
export const getDeviceListApi = ({doctorId}) => {
  return request({
    url: `${DOCTORDEVICE}${apiList.DEVICELIST}/${doctorId}`,
    method: 'get',
  })
}

//获取设备详情
export const getDeviceDetailApi = (deviceId) => {
  return request({
    url: `${DOCTORDEVICE}${apiList.DEVICEDETAIL}/${deviceId}`,
    method: 'get',
  })
}

//获取管理员下的患者
export const getPatientsListApi = ({name, sex, minAge, maxAge, sickType, bpLevel, doctorId, organId, patientSource, page=1, offset, pageSize=20, orderBy, minCreated, maxCreated, childOrganId, }) => {
  return request({
    url: `${PATIENT_SERVICE}/stat_patient/query`,
    data: {
      name,
      sex,
      minAge,
      maxAge,
      sickType,
      bpLevel,
      doctorId,
      organId,
      patientSource,
      page,
      offset,
      pageSize,
      orderBy,
      minCreated,
      maxCreated,
      childOrganId,
    },
  })
}

//获取医生二维码地址
export const getDoctorQrcodeApi = () => {
  return request({
    url: `${DOCTORAP_SERVICE}${apiList.GETQCODE}`,
    method: 'get',
  })
}

//通过医生id获取二维码地址
export const getDoctorQrcodeByIdApi = ({doctorId}) => {
  return request({
    url: `${DOCTORAP_SERVICE}${apiList.GETQCODE}/${doctorId}`,
    method: 'get',
  })
}
