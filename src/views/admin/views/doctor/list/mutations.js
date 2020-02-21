import {
  DOCTORLIST
} from '../../../../../store/mutation-types'
export const MUTATION_NAME = 'doctor-list'

export default {
  [MUTATION_NAME]: {
    state: {
      total:0,
      list: [],
    },
    mutations: {
      [DOCTORLIST] (state, {list, total}) {
        state.list = list
        state.total = total
      },
    }
  }
}