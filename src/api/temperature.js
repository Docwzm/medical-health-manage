import {request} from './common'
const DATACHART = '/patient_service'
const apiList = {
  GETAVGRECORDS:'/temperature/doctor/get_avg_records',
  GETRECORDSBYPAGE: '/temperature/doctor/get_records_by_page',
  DELETERECORD: '/temperature/doctor/delete_record',
  ADDRECORD: '/temperature/doctor/add_record',
  UPDATERECORD: '/temperature/doctor/update_record',
}

//获取某段时间的平均值(日，周，月)
export const getAvgRecordsApi = ({userId, startDateTime, endDateTime, peroid,}) => {
  return request({
    url: `${DATACHART}${apiList.GETAVGRECORDS}`,
    data: {
      userId,
      startDateTime,
      endDateTime,
      peroid,
    }
  })
}

//获取体温分页数据
export const getAvgByPageApi = ({userId, startTime, endTime, source, page, pageSize=5, }) => {
  return request({
    url: `${DATACHART}${apiList.GETRECORDSBYPAGE}`,
    method: 'get',
    params: {
      userId,
      startTime,
      endTime,
      source,
      page,
      pageSize,
    }
  })
}

//删除体温
export const deleteRecordApi = ({id}) => {
  return request({
    url: `${DATACHART}${apiList.DELETERECORD}/${id}`,
  })
}

//新增体温
export const addRecordApi = ({userId, measurementDate, degree, remark }) => {
  return request({
    url: `${DATACHART}${apiList.ADDRECORD}`,
    data: {
      userId,
      measurementDate,
      degree,
      remark,
    }
  })
}

//修改体温备注
export const updateRecordApi = ({id, remark}) => {
  return request({
    url: `${DATACHART}${apiList.UPDATERECORD}`,
    data: {
      id,
      remark,
    }
  })
}
