import {request} from './common'
const DATACHART = '/patient_service'
const apiList = {
    'GETORGANUSER': '/organ_user_analysis_data/get_organ_base',
    'ACTIVEUSER': '/organ_user_analysis_data/get_organ_active_user',
    'NEWADDUSER': '/organ_user_analysis_data/get_organ_new_add_user',
    'USERBINDDEVICE': '/organ_user_analysis_data/get_organ_user_bind_device',
    'USERBP': '/organ_user_analysis_data/get_organ_user_bp',
    'UPDATEDAT': '/organ_user_analysis_data/get_organ_user_upload_data',
    }

//机构用户分析
export const getOrganBaseApi = ({organId}) => {
  return request({
    url: `${DATACHART}${apiList.GETORGANUSER}`,
    data: {
      organId,
    }
  })
}

//活跃用户分析
export const getOrganActiveUserApi = ({organId}) => {
  return request({
    url: `${DATACHART}${apiList.ACTIVEUSER}`,
    data: {
      organId,
    }
  })
}

//新增用户分析
export const getNewAddUserApi = ({organId}) => {
  return request({
    url: `${DATACHART}${apiList.NEWADDUSER}`,
    data: {
      organId,
    }
  })
}

//绑定设备分析
export const getUserBindDeviceApi =({organId}) => {
  return request({
    url: `${DATACHART}${apiList.USERBINDDEVICE}`,
    data: {
      organId,
    }
  })
}

//用户血压分析
export const getUserBpApi =({organId}) => {
  return request({
    url: `${DATACHART}${apiList.USERBP}`,
    data: {
      organId,
    }
  })
}

//上传数据分析
export const getUpdateDataApi = ({organId}) => {
  return request({
    url: `${DATACHART}${apiList.UPDATEDAT}`,
    data: {
      organId,
    }
  })
}
