import {createDecorator} from 'vue-class-component'
import {mapAction} from '../utils/vuex'

export default (action) => {
  return createDecorator((componentOptions, key) => {
    componentOptions.methods = componentOptions.methods || {}
    action = action || componentOptions.methods[key]
    componentOptions.methods[key] = mapAction(action)
  })
}
