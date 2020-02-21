import {
  ADMININDEX
} from '../../../../store/mutation-types'

export const MUTATION_NAME = 'admin-index'

export default {
  [MUTATION_NAME]: {
    state: {
      info: {
        doctorCount:0,
        patientCount:0,
        totalAmount:0,
      }
    },
    mutations: {
      [ADMININDEX] (state, res) {
        state.info = {
            ...res
        }
      },
    }
  }
}