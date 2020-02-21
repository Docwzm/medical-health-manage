import {request} from './common'
const CHAT_URL = '/im_service'

// 获取IM签名 token
export const getIMApi = ({appType, imType, userType, userId, name}) => {
  return request({
    url: `${CHAT_URL}/get_account`,
    data: {
      appType,
      imType,
      userType,
      userId,
      name
    }
  })
}

// 获取群组信息
export const getTeamApi = ({tid, teamName, doctorId, doctorName, patientName, patientId, assistantId}) => {
  return request({
    url: `${CHAT_URL}/get_team`,
    data: {
      tid,
      teamName,
      doctorId,
      doctorName,
      patientName,
      patientId,
      assistantId
    }
  })
}

// 获取IM群组 聊天记录
export const getTeamHisApi = ({tid, endTime, count = 20}) => {
  return request({
    url: `${CHAT_URL}/get_team_msg`,
    data: {
      tid,
      endTime,
      count
    }
  })
}

// 上传查看记录时间 以便统计是否未读
export const upDateApi = ({tid, accId, readTime}) => {
  return request({
    url: `${CHAT_URL}/update_last_readtime`,
    data: {
      tid,
      accId,
      readTime: (readTime + 1000)
    }
  })
}

// 按天获取IM群组 聊天记录
export const getTeamDayHisApi = ({tid, time}) => {
  return request({
    url: `${CHAT_URL}/get_team_msg_day`,
    data: {
      tid,
      time,
    }
  })
}

// 按月获取IM群组 聊天记录
export const getMonthTipApi = ({tid, year, month}) => {
  return request({
    url: `${CHAT_URL}/get_msg_time_count`,
    data: {
      tid,
      year,
      month
    }
  })
}

// 创建群组
export const addTeamApi = ({tid, teamName, doctorId, doctorName, patientName, patientId, assistantId}) => {
  return request({
    url: `${CHAT_URL}/create_team`,
    data: {
      tid,
      teamName,
      doctorId,
      doctorName,
      patientName,
      patientId,
      assistantId,
    }
  })
}

// 创建IM账号
export const addIMApi = ({appType, imType, userType, userId, name}) => {
  return request({
    url: `${CHAT_URL}/create_account`,
    data: {
      appType,
      imType,
      userType,
      userId,
      name,
    }
  })
}
