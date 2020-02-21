import {request} from './common'
const UPLOAD_FILE = '/supportplatform_service/common'

// 上传
export const uploadFileApi = (file, progress = null) => {
  const form = new FormData()
  form.append('file', file)
  console.log('插入form之前的file', file)
  console.log('请求前的form', form)
  return request({
    url: `${UPLOAD_FILE}/upload`,
    data: form,
    options: {
      progress
    }
  })
}
