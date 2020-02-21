import {
  DOCTORORDERLIST,
  DOCTORGAINS,
} from '../../../../../store/mutation-types'

export const MUTATION_NAME = 'doctor-order-list'

export default {
  [MUTATION_NAME]: {
    state: {
      list: [],
      total: 0,
      gains: {
        orderTotal: 0,
        orderTotalAmount: 0,
        totalAmount: 0,
        avaibleAmount: 0,
      },
    },
    mutations: {
      [DOCTORORDERLIST] (state, {list, total}) {
        state.list = list
        state.total = total
      },
      [DOCTORGAINS] (state, res) {
        state.gains = {
            ...res
        }
      }
    }
  }
}