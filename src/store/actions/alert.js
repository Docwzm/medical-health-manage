import {Message} from 'element-ui'
export const showAlert = (message, type = 'success', opts = {showClose: true}) => {
  Message({type, message, ...opts})
}
