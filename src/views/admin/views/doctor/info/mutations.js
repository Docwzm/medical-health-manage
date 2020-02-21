import {
  DOCTORDETAIL,
  DOCTORDEVICELIST,
  DEVICEDETAIL,
} from '../../../../../store/mutation-types'
export const MUTATION_NAME = 'doctor-detail'

export default {
  [MUTATION_NAME]: {
    state: {
      infos: {},
      deviceList: {

      },
      deviceDetail: {

      }
    },
    mutations: {
      [DOCTORDETAIL] (state, infos) {
        state.infos = {
          ...infos,
        }
      },
      [DOCTORDEVICELIST] (state, res) {
        state.deviceList = {
            ...res,
        }
      },
      [DEVICEDETAIL] (state, res) {
        state.deviceDetail = {
            ...res,
        }
      }
    }
  }
}
