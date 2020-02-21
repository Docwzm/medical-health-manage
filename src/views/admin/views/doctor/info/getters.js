import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../../utils/vuex'

export const infosGetter = (state) => state[MUTATION_NAME].infos
export const deviceListGetter = (state) => state[MUTATION_NAME].deviceList
export const deviceDetailGetter = (state) => state[MUTATION_NAME].deviceDetail

export default  mapGetters({
  infos:infosGetter,
  deviceList:deviceListGetter,
  deviceDetail:deviceDetailGetter,
})