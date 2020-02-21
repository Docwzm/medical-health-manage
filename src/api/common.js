// import Vue from 'vue'
require('es6-promise').polyfill()
import axios from 'axios'
import uuid from 'uuid'

// utils
import sign, {createNonceStr} from '../utils/sign'
import assertType from '../utils/assertType'
import router from '../router'

// localStorage accessToken的key
//const ACCESS_TOKEN_KEY = '_ACCESS_TOKEN_KEY'

// 保存localStorage
export const savelocalStorage = (accessKey, accessToken) => {
  localStorage.setItem(accessKey, accessToken)
}

// 获取localStorage
export const getlocalStorage = (accessKey) => {
  return localStorage.getItem(accessKey)
}

// 清除localStorage
export const removelocalStorage = (accessKey) => {
  localStorage.removeItem(accessKey)
}

// 配置
const hostname = window.location.hostname
export const apiUrl = (() => {
  //return '//health-qa2.lifesense.com'
  return {
        'static-qa2.lifesense.com': '//health-qa2.lifesense.com',
        'static-qa.lifesense.com': '//health-qa.lifesense.com',
        'static-dev.lifesense.com':'//health-dev.lifesense.com',
        'health-dev.lifesense.com':'//health-dev.lifesense.com',
        'localhost': '//health-dev.lifesense.com',
        // 'sp.lifesense.com': 'sp.lifesense.com/operplatform_service',
      }[hostname] || '//health.lifesense.com'
})()
/**
 * 发送请求a
 * @param method
 *    get、post....
 * @param url
 *    接口url
 * @param data
 *    请求内容
 * @param options
 *    请求选项
 *    options.accessToken === null 时随机生成字符串作为accessToken
 * @returns {Promise.<TResult>|*}
 */
// const apiUrl = '//health-dev.lifesense.com'

export const request = ({method = 'post', url, data, params, common = false, options = {}} = {}) => {
  url = common ? `${url}` : `${apiUrl}${url}`
  const requestId = uuid.v1().replace(/-/g, '')
  // options.accessToken === null 时随机生成字符串作为accessToken
  const accessToken = options.accessToken === null ? createNonceStr() : options.accessToken || getlocalStorage('accessToken')
  delete options.accessToken
  const signParams = sign(accessToken)

  options.params = {
    requestId,
    ...signParams,
    ...params,
    ...options.params,
  }
  // add(store) // loading数量加1
  let param1
  let param2
  if (['get', 'head', 'delete', 'jsonp'].indexOf(method.toLocaleLowerCase()) !== -1) {
    if (common) {
      param1 = {body: data}
    } else {
      param1 = {...options, body: data}
    }
  } else {
    if (common) {
      param1 = data
    } else {
      param1 = data
      param2 = options
    }
  }
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  return axios[method](url, param1, param2)
      .catch(response => {
        return Promise.reject({code: 500, msg: '网络不给力，请检查网络'})
      })
      .then((response) => {
        // 如果code 不等于200，当作异常处理
        let {data} = response

        //客户端未登录统一处理
        if(data.code === 401) {
          router.push({path: '/'})
          location.reload()
        }
        if (assertType(data, String)) {
          data = JSON.parse(data)
        }
        if (data && data.code === 200) {
          return data.data === undefined ? {} : data.data
        }

        return Promise.reject(data)
      })
}
