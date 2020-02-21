import {request} from '../../../../../api/common'
import uuid from 'uuid'
import {mockBpList} from './mock'
import {delay} from './utils'
// const host = 'health-dev.lifesense.com'
// const appType = 5
// const accessToken = 'accessToken'
// const clientId = 'clientId'
// datachart_service修改
export async function getBpList({
  pageIndex = 1,
  pageSize = 20,
  sort = 'measurementDate',
  order = 'desc',
  userId = '',
  begin = '',
  end = '',
  requestId = uuid.v1(),
  source = -1,
}) {
  //GET /bpdata/hm/paged_list
  const url = '/patient_service/bpdata/hm/paged_list'
  const method = 'get'
  const params = {
    pageIndex,
    pageSize,
    sort,
    order,
    userId,
    begin,
    end,
    requestId,
    source
  }
  return request({method, url, params}).catch(e=>alert(JSON.stringify(e)))

  // if (process.env.NODE_ENV === 'development') {
  //   await delay(1000)
  //
  //   return Promise.resolve(JSON.parse(JSON.stringify(mockBpList)))
  // } else {
  //   return request({method, url, params})
  // }
}
export function removeBpItem(id){
  return request({
    method:'get',
    url:`/patient_service/bpdata/delete_bp_record/${id}`,
    params:{
      requestId:uuid.v1()
    }
  }).catch(e=>alert(JSON.stringify(e)))
}
export function addBpItem(body) {

  return request({
    method: 'post',
    url: '/patient_service/bpdata/add_bp_record',
    data: {
      ...body
    },
    params: {
      requestId: uuid.v1()
    }
  }).catch(e=>alert(JSON.stringify(e)))
}

export function updateBpRecord(body) {
  return request({
    method: 'post',
    url: '/patient_service/bpdata/update_bp_record',
    data: {
      ...body
    },
    params: {
      requestId: uuid.v1()
    }
  }).catch(e=>alert(JSON.stringify(e)))
}
//GET /bpdata/hm/daily_bloodpressure_average
export  function getTrendGraphData({ timeRange, day, userId}) {
  // console.log(graphType, timeRange)
  let apiWord1 = ''

  let params = {
    userId,
    day
  }

  if (timeRange == 'day') {
    apiWord1 = 'daily'
  } else if(timeRange=='week') {
    apiWord1 = 'weekly'

  }else if(timeRange=='month'){
    apiWord1 = 'monthly'

  }else if(timeRange=='year'){
    apiWord1 = 'yearly'
  }
  return  request({
    method: 'get',
    url: `/patient_service/bpdata/hm/${apiWord1}_bloodpressure_average`,
    params
  }).catch(e=>alert(JSON.stringify(e)))
  // if (process.env.NODE_ENV === 'development') {
  //   await delay(1000)
  //   return Promise.resolve(Math.random())
  // } else {
  //
  // }
}
export function getErrCountGraphData({ timeRange, day, doctorId,patientId}){
  let apiWord1 = '_bloodpressure_average'

  let params = {
    doctorId,
    patientId,
    day
  }

  if (timeRange == 'day') {
    apiWord1 = 'daily'
  } else if(timeRange=='week') {
    apiWord1 = 'weekly'

  }else if(timeRange=='month'){
    apiWord1 = 'monthly'

  }else if(timeRange=='year'){
    apiWord1 = 'yearly'
  }
  return  request({
    method: 'get',
    url: `/abnormal_service/chart/${apiWord1}_abnormaldata_frequency`,
    params
  }).catch(e=>alert(JSON.stringify(e)))
}

export function getBpThreshold(patientId) {
  return request({
    method:'get',
    url:`/patient_service/health_manage/query_warning/${patientId}`,
    params:{
      requestId:uuid.v1()
    }
  })
}
export function updateThreshold(data){
  return request({
    method:'post',
    url:'/patient_service/health_manage/edit_warning',
    params:{
      requestId:uuid.v1()
    },
    data
  })
}


