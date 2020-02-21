import Vue from 'vue'
import {GET_COMMON} from '../mutation-types'

export default {
  // 默认值
  state: {},
  mutations: {
    [GET_COMMON] (state, {name, common}) {
      if (!state[name]) {
        Vue.set(state, name, common)
        return
      }
      state[name] = common
    }
  }
}

