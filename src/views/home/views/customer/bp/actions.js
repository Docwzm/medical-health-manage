import {
  QUERY_BP_LIST,
  SAVE_STATE_PROP,
  REMOVE_BP_ITEM,
  REMOVE_LIST_ITEM,
  SAVE_BP_REMARK,
  SAVE_ITEM_REMARK,
  SAVE_BP_THRESHOLD,
  QUERY_GRAPH_DATA,
  SET_THRESHOLD,
  TURN_OFF_BP_ALERT,
  ADD_BP_ITEM,
  QUERY_BP_THRESHOLD
} from './constants'
import {
  getBpList,
  getTrendGraphData,
  addBpItem,
  updateBpRecord,
  removeBpItem,
  getBpThreshold,
  updateThreshold,
  getErrCountGraphData
} from './api'

export const actions = {

  async [QUERY_BP_LIST] (context, payload={}) {
    //return
    // console.log(context,payload)
    context.commit(SAVE_STATE_PROP,{
      propName:'listViewData',
      data:null
    })
    context.commit(SAVE_STATE_PROP,{
      propName:'listViewQuery',
      data:{
        ...context.state.listViewQuery,
        ...payload.query
      }
    })
    let list
    // console.log({
    //   ...context.state.listViewQuery,
    //   ...(payload.query||{})
    // },'sdsdsdsd')
    const data = await getBpList({
        ...context.state.listViewQuery,
        ...(payload.query||{})
      })
    list = data.data
    context.commit(SAVE_STATE_PROP, {
      propName: payload.propName,
      data: list,
    })
    context.commit(SAVE_STATE_PROP,{
      propName:'listViewQuery',
      data:{
        ...context.state.listViewQuery,
        pageIndex:data.pageIndex,
        totalPage:data.totalPage
      }
    })
  },
  async [REMOVE_BP_ITEM] (context, payload) {
    await removeBpItem(payload.origin.id)
    context.commit(REMOVE_LIST_ITEM, payload)
  },
  async [SAVE_BP_REMARK](context, {newRemark, item,patientId}){
    // context.commit(SAVE_ITEM_REMARK,payload)
    updateBpRecord({
      patientId,
      ...item.origin,
      remark:newRemark
    })
    //todo 改成SAVE_PROP
    context.commit(SAVE_ITEM_REMARK, {newRemark, item})
  },
  //

  async [QUERY_GRAPH_DATA](context,payload){
    context.commit(SAVE_STATE_PROP,{
      propName:'graphViewData',
      data:null
    })
    let data
    if(payload.graphType=='trend'){
      data = await getTrendGraphData(payload)
    }else if(payload.graphType=='errCount'){
      data = await getErrCountGraphData(payload)
    }

    //console.log(data,'xxxxxxxxxxx')
    context.commit(SAVE_STATE_PROP,{
      propName:'graphViewData',
      data:data
    })
  },
  async [ADD_BP_ITEM](context,payload){
    payload.measurementDate = payload.measurementDate.getTime()
    return await addBpItem({

      "measurementDate": 0,
      "systolicPressure": 0,
      "diastolicPressure": 0,
      "heartRate": 65,
      "movementError": 0,
      "remark": "string",
      "temperature": 0,

      ...payload
    })
  },
  async [SAVE_BP_THRESHOLD](context,newThreshold){

    await updateThreshold({
      id:context.state.threshold.id,
      bpHL:newThreshold.systolic.lowerLimit,
      bpHH:newThreshold.systolic.upperLimit,
      bpLL:newThreshold.diastolic.lowerLimit,
      bpLH:newThreshold.diastolic.upperLimit,
      bpHOnOff:newThreshold.systolic.alert,
      bpLOnOff:newThreshold.diastolic.alert
    })
    context.commit(SAVE_STATE_PROP,{
      propName:'threshold',
      data:newThreshold
    })
  },
  async [QUERY_BP_THRESHOLD](context,id){

    let d =  await getBpThreshold(id)
    context.commit(SAVE_STATE_PROP,{
      propName:'threshold',
      data:{
        // 舒张压  [上限，下限]
        diastolic: {
          upperLimit:d.bpLH,
          lowerLimit:d.bpLL,
          //0关闭1开启
          alert:d.bpLOnOff
        },
        // 收缩压
        systolic: {
          upperLimit:d.bpHH,
          lowerLimit:d.bpHL,
          alert:d.bpHOnOff
        },
        id:d.id

      }
    })
    return d
  },

}
