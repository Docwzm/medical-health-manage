import {MUTATION_NAME,MUTATION_NAME2} from './mutations'
import {mapGetters} from '../../../utils/vuex'

// 用户详情
export const roleTypeGetter = (state) => state[MUTATION_NAME].roleType
export const doctorInfoGetter = (state) => state[MUTATION_NAME].info

export default mapGetters({
  getRoleType: roleTypeGetter,
  doctorInfo: doctorInfoGetter,
})
