/**
 * Created by 吴豪 on 2017/4/25.
 */
import {
  DOCTOR_MESSAGE_LIST_TALK,
  DOCTOR_MESSAGE_LIST_ABNORMAL,
  DOCTOR_MESSAGE_LIST_APPLY,
  DOCTOR_MESSAGE_LIST_SENDED,
} from '../../../../../store/mutation-types'

export const MUTATION_NAME = 'doctor-message'

export default {
  [MUTATION_NAME]: {
    state: {
      talkMsgList: [],
      talkMsgTotal : 0,

      abnormalMsgList : [],
      abnormalMsgTotal : 0,

      applyMsgList : [],
      applyMsgTotal : 0,

      sendedMsgList : [],
      sendedMsgTotal : []
    },
    mutations: {
      [DOCTOR_MESSAGE_LIST_TALK] (state, {list, total}) {
        state.talkMsgList = list
        state.talkMsgTotal = total
      },
      [DOCTOR_MESSAGE_LIST_ABNORMAL] (state, {list, total}) {
        state.abnormalMsgList = list
        state.abnormalMsgTotal = total
      },
      [DOCTOR_MESSAGE_LIST_APPLY] (state, {list, total}) {
        state.applyMsgList = list
        state.applyMsgTotal = total
      },
      [DOCTOR_MESSAGE_LIST_SENDED] (state, {list, total}) {
        state.sendedMsgList = list
        state.sendedMsgTotal = total
      },
    }
  }
}
