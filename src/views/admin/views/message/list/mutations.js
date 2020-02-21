import {
  ADMINMESSAGE
} from '../../../../../store/mutation-types'

export const MUTATION_NAME = 'admin-message'

export default {
  [MUTATION_NAME]: {
    state: {
      list: [],
      total: 0,
    },
    mutations: {
      [ADMINMESSAGE] (state, {list, total}) {
        state.list = list
        state.total = total
      },
    }
  }
}