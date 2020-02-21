export default {
  customerInfo(state,getters){
    let generalInfo = state['views-customer-info-left']
    if(generalInfo&&generalInfo.info){
      return generalInfo.info
    }else{
      return -1
    }
  },
  userId(state,getters){
    if(getters.customerInfo==-1){
      return -1
    }else{
      return getters.customerInfo.userId
    }
  },
  docId(state,getters){
    return state.docId
  }
}
