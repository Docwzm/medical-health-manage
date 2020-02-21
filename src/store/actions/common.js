// mutation-types
import {GET_COMMON} from '../mutation-types'
// apis
import {getCityList} from '../../api/city'
// getters
import {commonByNameGetter} from '../getters/common'
// 获取城市
export const getCity = async({commit, state}, name) => {
  let common = commonByNameGetter(name)(state)
  if (common) {
    return common
  }
  common = await getCityList()
  commit(GET_COMMON, {name, common})
  return common
}
