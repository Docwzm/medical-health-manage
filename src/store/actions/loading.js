import {LOADING_ADD, LOADING_MIN} from '../mutation-types'

export const add = ({commit}) => {
  commit(LOADING_ADD)
}

export const min = ({commit}) => {
  commit(LOADING_MIN)
}
