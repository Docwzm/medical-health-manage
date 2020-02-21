import {
  PATIENT_CHAT
} from '../../../../store/mutation-types'
export const MUTATION_NAME = 'views-customer-chat'

export default {
  [MUTATION_NAME]: {
    state: {
      chat: {
        // [tid]: {
        //   messageList: [],
        //   session: {},
        // }
      }
    },
    mutations: {
      [PATIENT_CHAT] (state, chat) {
        state.chat = {
          ...state.chat,
          ...chat
        }
      },
    }
  }
}
// ffffff
