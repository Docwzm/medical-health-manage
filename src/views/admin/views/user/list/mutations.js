import {
  ADMINUSERLIST,
  DOCTORLIST,
} from '../../../../../store/mutation-types'
export const MUTATION_NAME = 'user-list'

export default {
  [MUTATION_NAME]: {
    state: {
      total: 0,
      list: [],
      list2:[],
    },
    mutations: {
      [ADMINUSERLIST] (state, {list, total}) {
        state.list = list
        state.total = total
      },
      [DOCTORLIST] (state, {list}) {
        state.list2 = list
      }
    }
  }
}