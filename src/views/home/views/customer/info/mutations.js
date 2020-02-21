import {
  CUSTOMER_DEF,
} from '../../../../../store/mutation-types'
export const MUTATION_NAME = 'views-customer-def'

export default {
  [MUTATION_NAME]: {
    state: {
      Def: {},
    },
    mutations: {
      [CUSTOMER_DEF] (state, Def) {
        state.Def = Def ? {
          ...state.Def,
          ...Def
        } : {}
      },
    }
  }
}
