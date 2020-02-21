import{
  ADMINMESSAGE,
} from '../../../../../store/mutation-types'
import {
  getGroupLogSerachApi,
  getMessageDetailApi,
} from '../../../../../api/customer'
import {
  mapActions,
} from '../../../../../utils/vuex'
import {apiTips} from '../../../../../components/customer/actions'

const init = async function ({commit, state}) {
  const _this = this
  getGroupMessageLogs({commit, state},{}, _this)
}

const sendUserHandleCurrentChange = function({commit, state}, val) {
  const _this = this
  getGroupMessageLogs({commit, state},{page: val}, _this)
}

const showDetail = async function({commit, state}, row, event, column) {
  const _this = this
  _this.dialogVisible = true
  _this.dialogLoading = true
  await getMessageDetailApi({id: row.id}).then(function (res) {
    _this.dialogLoading = false
    _this.messageDetailInfos = res
  }).catch((res) => {
    _this.dialogLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

const search = function ({commit, state}) {
  const _this = this
  getGroupMessageLogs({commit, state},{}, _this)
}

const getGroupMessageLogs = async function({commit, state}, data, _this) {
  var parameter = {
    startTime: _this.message_time[0] ? new Date(_this.message_time[0]).getTime() : undefined,
    endTime: _this.message_time[1]  ? new Date(_this.message_time[1]).getTime() : undefined,
    sendStatus: _this.message_type != -1 && typeof _this.message_type != 'string' ? _this.message_type : undefined,
  }
  _this.loading = true
  await getGroupLogSerachApi({...parameter, ...data,}).then(function (res) {
    _this.loading = false
    commit(ADMINMESSAGE,res)
  }).catch((res) => {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

export default mapActions({
  init,
  sendUserHandleCurrentChange,
  showDetail,
  getGroupMessageLogs,
  search,
})