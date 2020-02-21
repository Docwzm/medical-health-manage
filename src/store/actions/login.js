import {loginApi, getDoctorApi,} from '../../api/account.js'
import {savelocalStorage, getlocalStorage, removelocalStorage} from '../../api/common'
import md5 from 'md5'
import router from '../../router'
import{
  DOCTORINFO,
} from '../mutation-types'
import {
  mapActions,
} from '../../utils/vuex'

const init = async function () {
  const _this = this
  autoLogin(_this)
  setRoleType(_this)
}

//登录
const logining = async function ({commit, state}, formName) {
  const _this = this
  _this.password_error = false
  _this.$refs[formName].validate( async (valid, callback) => {
    if(valid) {
      _this.loginLoading = true
      var user_password = ""
      if (getlocalStorage('autoLogin') && getlocalStorage('userPassword')) {
        if (_this.passwordIsChange) {
          user_password = md5(_this.ruleForm.password)
        } else {
          user_password = _this.rememberPassword
        }
      } else {
        user_password = md5(_this.ruleForm.password)
      }

      try {
        const res = await loginApi({username: _this.ruleForm.username, password: user_password, roleType: _this.roleType})
        if(res) {
          let roleType = parseInt(_this.roleType)
          switch(roleType) {
            case 0:
              checkDoctor({commit, state}, _this, user_password)
              break
            case 1:
              adminLogin(_this, user_password)
              break
          }
        }
      } catch(res) {
        console.log(res)
        _this.password_error = true
        _this.loginLoading = false
        _this.error_tips = res.msg
      }

    }
  })
}

//判断医生是否已认证
const checkDoctor = async ({commit, state}, _this, user_password) => {
  try {
    const res = await getDoctorApi()
    if(res) {
      _this.loginLoading = false
      localStorage_handle(_this, user_password)
      if (res.certificationStatus != 2) {
        _this.password_error = true
        _this.error_tips = '账号未认证'
        removelocalStorage('accessToken')
      } else {
        commit(DOCTORINFO,res)
        router.push({path: '/home'})
        savelocalStorage('roleType', _this.roleType)
      }
    }
  }catch(res) {
    _this.loginLoading = false
    _this.password_error = true
    _this.error_tips = res.msg
    removelocalStorage('accessToken')
  }

}

//管理员登录
const adminLogin = (_this, user_password) => {
  localStorage_handle(_this, user_password)
  router.push({path: '/admin'})
  savelocalStorage('roleType', _this.roleType)
}

//自动登录
const autoLogin = (_this) => {
  if (getlocalStorage('autoLogin')) {
    _this.auto_checked = true
    _this.ruleForm.username = getlocalStorage('userPhone')
    _this.ruleForm.password = '111111'

    setTimeout(function () {
      _this.passwordIsChange = false
    }, 50)
    _this.rememberPassword = getlocalStorage("userPassword")
  } else {
    removelocalStorage('userPhone')
    removelocalStorage('userPassword')
  }
}

//设置用户类型
const setRoleType = (_this) => {
  let roleType = getlocalStorage('roleType') || 0
  if(roleType) {
    roleType = parseInt(roleType)
    switch(roleType) {
      case 0 :
        _this.roleType = 0
        break
      case 1 :
        _this.roleType = 1
        break
    }
  }
}

const localStorage_handle = (_this, user_password) => {
  if (_this.auto_checked) {
    savelocalStorage('autoLogin', 1)
    savelocalStorage('userPhone', _this.ruleForm.username)
    savelocalStorage('userPassword', user_password)
  } else {
    removelocalStorage('autoLogin')
    removelocalStorage('userPhone')
    removelocalStorage('userPassword')
  }
}

export default mapActions({
  init,
  logining,
})
