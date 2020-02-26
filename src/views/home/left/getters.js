
// getters
import {shortcutMenus, shortcutMenus2} from '../../../store/getters/menus'
import {mapGetters} from '../../../utils/vuex'

//机构信息
export const adminInfosGetter = (state) => state[MUTATION_NAME].infos

export default mapGetters({
  shortcutMenus,
  shortcutMenus2
})
