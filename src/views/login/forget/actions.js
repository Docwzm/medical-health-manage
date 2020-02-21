import {
  sendCodeApi,
  checkCodeApi,
  resetPasswordApi,
  phoneCheckApi
} from '../../../api/forgetPassword.js'
import router from '../../../router'

const phoneFalse = function (_this) {
  _this.error_tips_show = true
  _this.error_tips = _this.error_tips_list[0]
  _this.form_data1_error = true
}

const phoneNoRegFalse = function (_this) {
  _this.error_tips_show = true
  _this.error_tips = _this.error_tips_list[7]
  _this.form_data1_error = true
}

const codeFalse = function (_this, api) {
  _this.error_tips_show = true
  if (api) {
    _this.error_tips = _this.error_tips_list[3]
  } else {
    _this.error_tips = _this.error_tips_list[1]
  }
  _this.form_data2_error = true
}
const sendCodeFalse = function (_this) {
  _this.sendCodeTips = '重新获取'
  _this.sendCodeDisable = false
}
//发送验证码
const sendCode = async function () {
  const _this = this
  if (_this.sendCodeDisable) {
    return false
  } else {
    var rule = /^\d{11}$/
    if (rule.test(_this.form_data1)) {
      await phoneCheckApi({mobile: _this.form_data1}).then((res) => {
        if (res) {
          _this.isRegister = true
          _this.form_data1_error = false
          _this.sendCodeDisable = true
          _this.error_tips_show = false
          _this.form_data2_error = false
          _this.sendCodeTips = '发送中...'
          sendCodeApi({mobile: _this.form_data1}).then(function () {
            var i = 60
            var timer = null
            timer = setInterval(function () {
              if (i > 0 && i <= 60) {
                i--
                _this.sendCodeTips = i + '秒'
              } else {
                sendCodeFalse(_this)
                clearInterval(timer)
              }
            }, 1000)
          }).catch(function (res) {
            _this.$notify.error({title: '错误', message: res.msg, duration: 3000})
            sendCodeFalse(_this)
            return false
          })
        } else {
          _this.isRegister = false
          _this.form_data2_error = false
          phoneNoRegFalse(_this)
        }
      }).catch(() => {

      })
    } else {
      phoneFalse(_this)
      return false
    }
  }
}

//校验验证码
const checkCode = async function (_this) {
  _this.step1Loading = true
  await checkCodeApi({mobile: _this.form_data1, code: _this.form_data2}).then(function () {
    _this.step1Loading = false
    ++_this.step
  }).catch(function (res) {
    _this.step1Loading = false
   // _this.$notify.error({title: '错误', message: res.msg, duration: 3000})
    codeFalse(_this, true)
    return false
  })
}

const checkForm1Submit = function () {
  const _this = this
  var rule = /^\d{11}$/
  if (!rule.test(_this.form_data1)) {
    phoneFalse(_this)
    return false
  }
  phoneCheckApi({mobile: _this.form_data1}).then((res) => {
    _this.isRegister = res
    if (_this.isRegister) {
      _this.form_data1_error = false
      _this.error_tips_show = false
      if (_this.form_data2 < 4) {
        codeFalse(_this, false)
        return false
      } else {
        _this.form_data2_error = false
        _this.error_tips_show = false
        if (!_this.form_data1_error && !_this.form_data2_error && _this.isRegister) {
          checkCode(_this)
        }
      }
    } else {
      phoneNoRegFalse(_this)
      return false
    }
  }).catch(() => {
  })
}

const resetPassword = async function (_this) {
  _this.step2Loading = true
  await resetPasswordApi({
    mobile: _this.form_data1,
    code: _this.form_data2,
    password: _this.form_data3
  }).then(function () {
    _this.step2Loading = false
    ++_this.step
  }).catch(function (res) {
    _this.step2Loading = false
    _this.$notify.error({title: '错误', message: res.msg, duration: 3000})
    return false
  })
}

const resetPasswordSubmit = function () {
  const _this = this
  var rule = /^\d{6,12}$/
  if (!rule.test(_this.form_data3)) {
    _this.error_tips_show = true
    _this.form_data3_error = true
    _this.error_tips = _this.error_tips_list[4]
    return false
  } else {
    _this.error_tips_show = false
    _this.form_data3_error = false
  }

  if (!rule.test(_this.form_data4)) {
    _this.error_tips_show = true
    _this.form_data4_error = true
    _this.error_tips = _this.error_tips_list[6]
    return false
  } else {
    _this.error_tips_show = false
    _this.form_data4_error = false
  }

  if (_this.form_data4 !== _this.form_data3) {
    _this.error_tips_show = true
    _this.form_data4_error = true
    _this.error_tips = _this.error_tips_list[5]
    return false
  } else {
    _this.error_tips_show = false
    _this.form_data4_error = false
  }
  if (!_this.form_data3_error && !_this.form_data4_error) {
    resetPassword(_this)
  }
}

const goLogin = function () {
  router.push({path: '/'})
}
// 18112295552
// 104835
export default {
  sendCode,
  checkForm1Submit,
  resetPassword,
  resetPasswordSubmit,
  goLogin,
}
