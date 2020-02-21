import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../../utils/vuex'

export const userListGetter = (state) => state[MUTATION_NAME].list
export const totalGetter = (state) => state[MUTATION_NAME].total
export const doctorListGetter = (state) => state[MUTATION_NAME].list2

export default  mapGetters({
  userList:userListGetter,
  total:totalGetter,
  doctorList:doctorListGetter,
})