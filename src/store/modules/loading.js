import {LOADING_ADD, LOADING_MIN} from '../mutation-types'

export default {
  // 默认值
  state: {
    requestNum: 0
  },
  mutations: {
    [LOADING_ADD] (state) {
      state.requestNum ++
    },
    [LOADING_MIN] (state) {
      state.requestNum --
    },
  }
}
