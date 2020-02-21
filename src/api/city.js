import {request} from './common'
const CITY_URL = '/doctor_service/supportplatform'

// 获取城市信息
export const getCityList = () => {
  return request({
    method: 'get',
    url: `${CITY_URL}/get_area`,
  })
}
