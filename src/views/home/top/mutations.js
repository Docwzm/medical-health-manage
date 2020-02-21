import {
  ADMININFO,
  DOCTORINFO,

  DOCTOR_MESSAGE_NEW_TALK,
  DOCTOR_MESSAGE_NEW_ABNORMAL,
  DOCTOR_MESSAGE_NEW_APPLY,
} from '../../../store/mutation-types'
export const MUTATION_NAME = 'admin-info'
export const MUTATION_NAME2 = 'doctor-info'

export const MUTATION_NEW_MESSAGE_NAME = 'doctor-new-message'

export default {
  [MUTATION_NAME]: {
    state: {
      infos: {},
    },
    mutations: {
      [ADMININFO] (state, infos) {
        state.infos = {
            ...infos,
        }
      },
    }
  },
  [MUTATION_NAME2]: {
    state: {
      infos: {},
    },
    mutations: {
      [DOCTORINFO] (state, infos) {
        state.infos = {
          ...infos,
        }
      },
    }
  },
  [MUTATION_NEW_MESSAGE_NAME]:{
    state : {
      talkMsgNewCount : 0,
      talkMsgNewDate : "",

      abnormalMsgNewCount : 0,
      abnormalMsgNewDate : "",

      applyMsgNewCount : 0,
      applyMsgNewDate : "",
    },
    mutations: {
      [DOCTOR_MESSAGE_NEW_TALK] (state, {count, date}) {
        state.talkMsgNewCount = count
        state.talkMsgNewDate = date
      },
      [DOCTOR_MESSAGE_NEW_ABNORMAL] (state, {count, time}) {
        state.abnormalMsgNewCount = count
        state.abnormalMsgNewDate = time
      },
      [DOCTOR_MESSAGE_NEW_APPLY] (state, {count, date}) {
        state.applyMsgNewCount = count
        state.applyMsgNewDate = date
      },
    }
  }
}
