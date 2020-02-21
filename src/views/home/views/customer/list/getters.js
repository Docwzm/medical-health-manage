import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../../utils/vuex'

//
export const listGetter = (state) => state[MUTATION_NAME].list
export const queryGetter = (state) => state[MUTATION_NAME].queryParams

export default mapGetters({
  queryParams: queryGetter,
  list: listGetter
})
