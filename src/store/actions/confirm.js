import {MessageBox} from 'element-ui'
export const showConfirm = (message, title, opts = {type: 'warning'}) => {
  return MessageBox.confirm(message, title, opts)
}
