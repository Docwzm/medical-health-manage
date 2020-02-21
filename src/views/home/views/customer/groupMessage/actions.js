import {
  getGroupUsersApi,
  groupSendApi,
  getGroupLogApi,
  getMessageDetailApi
} from '.././../../../../api/customer'
import {apiTips} from '../../../../../components/customer/actions'
import {
  getlocalStorage,
} from '.././../../../../api/common'
import router from '../../../../../router'

const init = function () {
  const _this = this
  checkIds(_this)
  getGroupMessageLogs(_this)
}

const showFormFn = function () {
  const _this = this
  _this.ShowForm = true
  _this.ShowLog = false
}
const showLogFn = function () {
  const _this = this
  _this.ShowLog = true
  _this.ShowForm = false
  _this.getGroupMessageLogs(_this)
}

const checkIds = function (_this) {
  if (_this.ids.length == 0) {
    _this.ShowLog = true
    _this.ShowForm = false
    _this.sendMessageUsers = []
  } else {
    _this.ShowForm = true
    _this.ShowLog = false
    getGroupUsers(_this.ids, _this)
  }
}

//获取群发用户ids
const getGroupUsers = async function (ids, _this) {
  _this.getUserLoading = true
  _this.sendMessageUsers = []
  _this.errorUsers = []
  await getGroupUsersApi(ids.join(",")).then(function (res) {
    var res = res
    for (var i in res) {
      if (!res[i].id) {
        res[i].id = ''
      }
      if (!res[i].receiverId) {
        res[i].receiverId = ''
      }
      if (!res[i].receiverName) {
        res[i].receiverName = ''
      }
      if (!res[i].receiverMobile) {
        res[i].receiverMobile = ''
      }
      if (!res[i].receiverOpenId) {
        res[i].receiverOpenId = ''
      }
      if (!res[i].recordId) {
        res[i].recordId = ''
      }
      if (res[i].receiverMobile == "" && res[i].receiverOpenId == "") {
        _this.errorUsers.push(res[i])
      } else {
        _this.sendMessageUsers.push(res[i])
      }
    }
    _this.getUserLoading = false
    if(_this.sendMessageUsers == 0) {
      _this.groupMessageShow = false
      var error_tips = '所选用户都无法接收群发消息'
    } else {
      var error_tips = '部分用户无法接收群发消息'
    }
    setTimeout(function(){
      if (_this.errorUsers.length > 0 || res.length == 0) {
        alert(error_tips)
      }
    },500)
  }).catch((res) => {
    _this.getUserLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//群发历史分页
const sendUserHandleCurrentChange = function (val) {
  const _this = this
  getGroupMessageLogs(_this, {offset: (val - 1) * 20})
}

//群发详情
const groupSendDetail = async function (row, _this) {
  //getMessageDetailApi
  if(!_this) {
    var _this = this
  }
  var id = ''
  if (row) {
    id = row.id
  } else {
    id = _this.groupMessageId
  }
  _this.showDetailLoading = true
  _this.showDetail = true
  await getMessageDetailApi({id: id}).then(function (res) {
    _this.showDetailLoading = false
    _this.messageDetailInfos = res
  }).catch((res) => {
    _this.showDetailLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//删除群发用户
const deleteUser = function (item, index) {
  const _this = this
  _this.sendMessageUsers.splice(index, 1)
}

//发送群发短信
const sendGroupMessage = async function () {
  const _this = this

  if (_this.groupMessageContent == "") {
    _this.content_error = true
    return false
  } else {
    _this.content_error = false
  }

  if(_this.url_error) {
    return false
  }

  var parameter = {
    content: _this.groupMessageContent,
    groupSendMessageRecordId: _this.groupSendMessageRecordId,
    receivers: _this.sendMessageUsers,
    link: _this.groupMessageUrl != "" ? _this.groupMessageUrl : undefined,
  }
  _this.sendindLoading = true
  await groupSendApi({...parameter,}).then(function (res) {
    _this.sendindLoading = false
    _this.groupMessageShow = false
    // setTimeout(function () {
      _this.$confirm('您可在历史消息中查看消息发送的情况。', '消息已发送', {
        confirmButtonText: '查 看',
        cancelButtonText: ' 取 消 ',
        modal: false,
        customClass: 'group-message-box',
        type: 'info'
      }).then(() => {
        goMessageLog()
      }).catch(() => {
      })
  }).catch((res) => {
    _this.sendindLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//查看群发历史
const getGroupMessageLogs = async function (_this, data) {
  var parameter = {
    keyWord: _this.keyWord != "" ? _this.keyWord : undefined,
    startTime: _this.startTime.length != 13 && _this.startTime != "" ? _this.startTime : undefined,
    endTime: _this.endTime.length != 13 && _this.endTime != ""  ? _this.endTime : undefined,
  }
  _this.sendLogLoading = true
  await getGroupLogApi({...parameter, ...data,}).then(function (res) {
    _this.sendLogLoading = false
    _this.sendUserTabeleData = res.list
    _this.sendUserTotal = res.total
  }).catch((res) => {
    _this.sendLogLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//搜索群发记录
const searchSendLog = function () {
  const _this = this
  getGroupMessageLogs(_this)
}

const showGroupWin = function () {
  const _this = this
  if(_this.ids.length > 0) {
    _this.isCheckIds = true
    _this.groupMessageShow = true
  } else {
    _this.$confirm('请先选择用户后再发送消息。若需要查看消息历史发送记录，可点击“历史消息”按钮进入消息中心。', '消息提醒', {
      confirmButtonText: '查看历史消息',
      cancelButtonText: ' 取 消 ',
      modal: false,
      customClass: 'group-message-box',
      type: 'info'
    }).then(() => {
      goMessageLog()
    }).catch(() => {
    })
  }
}

const goMessageLog = function () {
  if(getlocalStorage('roleType') == 1) {
    router.push({name: 'message_list'})
  } else {
    router.push({name: 'doctor_message_list', params: {type : '0'}})
  }
}

export default {
  init,
  showFormFn,
  showLogFn,
  sendUserHandleCurrentChange,
  groupSendDetail,
  checkIds,
  getGroupUsers,
  sendGroupMessage,
  deleteUser,
  getGroupMessageLogs,
  searchSendLog,
  showGroupWin,
  goMessageLog,
}