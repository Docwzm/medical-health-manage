// 选择校验
export const selectValidator = (message, type = 'string', opts = {}) => {
  return {required: true, message, type, trigger: 'change', ...opts}
}
// 输入校验
export const inputValidator = (message, type = 'string', required = false, opts = {}) => {
  return {
    required,
    message: '不能输入特殊字符！',
    type,
    pattern: /^([\u4e00-\u9fa5]+|[a-zA-Z0-9]+)$/,
    trigger: 'blur',
    ...opts}
}
// 姓名校验
export const nameValidator = (message) => {
  return {
    required: true,
    message,
    trigger: 'blur',
    pattern: /[a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}/,
    min: 2,
    max: 20
  }
}
// 输入数字校验
export const inputNumValidator = (message, type, required, opts = {}) => {
  return {
    required,
    message,
    type,
    pattern: /^[0-9]*[1-9][0-9]*$/,
    trigger: 'blur',
    ...opts
  }
}
// 手机号码校验
export const mobileValidator = (opts) => {
  return {
    message: '请输入11位手机号码',
    required: true,
    pattern: /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/,
    trigger: 'blur',
    ...opts
  }
}
// 社保号校验
export const insurcodeValidator = (opts) => {
  return {
    message: '请输入正确的9位社保号',
    required: true,
    pattern: /^(2[0-9])\d{7}$/,
    trigger: 'blur',
    ...opts
  }
}
// 身份证校验
export const IDCardValidator = (opts) => {
  return {
    message: '请输入15或18位身份证号码',
    pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
    trigger: 'blur',
    ...opts
  }
}
