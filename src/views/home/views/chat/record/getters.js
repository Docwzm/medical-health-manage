import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../../utils/vuex'
import {infoGetter} from '../../../../../components/customerLeft/getters'
import {route} from '../../../../../store/getters/route'

export const recordGetter = (state) => state[MUTATION_NAME].record
export const monthTipGetter = (state) => state[MUTATION_NAME].monthTip
export const nameGetter = state => route(state).name

export default mapGetters({
  activeName: nameGetter,
  record: recordGetter,
  monthTip: monthTipGetter,
  patient: infoGetter
})
