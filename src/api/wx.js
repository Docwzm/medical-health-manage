import {request} from './common'

// 获取二维码图片
export const getCode = (ticket) => {
  return request({
    method: 'get',
    common: true,
    url: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`,
  })
}
