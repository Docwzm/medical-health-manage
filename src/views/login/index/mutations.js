import {
  ROLETYPE,
  DOCTORINFO,
} from '../../../store/mutation-types'
export const MUTATION_NAME = 'set-role-type'
export const MUTATION_NAME2 = 'doctor-info'

export default {
  [MUTATION_NAME]: {
    state: {
      roleType: 0,
    },
    mutations: {
      [ROLETYPE] (state, roleType) {
        state.roleType = roleType
      },
    }
  },
  [MUTATION_NAME2]: {
    state: {
      info: {},
    },
    mutations: {
      [DOCTORINFO] (state, res) {
        state.info = {
            ...res,
        }
      },
    }
  }
}
