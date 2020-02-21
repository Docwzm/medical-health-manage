import {
  request
} from './common'
const DOCTORSERVICE = '/doctor_service'

const apiList = {
  'GETDATA':'/doctor_admin/get_data_statistics'
}

//获取当前管理员医生数、用户数和累计收益
export const getDataStatisticsApi = () => {
  return request({
    url: `${DOCTORSERVICE}${apiList.GETDATA}`,
    method: 'get',
  })
}