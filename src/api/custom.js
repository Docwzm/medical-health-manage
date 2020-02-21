import {request} from './common'
const DOCTORAPP_URL = '/doctor_service'
import uuid from 'uuid'
const apiList = {
  'CUSTOMDETAIL': '/supportplatform/brand/detail/',
  'CUSTOMSAVE': '/supportplatform/brand/save',
}

//获取机构定制信息
export const getCustomDetailApi = ({organId}) => {
  return request({
    url: `${DOCTORAPP_URL}${apiList.CUSTOMDETAIL}${organId}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}

//保存机构定制
export const saveCustomDetailApi = ({organId, imgUrl, linkUrl,})=> {
  return request({
    url: `${DOCTORAPP_URL}${apiList.CUSTOMSAVE}`,
    data: {
      organId,
      imgUrl,
      linkUrl,
    },
  }).then((response) => {
    return response
  })
}

export const uploadImgApi = (files) => {
  var fd= new FormData()
  fd.append("file",files)
  const apiHost ={
        'static-dev.lifesense.com':'sports-dev.lifesense.com',
        'static-qa.lifesense.com':'sports-qa.lifesense.com',
        'static-qa2.lifesense.com':'sports-qa2.lifesense.com',
        'ehealth.lifesense.com':'sports.lifesense.com',
        'localhost':'sports-dev.lifesense.com',
        'health-dev.lifesense.com':'sports-dev.lifesense.com'
      }[location.hostname]||'sports.lifesense.com'
  return request({
    url: `https://${apiHost}/commons_rest/file/upload?catalog=headimg&requestId=${uuid.v1().replace(/-/g, '')}`,
    data:fd,
    common: true,
  }).then((response) => {
    return response
  })
}
