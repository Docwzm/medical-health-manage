/**
 * Created by 吴豪 on 2017/4/25.
 */
import {MUTATION_NAME} from './mutations'
import {MUTATION_NEW_MESSAGE_NAME,MUTATION_NAME2} from '../../../top/mutations'
import {mapGetters} from '../../../../../utils/vuex'

export const talkListGetter = (state) => state[MUTATION_NAME].talkMsgList
export const talkTotalGetter = (state) => state[MUTATION_NAME].talkMsgTotal
export const talkNewCountGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].talkMsgNewCount

export const abnormalListGetter = (state) => state[MUTATION_NAME].abnormalMsgList
export const abnormalTotalGetter = (state) => state[MUTATION_NAME].abnormalMsgTotal
export const abnormalNewCountGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].abnormalMsgNewCount

export const applyListGetter = (state) => state[MUTATION_NAME].applyMsgList
export const applyTotalGetter = (state) => state[MUTATION_NAME].applyMsgTotal
export const applyNewCountGetter = (state) => state[MUTATION_NEW_MESSAGE_NAME].applyMsgNewCount

export const sendedListGetter = (state) => state[MUTATION_NAME].sendedMsgList
export const sendedTotalGetter = (state) => state[MUTATION_NAME].sendedMsgTotal

export const doctorInfoGetter = (state) => state[MUTATION_NAME2].infos

export default  mapGetters({
  talkList:talkListGetter,
  talkTotal:talkTotalGetter,
  talkNewCount:talkNewCountGetter,

  abnormalList:abnormalListGetter,
  abnormalTotal:abnormalTotalGetter,
  abnormalNewCount:abnormalNewCountGetter,

  applyList:applyListGetter,
  applyTotal:applyTotalGetter,
  applyNewCount:applyNewCountGetter,

  sendedList:sendedListGetter,
  sendedTotal:sendedTotalGetter,

  doctorInfo:doctorInfoGetter,
})
