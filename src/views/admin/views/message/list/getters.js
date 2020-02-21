import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../../utils/vuex'

export const listGetter = (state) => state[MUTATION_NAME].list
export const totaGetter = (state) => state[MUTATION_NAME].total

export default  mapGetters({
  list:listGetter,
  total:totaGetter,
})