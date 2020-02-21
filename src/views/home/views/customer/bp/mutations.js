import {actions} from './actions.js'
import {
  STORE_NAME,
  SAVE_STATE_PROP,
  REMOVE_LIST_ITEM,
  SAVE_ITEM_REMARK
} from './constants'

export default{
  [STORE_NAME]: {
    state: {
      // 血压阈值
      threshold: {
        // 舒张压  [上限，下限]
        diastolic: {
          upperLimit:0,
          lowerLimit:0,
          alert:0,
        },
        // 收缩压
        systolic: {
          upperLimit:0,
          lowerLimit:0,
          alert:0
        }
      },
      listViewData: null,
      listViewQuery: null,
      graphViewData: null,

    },
    mutations: {
      [SAVE_STATE_PROP] (state, payload) {
        state[payload.propName] = payload.data
      },
      [REMOVE_LIST_ITEM] (state, payload) {
        const originData = state.listViewData
        // console.log(originData.filter(e=>e.id!=payload.origin.id))
        state.listViewData = originData.filter(e => e.id !== payload.origin.id)
      },
      [SAVE_ITEM_REMARK](state,{newRemark,item}){
        item.origin.remark=newRemark
      }
    },
    actions
  }
}
