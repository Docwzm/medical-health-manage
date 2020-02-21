/**
 * Created by 吴豪 on 2017/4/24.
 */
import{
  DOCTOR_MESSAGE_LIST_SENDED,
} from '../../../../../store/mutation-types'
import {
  getSendedMessageListApi,
  getSendedMessageDetailApi,
} from '../../../../../api/doctorMessage'

import moment from 'moment'

import {mapActions} from '../../../../../utils/vuex'

import {apiTips,successTips,errorTips} from '../../../../../components/customer/actions'

//分页点击 消息发送
const handleSendedCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.sendedMessage.currentPage = val
  getSendedMessageList({commit, state},{page:val},_this)
}

//搜索 发送消息
const searchSendedMessage = function ({commit, state}) {
  const _this = this

  let regx = /^([a-zA-Z0-9\s\\.]|[\u4e00-\u9fa5]){0,20}$/
  if(_this.sendedMessage.searchWord && !regx.test(_this.sendedMessage.searchWord)) {
    errorTips(_this,"姓名输入错误，请输入中文、英文")
    return
  }

  _this.sendedMessage.currentPage = 1

  _this.sendedMessage.queryParam.startTime = _this.sendedMessage.searchDate && _this.sendedMessage.searchDate[0]? new Date(_this.sendedMessage.searchDate[0]).getTime() : undefined
  _this.sendedMessage.queryParam.endTime = _this.sendedMessage.searchDate && _this.sendedMessage.searchDate[1]?new Date(_this.sendedMessage.searchDate[1]).getTime() : undefined
  _this.sendedMessage.queryParam.receiverName = _this.sendedMessage.searchWord
  _this.sendedMessage.queryParam.sendStatus = _this.sendedMessage.searchState

  getSendedMessageList({commit, state}, {}, _this)
}

//发送消息 排序
const sendedSortChange = function({commit, state},obj) {
  const _this = this
  var order = "desc"
  if(obj && obj["order"] && obj["order"] == "ascending") {
    order = "asc"
  }
  getSendedMessageList({commit,state},{page:_this.sendedMessage.currentPage,order:order},_this)
}

//搜索 发送消息
const getSendedMessageList = async function({commit, state}, data, _this) {
  // var parameter = {
  //   startTime : _this.sendedMessage.searchDate && _this.sendedMessage.searchDate[0]? new Date(_this.sendedMessage.searchDate[0]).getTime() : undefined,
  //   endTime : _this.sendedMessage.searchDate && _this.sendedMessage.searchDate[1]?new Date(_this.sendedMessage.searchDate[1]).getTime() : undefined,
  //   receiverName:_this.sendedMessage.searchWord,
  //   sendStatus : _this.sendedMessage.searchState
  // }

  var parameter = {
    startTime : _this.sendedMessage.queryParam.startTime,
    endTime : _this.sendedMessage.queryParam.endTime,
    receiverName:_this.sendedMessage.queryParam.receiverName,
    sendStatus : _this.sendedMessage.queryParam.sendStatus
  }


  _this.sendedMessage.loading = true
  await getSendedMessageListApi({...parameter, ...data}).then(function (res) {
    _this.sendedMessage.loading = false
    commit(DOCTOR_MESSAGE_LIST_SENDED,res)

  }).catch((res) => {
    _this.sendedMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//查看发送消息详情
const showSendedDetail = async function({commit, state}, row, event, column) {
  const _this = this
  _this.sendedMessage.dialogVisible = true
  _this.sendedMessage.dialogLoading = true
  await getSendedMessageDetailApi({id: row.id}).then(function (res) {
    _this.sendedMessage.dialogLoading = false
    _this.sendedMessage.messageDetailInfos = res
  }).catch((res) => {
    _this.sendedMessage.dialogLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//表格行--发送时间格式化
const sendedRowDateFormatter = function (row, column) {
  return moment(column.sendTime).format("YYYY-MM-DD HH:mm")
}
//表格行--发送状态格式化
const sendedRowStatusFormatter = function (row, column) {
  switch (column.sendStatus) {
    case 0 :
      return "发送中"
      break
    case 1 :
      return "发送成功"
      break
    case 2 :
      return "部分发送失败"
      break
    case 3 :
      return "发送失败"
      break
    default:
      return ""
  }
}
//表格行--发送内容格式化
const sendedRowContentFormatter = function (row, column) {
  let val = column.content
  if (val.length > 10) {
    return val.substring(0, 10) + '...'
  } else {
    return val
  }
}
//表格行--发送对象格式化
const sendedRowNameFormatter = function (row, column) {
  let val = column.receiverName
  let newArray = val.split(','),
    st = newArray.join("， ")
  if(st.length > 23) {
    return st.substring(0,23) + "..."
  } else {
    return st
  }
}

export default mapActions({
  handleSendedCurrentChange,
  searchSendedMessage,
  sendedSortChange,
  getSendedMessageList,
  showSendedDetail,

  sendedRowDateFormatter,
  sendedRowStatusFormatter,
  sendedRowContentFormatter,
  sendedRowNameFormatter,
})
