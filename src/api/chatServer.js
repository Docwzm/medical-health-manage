// 后端IM接口
import {getIMApi, getTeamApi} from './chat'
// getters
import {paramsGetter} from '../store/getters/route'
import {infoGetter} from '../views/home/views/customer/info/details/doctor/getters'
// 公用
const __config = {
  imLoginInfo: {
    sdkAppID: '1400013334',
    appIDAt3rd: 'lxdev',
    accountType: '6871',
  },
  imOpts: {
    isAccessFormalEnv: true, // 是否访问正式环境下的后台接口，True-访问正式，False-访问测试环境默认访问正式环境接口，选填
    isLogOn: false // 是否开启控制台打印日志,True-开启;False-关闭，默认开启，选填
  },
}

// 登陆
const loginIm = async function ({commit, state}) {
  goup.patient = {...infoGetter(state)}
  const {id: userId, name} = goup.patient
  const res = await getIMApi({userType: 0, userId, name})
  console.log('查看IM查回来的ID', res)

  // 设置登陆参数
  __config.imLoginInfo = {
    ...__config.imLoginInfo,
    identifier: res.accid,
    userSig: res.token
  }
  // 登陆
  webim.login(__config.imLoginInfo, {
    onConnNotify: onConnNotify,
    jsonpCallback: jsonpCallback,
    onMsgNotify: onMsgNotify,
    onGroupSystemNotifys: onGroupSystemNotifys,
    onGroupInfoChangeNotify: onGroupInfoChangeNotify,
    onBigGroupMsgNotify: onBigGroupMsgNotify
  }, __config.imOpts, initChat, cbErr)
}
// 登陆成功 初始化对话设置
const initChat = async function () {
  goup.doctor = {...await getDoctorApi()}
  const {name, headimgurl} = goup.doctor
  // 设置当前用户昵称
  __config.imLoginInfo = {
    ...__config.imLoginInfo,
    name,
    headimgurl
  }
  console.log('IM对话创建成功:', __config.imLoginInfo)
  // 获取全部群组
  getJoinedGroupListHigh(function () {
    // 同步消息
    webim.syncMsgs(function (newMsgList) {
      onMsgNotify(newMsgList)
      // unreadMemberListLoaded = true
      initSess()
    }, cbErr)
  })
}
