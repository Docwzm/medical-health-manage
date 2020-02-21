import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../utils/vuex'
import {infoGetter} from '../../../../components/customerLeft/getters'
import {route} from '../../../../store/getters/route'

export const chatGet = (state, tid) => {
  const chat = state[MUTATION_NAME].chat
  return chat[tid]
}

export const chatGetter = (state) => {
  const {tid} = infoGetter(state)
  const chat = state[MUTATION_NAME].chat
  return chat[tid] || {}
}

export const nameGetter = state => route(state).name

export default mapGetters({
  activeName: nameGetter,
  chat: chatGetter,
  patient: infoGetter,
})
