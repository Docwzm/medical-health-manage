import {
  SET_ROOT_STATE_PROP
} from './mutation-types'
export default{
  [SET_ROOT_STATE_PROP](state,payload){
    state[payload.propName] = payload.data
  }

}
