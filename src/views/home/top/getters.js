import {MUTATION_NAME,MUTATION_NAME2,MUTATION_NEW_MESSAGE_NAME} from './mutations'
import {mapGetters} from '../../../utils/vuex'

//机构信息
export const adminInfosGetter = (state) => state[MUTATION_NAME].infos

//医生信息
export const doctorInfosGetter = (state) => state[MUTATION_NAME2].infos

export const talkNewCountGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].talkMsgNewCount
export const talkNewDateGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].talkMsgNewDate

export const abnormalNewCountGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].abnormalMsgNewCount
export const abnormalNewDateGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].abnormalMsgNewDate

export const applyNewCountGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].applyMsgNewCount
export const applyNewDateGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].applyMsgNewDate

export default mapGetters({
  adminInfos: adminInfosGetter,
  doctorInfos: doctorInfosGetter,

  talkNewCount: talkNewCountGetter,
  taklNewDate: talkNewDateGetter,

  abnormalNewCount: abnormalNewCountGetter,
  abnormalNewDate: abnormalNewDateGetter,

  applyNewCount: applyNewCountGetter,
  applyNewDate: applyNewDateGetter

})
