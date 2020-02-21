/**
 * Created by 吴豪 on 2017/4/21.
 */
import {request} from './common'
const ABNORMAL_URL = '/abnormal_service'
const SYSMESSAGE_URL = '/doctor_service'
const PATIENT_URL= '/patient_service'
const IM_URL = '/im_service'
const apiList = {
  //异常数据消息
  'ABNORMALMSGLIST':'/search_exception_records',
  'IGNOREABNORMALMSG':'/handle_exception_by_person',
  'ABNORMALMSGITEMLIST':'/get_page_exception_records',
  //消息发送列表
  'GROUPMSGLIST':'/group_message/search',
  'GROUPMSGDETAIL': '/group_message/get_group_message_record_info',
  //关联申请列表
  'APPLYMSGLIST':'/get_link_requests',
  'AGREEHANDLE': '/batch_deal_association',
  'REFUSEHANDLE':'/deal_association',
  //对话消息列表
  'TALKMSGLIST':'/get_paging_im_msg',
  'IGNORETALKMSG':'/update_unread',
  'IGNOREALLTALKMSG':'/update_all_unread',

  //消息提示接口
  'TIPTALKNEWMSG':'/get_unread_dialogue_count',
  'TIPABNORMALNEWMSG':'/get_unread_count',
  'TIPAPPLYNEWMSG':'/get_unhandle',
}

//获取对话消息列表
export const getTalkMessageListApi = ({page = 1, pageSize = 20, patientName,doctorId,order,sort}) => {
  return request({
    url:`${PATIENT_URL}${apiList.TALKMSGLIST}`,
    data: {
      offset:(page-1)*pageSize,
      pageSize,
      patientName,
      doctorId,
      order,
      sort
    }
  }).then((response) => {
    return response
  })
}

//忽略对话消息操作
export const ignoreTalkMessageHandle = ({id}) => {
  return request({
    url: `${PATIENT_URL}${apiList.IGNORETALKMSG}`,
    data: {
      id
    }
  }).then((response) => {
    return response
  })
}

export const ignoreAllTalkMessageHandle = () => {
  return request({
    url:`${PATIENT_URL}${apiList.IGNOREALLTALKMSG}`,
    date: {

    }
  }).then((response) => {
    return response
  })
}

//获取关联申请消息列表
export const getApplyMessageListApi = ({page = 1, pageSize = 20, name, minRequestTime, maxRequestTime,doctorId,orderBy}) => {
  return request({
    url:`${PATIENT_URL}${apiList.APPLYMSGLIST}`,
    data: {
      offset: (page-1)*pageSize,
      pageSize,
      name,
      minRequestTime,
      maxRequestTime,
      doctorId,
      orderBy
    }
  }).then((response) => {
    return response
  })
}

//同意申请消息操作
export const agreeApplyMessageHandle = () => {
  return request({
    url: `${PATIENT_URL}${apiList.AGREEHANDLE}`,
    data: {
      agree:1
    }
  }).then((response) => {
    return response
  })
}

//同意/拒绝申请消息操作
export const refuseApplyMessageHandle = ({id,agree}) => {
  return request({
    url: `${PATIENT_URL}${apiList.REFUSEHANDLE}`,
    data: {
      id,
      agree
    }
  }).then((response) => {
    return response
  })
}

//获取异常数据消息列表接口
export const getExceptionMessageListApi = ({page = 1, pageSize = 20, patientName, startTime, endTime,doctorId,sort,order}) => {
  return request({
    url: `${ABNORMAL_URL}${apiList.ABNORMALMSGLIST}`,
    data: {
      offset: (page-1)*pageSize,
      pageSize,
      patientName,
      startTime,
      endTime,
      doctorId,
      sort,
      order
    }
  }).then((response) => {
    return response
  })
}
// 获取异常数据详情列表接口
export const getExceptionMessageItemListApi = ({page = 1, pageSize = 20,doctorId,patientId}) => {
  return request({
    url: `${ABNORMAL_URL}${apiList.ABNORMALMSGITEMLIST}`,
    data: {
      offset: (page-1)*pageSize,
      pageSize,
      type:1,
      doctorId,
      patientId
    }
  }).then((response) => {
    return response
  })
}
//忽略异常数据消息接口
export const ignoreExceptionMessageApi = ({doctorId,patientId,handlerStatus = 3}) => {
  return request({
    url : `${ABNORMAL_URL}${apiList.IGNOREABNORMALMSG}`,
    data: {
      doctorId,
      patientId,
      handlerStatus,
    }
  }).then((response) => {
    return response
  })
}
//获取消息发送消息列表接口
export const getSendedMessageListApi = ({page = 1, pageSize = 20, receiverName, startTime, endTime, sendStatus,sort = 'send_time',order = 'desc'}) => {
  return request({
    url: `${SYSMESSAGE_URL}${apiList.GROUPMSGLIST}`,
    data: {
      offset: (page-1)*pageSize,
      pageSize,
      receiverName,
      startTime,
      endTime,
      sendStatus,
      sort,
      order
    }
  }).then((response) => {
    return response
  })
}
//获取消息发送消息详情
export const getSendedMessageDetailApi = ({id}) => {
  return request({
    url: `${SYSMESSAGE_URL}${apiList.GROUPMSGDETAIL}/${id}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}

//获取对话消息的新消息提示信息
export const getTipNewMsgForTalk = () => {
  return request({
    url:`${IM_URL}${apiList.TIPTALKNEWMSG}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}
//获取异常数据的新消息提示信息
export const getTipNewMsgForAbnormal = () => {
  return request({
    url: `${ABNORMAL_URL}${apiList.TIPABNORMALNEWMSG}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}
//获取关联申请的新消息提示信息
export const getTipNewMsgForApply = () => {
  return request({
    url: `${PATIENT_URL}${apiList.TIPAPPLYNEWMSG}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}
