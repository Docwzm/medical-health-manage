import {request} from './common'
const DATACHART = '/patient_service'
const apiList = {
  GETRECORDLIST:'/weightdata/getRecordList',
  GETRECORDSBYRESOURCE: '/weightdata/getRecordsByResource',
  GETLASTSRECORD: '/weightdata/getLatestRecord',
  ADDWEIGHT: '/weightdata/add_weight_record',
}

//获取n笔体重
export const getRecordListApi = ({userId, ts=0, count=7}) => {
  return request({
    url: `${DATACHART}${apiList.GETRECORDLIST}`,
    data: {
      userId,
      ts,
      count,
    }
  })
}

//获取历史体重列表
export const getRecordsByResourceApi = ({userId, begin, end, deviceUpload, pageSize=5, pageNum}) => {
  return request({
    url: `${DATACHART}${apiList.GETRECORDSBYRESOURCE}`,
    data: {
      userId,
      begin,
      end,
      deviceUpload,
      pageSize,
      pageNum,
    }
  })
}

//获取用户最新一笔体重
export const getLastsRecordApi = ({userId, }) => {
  return request({
    url: `${DATACHART}${apiList.GETLASTSRECORD}`,
    data: {
      userId,
    }
  })
}

//新增体重
export const addWeightRecordApi = ({userId, measurementDate, deviceId, weight}) => {
  return request({
    url: `${DATACHART}${apiList.ADDWEIGHT}`,
    data: {
      userId,
      measurementDate,
      deviceId,
      weight,
    }
  })
}



