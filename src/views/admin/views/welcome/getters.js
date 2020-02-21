import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../utils/vuex'

export const infoGetter = (state) => state[MUTATION_NAME].info


export default  mapGetters({
  info:infoGetter,
})