import axios from "axios"
import uuid from 'uuid'
import {
    server
} from '../configs/index'

axios.defaults.withCredentials = true;
// 创建axios实例
const request = axios.create({
    baseURL: server(),
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// request拦截器
request.interceptors.request.use(
    config => {
        config.params = Object.assign({}, config.params, {
            requestId: `${uuid.v1().replace(/-/g, '')}`
        })
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// respone拦截器
request.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            if (res.code === 401) {
                // Toast.info('客户端未登录')
            }
            return Promise.reject(res)
        } else {
            return response.data
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default request