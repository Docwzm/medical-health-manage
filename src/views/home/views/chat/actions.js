import {mapActions} from '../../../../utils/vuex'
import router from '../../../../router'
// types
import {
  PATIENT_CHAT
} from '../../../../store/mutation-types'
// API
import {getIMApi, getTeamHisApi, upDateApi, getTeamApi} from '../../../../api/chat'
import {getDoctorApi} from '../../../../api/account'
// getters
import {infoGetter} from '../../../../components/customerLeft/getters'
import {chatGetter, chatGet} from './getters'
import {paramsGetter} from '../../../../store/getters/route'
// actions
import {getPatient} from '../../../../components/customerLeft/actions'
import {showAlert} from '../../../../store/actions/alert'
import configs from './configs'
// 初始化
let chatBoxBody = null;
let isTid = null
const init = async function ({commit, state}) {
  // 判断是否有对话权限
  const {id} = paramsGetter(state)
  const info = infoGetter(state)
  if (!info || !info.id || info.id != id) {
    await getPatient({commit, state}, id)
  }
  let {tid, headimgurl, name} = infoGetter(state)
  // 获取医生详情
  this.doctor = await getDoctorApi()
  const team = await getTeamApi({tid, doctorId: this.doctor.id, patientId: id})
  tid = team.tid
  if (!tid) {
    showAlert(`用户【${name}】没有关联微信，无法对话！`, 'error')
    return
  }
  isTid = tid
  // 初始化
  commit(PATIENT_CHAT, {[tid]: {session: null, messageList: []}})
  // 获取历史记录
  const messageList = await getTeamHisApi({tid})
  IMconfig.debug('历史消息记录：', messageList)
  // 建立会话
  let chat = chatGetter(state)
  if (!chat || !chat.session) {
    let session = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.GROUP, tid)
    if (!session) {
      session = new webim.Session(webim.SESSION_TYPE.GROUP, tid, tid, headimgurl, Math.round(new Date().getTime() / 1000))
    }
    chat = {session}
  }
  chat.messageList = messageList
  // console.log('会话:', chat)
  await commit(PATIENT_CHAT, {[tid]: chat})
  chatBoxBody = this.$refs.chatBoxBody
  setBottom()
  showAlert(`已经与用户【${name}】成功建立会话！`)
  await upReadeTime({commit, state})
}
const setBottom = ()=> {
  setTimeout(()=> {
    if (chatBoxBody) {
      chatBoxBody.scrollTop = chatBoxBody.scrollHeight
    }
  }, 100)
}
// 登陆IM
const IMconfig = window.IMconfig = configs[window.location.hostname] || configs.def
const loginIm = async function ({commit, state}) {
  const {id, name, headimgurl} = await getDoctorApi()
  const res = await getIMApi({userType: 0, userId: id, name: name})
  // console.log('获取到的IM登录信息:', res)
  // 设置登陆参数
  IMconfig.imLoginInfo = {
    ...IMconfig.imLoginInfo,
    identifier: res.accid,
    userSig: res.token,
    name,
    headimgurl
  }
  // 登陆
  webim.login(IMconfig.imLoginInfo, {
    onConnNotify: (resp)=> {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          // showAlert('已建立IM对话连接！')
          IMconfig.debug('连接状态正常：', resp)
          break
        case webim.CONNECTION_STATUS.OFF:
          // showAlert('连接已断开，无法收到新消息，请检查下你的网络是否正常！', 'error')
          IMconfig.debug('连接已断开，无法收到新消息，请检查下你的网络是否正常：', resp)
          break
        default:
          // showAlert('未知连接状态:' + JSON.stringify(resp), 'error')
          console.error('未知连接状态：', resp)
          break
      }
    },
    jsonpCallback: (rspData) => webim.setJsonpLastRspData(rspData),
    onMsgNotify: (newMsgList) => {
      // IMconfig.debug('接收到新消息:', newMsgList)
      // newMsgList 为新消息数组，结构为[Msg]
      newMsgList.map(async(msg) => {
        const session = msg.getSession()
        let chat = chatGet(this.$store.state, session.id())
        // console.log(chat)
        if (!msg.isSend) {
          IMconfig.debug('接收到新消息:', msg)
        }
        if (!chat) {
          // getGoupMember(sess.id())
          let session = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.GROUP, session.id())
          if (!session) {
            session = new webim.Session(webim.SESSION_TYPE.GROUP, session.id(), session.id(), headimgurl, Math.round(new Date().getTime() / 1000))
          }
          await commit(PATIENT_CHAT, {[session.id()]: {session, messageList: [{...msg}]}})
        } else {
          const messageList = [...chat.messageList.filter((m)=> msg.random != m.random), {...msg}]
          await commit(PATIENT_CHAT, {[session.id()]: {session, messageList}})
        }
        await upReadeTime()
        setBottom()
      })
    },
  }, IMconfig.imOpts, () => {
    IMconfig.debug('登录IM成功!');
  }, (e)=> {
    console.error('登录IM失败：', e)
  })
}
// 发送消息(文本或者表情)
const sendMsg = async function ({commit, state}, message) {
  if (!message) {
    showAlert(`不能发送空白消息`, 'error')
    return
  }
  const chat = chatGetter(state)
  if (!chat.session) {
    showAlert(`正在建立会话，请稍后...`, 'error')
    return
  }
  const msg = new webim.Msg(chat.session, true, -1, Math.round(Math.random() * 4294967296), Math.round(new Date().getTime() / 1000),
    IMconfig.imLoginInfo.identifier, webim.GROUP_MSG_SUB_TYPE.COMMON, IMconfig.imLoginInfo.name)
  // 解析文本和表情
  convertToMsg(message, msg)
  await send({commit, state}, msg)
  chatBoxBody = this.$refs.chatBoxBody
  setBottom()
  this.message = ''
}
// 发送消息
const send = ({commit, state}, msg, error = false) => {
  const chat = chatGetter(state)
  // IMconfig.debug('发送消息:', msg);
  commit(PATIENT_CHAT, {[chat.session.id()]: {...chat, messageList: [...chat.messageList.filter((m)=> msg.random != m.random), {...msg, loading: true, error}]}})
  webim.sendMsg(msg, () => {
    commit(PATIENT_CHAT, {
      [chat.session.id()]: {
        ...chat, messageList: [...chat.messageList.filter((m)=> msg.random != m.random), {...msg, loading: false, error: false}]
      }
    })
    IMconfig.debug('发送消息成功:', msg);
  }, (e) => {
    commit(PATIENT_CHAT, {
      [chat.session.id()]: {
        ...chat, messageList: [...chat.messageList.filter((m)=> msg.random != m.random), {...msg, loading: false, error: true}]
      }
    })
    console.error('发送消息失败:', e);
  })
}
// 解析文本和表情
const convertToMsg = (content, msg) => {
  let tmsg, emotionIndex, emotion, restMsgIndex
  const emotions = content.match(/\[[^[\]]{1,3}\]/mg)
  if (!emotions || emotions.length < 1) {
    msg.addText(new webim.Msg.Elem.Text(content))
  } else {
    for (let i = 0; i < emotions.length; i++) {
      tmsg = content.substring(0, content.indexOf(emotions[i]))
      tmsg && msg.addText(new webim.Msg.Elem.Text(tmsg))
      emotionIndex = webim.EmotionDataIndexs[emotions[i]]
      emotion = webim.Emotions[emotionIndex]
      if (emotion) {
        msg.addFace(new webim.Msg.Elem.Face(emotionIndex, emotions[i]))
      } else {
        msg.addText(new webim.Msg.Elem.Text(emotions[i]))
      }
      restMsgIndex = content.indexOf(emotions[i]) + emotions[i].length
      content = content.substring(restMsgIndex)
    }
    content && msg.addText(new webim.Msg.Elem.Text(content))
  }
}

// 发送图片消息
const sendImg = function ({commit, state}, event) {
  const chat = chatGetter(state)
  if (!chat.session) {
    showAlert(`正在建立会话，请稍后...`, 'error')
    return
  }
  // 封装上传图片请求
  const opt = {
    file: event.target.files[0], // 图片对象
    onProgressCallBack: (...a) => {
      // console.log('上传进度：', a)
    }, // 上传图片进度条回调函数
    // 'abortButton': document.getElementById('upd_abort'), // 停止上传图片按钮
    From_Account: IMconfig.imLoginInfo.identifier, // 发送者帐号
    To_Account: chat.session.id(), // 接收者
    businessType: webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG // 业务类型
  }
  // console.log('上传图片:', opt)
  // 上传图片
  chatBoxBody = this.$refs.chatBoxBody
  webim.uploadPic(opt, async function (resp) {
    IMconfig.debug('上传图片成功:', resp)
    const msg = new webim.Msg(chat.session, true, -1, Math.round(Math.random() * 4294967296), Math.round(new Date().getTime() / 1000), IMconfig.imLoginInfo.identifier, webim.GROUP_MSG_SUB_TYPE.COMMON, IMconfig.imLoginInfo.name)
    const imagesObj = new webim.Msg.Elem.Images(resp.File_UUID)
    let type
    resp.URL_INFO.map(({PIC_TYPE, PIC_Size, PIC_Width, PIC_Height, DownUrl}) => {
      switch (PIC_TYPE) {
        case 1: // 原图
          type = 1 // 原图
          break
        case 2: // 小图（缩略图）
          type = 3 // 小图
          break
        case 4: // 大图
          type = 2 // 大图
          break
      }
      imagesObj.addImage(new webim.Msg.Elem.Images.Image(type, PIC_Size, PIC_Width, PIC_Height, DownUrl))
    })
    msg.addImage(imagesObj)
    await send({commit, state}, msg)
    setBottom()
  }, function (e) {
    console.error('上传图片失败:', e);
  })
}
// 上传阅读时间
const upReadeTime = async() => {
  await upDateApi({tid: isTid, readTime: new Date().getTime()})
}
// tab页面
const tabLinks = (store, {name}) => {
  const {id} = paramsGetter(store.state)
  router.push({name, params: {id}})
}

export default mapActions({
  init,
  upReadeTime,
  tabLinks,
  sendMsg,
  loginIm,
  sendImg,
  send
})
