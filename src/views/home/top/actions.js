import {
  logoutApi,
  updatePasswordApi,
  getDoctorApi,
  getAdminApi,
  getOrganDetailApi,
} from './../../../api/account'
import {getCity} from '../../../store/actions/common'
import {removelocalStorage, getlocalStorage, savelocalStorage} from './../../../api/common'
import {
  getTipNewMsgForTalk,
  getTipNewMsgForAbnormal,
  getTipNewMsgForApply,
} from '../../../api/doctorMessage'
import router from '../../../router'
import moment from 'moment'
import md5 from 'md5'
import {
  ADMININFO,
  DOCTORINFO,

  DOCTOR_MESSAGE_NEW_TALK,
  DOCTOR_MESSAGE_NEW_ABNORMAL,
  DOCTOR_MESSAGE_NEW_APPLY,
} from '../../../store/mutation-types'
import {
  mapActions,
} from '../../../utils/vuex'
import {apiTips} from '../../../components/customer/actions'

//消息中心
const goMessage = function () {
  if(this.isAdmin) {
    router.push({name: 'message_list'})
  } else {
    router.push({path:'/home/doctor/message/list/0'})
  }
}

//消息中心 医生
const goDoctorMessage = function ({commit, state},type) {
  router.push({path:'/home/doctor/message/list/'+type})
}

//医生详情
const adminUrl = function () {
  router.push({path: '/home/doctor/info'})
}

//刷新页面
const loginOutFn = function (_this) {
  _this.loginOutLoading = false
  router.push({path: '/'})
  location.reload()
}

//返回首页
const goHome = function () {
  const _this = this
  if(_this.isAdmin) {
    router.push({path: '/admin'})
  } else {
    router.push({path: '/home'})
  }

}

//登出
const loginOut = async function () {
  const _this = this
  _this.loginOutLoading = true
  try {
    const res = await logoutApi()
    if (res) {
      loginOutFn(_this)
    }
  } catch (res) {
    loginOutFn(_this)
  }
  if(!getlocalStorage('autoLogin')) {
    removelocalStorage('roleType')
  }

}

//提交表单
const submitForm = function ({commit, state}, formName) {
  const _this = this
  _this.$refs[formName].validate((valid) => {
    if (valid) {
      _this.resetLoading = true
      resetPasswordSubmit({commit, state}, _this)
    } else {
      _this.$message({
        message: '请完成必填项',
        type: 'warning',
      })
      return false;
    }
  })
}

//修改密码
const resetPasswordSubmit = async function ({commit, state}, _this) {
  try {
    const res = await updatePasswordApi({
      ..._this.ruleForm
    })
    _this.resetLoading = false
    _this.resetPasswordWindowShow = false
    _this.successWindowShow = true
    if (getlocalStorage('autoLogin') && getlocalStorage('userPassword')) {
      savelocalStorage('userPassword', md5(_this.newPassword))
    }
  } catch (res) {
    _this.resetLoading = false
    if (res.code == 407) {
      _this.ruleForm.oldPassword = ''
      _this.$refs['ruleForm'].validateField('wrongPassword')
    } else {
      if (res.code) {
        if (res.code != 200) {
          apiTips(_this, res.msg, '错误', 'error')
        }
      }
    }
  }
}
const init = async function ({commit, state}) {
  await getCity({commit, state}, 'pros')
  const _this = this
  var home_timer = null
  clearInterval(home_timer)
  getInfo({commit, state}, _this)
  updateTime(_this)
  home_timer = setInterval(function () {
    updateTime(_this)
  }, 60000)

  //消息提示定时
  var doctor_tip_timer = null
  clearInterval(doctor_tip_timer)
  if(!_this.isAdmin) {
    updateDoctorNewMsgTip(_this)
    doctor_tip_timer = setInterval(function () {
      if(_this.isAdmin) {
        clearInterval(doctor_tip_timer)
        return
      }
      updateDoctorNewMsgTip(_this)
    }, 10000)
  }
}

//时间更新
const updateTime = function (_this) {
  _this.day = moment().format('YYYY-MM-DD dddd HH:mm')
}

//获取账号信息
const getInfo = async function ({commit, state}, _this) {
  if (getlocalStorage('roleType') != 1 || !getlocalStorage('roleType')) {
    try {
      const res = await getDoctorApi({})
      commit(DOCTORINFO, res)
    } catch (res) {
      loginOutFn(_this)
    }
  } else {
    try {
      const res = await getAdminApi({})
      if(res.lastLoginTime) {
        savelocalStorage('lastLoginTime', res.lastLoginTime)
      }
      const organ = await getOrganDetailApi({organId: res.orgId})
      commit(ADMININFO, organ)
    } catch (res) {
      loginOutFn(_this)
    }
  }
}

//重置表单
const resetForm = function ({commit, state}, formName) {
  const _this = this
  _this.resetPasswordWindowShow = true
  _this.$refs[formName].resetFields()
}

const menuToggle = function () {
  var _this = this
  _this.menuShow = !_this.menuShow
}

//更新消息提示
const updateDoctorNewMsgTip = function (_this) {
  if(window.location.hostname == "localhost") {
    return
  }

  getDoctorNewMsgTipForTalk(_this)
  getDoctorNewMsgTipForAbnormal(_this)
  getDoctorNewMsgTipForApply(_this)
}
//更新 对话消息 提示
const getDoctorNewMsgTipForTalk = async function (_this) {
  // console.log("getDoctorNewMsgTipForTalk")
  try {
    // const {count, date} = await getTipNewMsgForTalk()
    // _this.$store.commit(DOCTOR_MESSAGE_NEW_TALK,{count, date})
    const count = await getTipNewMsgForTalk()
    _this.$store.commit(DOCTOR_MESSAGE_NEW_TALK,{count, date:""})
  } catch(e) {}
}
//更新 异常数据消息 提示
const getDoctorNewMsgTipForAbnormal = async function (_this) {
  // console.log("getDoctorNewMsgTipForAbnormal")
  try {
    const {count, time} = await getTipNewMsgForAbnormal()
    _this.$store.commit(DOCTOR_MESSAGE_NEW_ABNORMAL,{count, time})
  } catch(e) {}
}
//更新 关联申请消息 提示
const getDoctorNewMsgTipForApply = async function (_this) {
  // console.log("getDoctorNewMsgTipForApply")
  try {
    const count = await getTipNewMsgForApply()
    let date = ""
    // if(res) {
    //   count = res.unHandledCount
    //   if(res.lastRequest)
    //     date = res.lastRequest.created
    // }
    _this.$store.commit(DOCTOR_MESSAGE_NEW_APPLY,{count, date})
  } catch(e) {}
}

export default mapActions({
  loginOut,
  resetPasswordSubmit,
  init,
  adminUrl,
  goMessage,
  submitForm,
  resetForm,
  menuToggle,
  getInfo,
  goHome,
  goDoctorMessage,
})
