import {USERINFO} from '../mutation-types'

export default {
  // 默认值
  state: {
    login: {}
  },
  mutations: {
    [USERINFO] (state, login) {
      state.login = login
    }
  }
}
