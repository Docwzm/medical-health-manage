import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../utils/vuex'
import {route} from '../../store/getters/route'
import {commonGetter} from '../../store/getters/common'

// 用户详情
export const infoGetter = (state) => state[MUTATION_NAME].info
export const deviceGetter = (state) => state[MUTATION_NAME].device
export const nameGetter = state => {
  return route(state).name === 'customer_bp' ? 'customer_info' : route(state).name === 'customer_record' ? 'customer_chat' : route(state).name
}
// 获取公共
export const commonGet = (state) => {
  return {
    ...commonGetter(state),
    ...state[MUTATION_NAME].common,
  }
}
export default mapGetters({
  activeName: nameGetter,
  info: infoGetter,
  device: deviceGetter,
  common: commonGet,
})
