import {createDecorator} from 'vue-class-component'
import {mapGetter} from '../utils/vuex'

export default (getter) => {
  return createDecorator((componentOptions, key) => {
    componentOptions.computed = componentOptions.computed || {}
    getter = getter || componentOptions.computed[key]
    componentOptions.computed[key] = mapGetter(getter)
  })
}
