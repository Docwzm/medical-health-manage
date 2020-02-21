import {
  PATIENT_CHAT_RECORD,
  PATIENT_CHAT_MONTH_TIP,
} from '../../../../../store/mutation-types'
export const MUTATION_NAME = 'views-customer-chat-record'

export default {
  [MUTATION_NAME]: {
    state: {
      record: [],
      monthTip: {},
    },
    mutations: {
      [PATIENT_CHAT_RECORD] (state, record) {
        state.record = record ? [
          ...state.record,
          ...record
        ] : []
      },
      [PATIENT_CHAT_MONTH_TIP] (state, monthTip) {
        state.monthTip = monthTip ? {
          ...state.monthTip,
          ...monthTip
        } : {}
      },
    }
  }
}
