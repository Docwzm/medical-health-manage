/**
 * Created by  吴豪 on 2017/4/14.
 */
import {request} from './common'
const DOCTORAPP_URL = '/doctor_service'
const apiList = {
  'WCHATDETAIL': '/supportplatform/custom/detail/',
  'WCHATSAVE': '/supportplatform/custom/save',
}

//获取机构定制微信图文信息
export const getWcatchDetailApi = ({organId}) => {
  return request({
    url: `${DOCTORAPP_URL}${apiList.WCHATDETAIL}${organId}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}

//保存机构定制微信图文信息
export const saveWchatDetailApi = ({id,organCustomLogo = null,organCustomImgUrl,organCustomTitle,organCustomBrief,organCustomLinkUrl = null,organCustomContentAuthor = null,organCustomContent = null}) => {
  return request({
     url: `${DOCTORAPP_URL}${apiList.WCHATSAVE}`,
     data: {
       id,
       organCustomLogo,
       organCustomImgUrl,
       organCustomTitle,
       organCustomBrief,
       organCustomLinkUrl,
       organCustomContentAuthor,
       organCustomContent,
     },
  }).then((response) => {
    return response
  })
}
