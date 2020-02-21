import {request} from './common'
const DOCTOR = '/doctor_service/quickReply/reply'
const apiList = {
  A: '/get_quick_reply',
  B: '/save_quick_reply',
  C: '/update_quick_reply',
}

//获取快捷回复列表
export const getReplyListApi = ({id}) => {
  return request({
    url: `${DOCTOR}${apiList.A}/${id}`,
    method: 'get'
  })
}

//保存快捷语
export const saveReplyApi = ({doctorId, word}) => {
  return request({
    url: `${DOCTOR}${apiList.B}`,
    data: {
      doctorId,
      word,
    }
  })
}

//修改快捷回复
export const updateReplayApi = ({quickReplyList}) => {
  return request({
    url: `${DOCTOR}${apiList.C}`,
    data: {
      quickReplyList
    }
  })
}

//删除快捷回复
export const deleteReplyApi = ({quickReplyList}) => {
  return request({
    url: `${DOCTOR}${apiList.C}`,
    data: {
      quickReplyList,
    }
  })
}