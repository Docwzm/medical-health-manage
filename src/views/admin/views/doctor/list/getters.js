import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../../utils/vuex'

export const doctorListGetter = (state) => state[MUTATION_NAME].list
export const totalGetter = (state) => state[MUTATION_NAME].total

export default  mapGetters({
  doctorList:doctorListGetter,
  total:totalGetter,
})