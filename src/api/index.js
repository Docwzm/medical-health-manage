import request from '@utils/request'
const SERVICE_NAME = '/'

const login = (data) => {
   return request({
      url: `${SERVICE_NAME}`,
      method:'POST',
      data
   })
}

export {
   login,
}