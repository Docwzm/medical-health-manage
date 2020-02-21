/**
 * Created by 吴豪 on 2017/4/24.
 */
import{
  DOCTOR_MESSAGE_LIST_APPLY,
  DOCTOR_MESSAGE_NEW_APPLY,
} from '../../../../../store/mutation-types'
import {
  getApplyMessageListApi,
  agreeApplyMessageHandle,
  refuseApplyMessageHandle,
} from '../../../../../api/doctorMessage'

import {mapActions} from '../../../../../utils/vuex'

import {apiTips,successTips,errorTips} from '../../../../../components/customer/actions'

//分页点击 关联请求
const handleApplyCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.applyMessage.currentPage = val
  getApplyMessageList({commit, state},{page:val},_this)
}
//搜索 排序
const applySortChange = function({commit,state},val) {
  const _this = this
  _this.applyMessage.sortType = val
  getApplyMessageList({commit,state},{page:_this.applyMessage.currentPage, sort:val==0?"date":"noread"},_this)
}

//搜索 申请消息
const searchApplyMessage = function({commit, state}) {
  const _this = this

  let regx = /^([a-zA-Z0-9\s\\.]|[\u4e00-\u9fa5]){0,20}$/
  if(_this.applyMessage.searchWord && !regx.test(_this.applyMessage.searchWord)) {
    errorTips(_this,"姓名输入错误，请输入中文、英文")
    return
  }

  _this.applyMessage.currentPage = 1

  _this.applyMessage.queryParam.startTime = _this.applyMessage.searchDate && _this.applyMessage.searchDate[0]? new Date(_this.applyMessage.searchDate[0]).getTime() : undefined
  _this.applyMessage.queryParam.endTime = _this.applyMessage.searchDate && _this.applyMessage.searchDate[1]?new Date(_this.applyMessage.searchDate[1]).getTime() : undefined
  _this.applyMessage.queryParam.searchKey = _this.applyMessage.searchWord ? (_this.applyMessage.searchWord.length > 0?_this.applyMessage.searchWord:undefined):undefined

  getApplyMessageList({commit, state}, {}, _this)
}
//搜索 申请消息
const getApplyMessageList = async function({commit,state}, data, _this) {
  // var parameter = {
  //   startTime : _this.applyMessage.searchDate && _this.applyMessage.searchDate[0]? new Date(_this.applyMessage.searchDate[0]).getTime() : undefined,
  //   endTime : _this.applyMessage.searchDate && _this.applyMessage.searchDate[1]?new Date(_this.applyMessage.searchDate[1]).getTime() : undefined,
  //   searchKey : _this.applyMessage.searchWord
  // }

  var parameter = {
    minRequestTime : _this.applyMessage.queryParam.startTime,
    maxRequestTime : _this.applyMessage.queryParam.endTime,
    name : _this.applyMessage.queryParam.searchKey,
    orderBy:_this.applyMessage.sortType==1?2:1
  }

  _this.applyMessage.loading = true
  await getApplyMessageListApi({...parameter, ...data}).then(function (res) {
    _this.applyMessage.loading = false

    commit(DOCTOR_MESSAGE_LIST_APPLY,res)
  }).catch((res) => {
    _this.applyMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//全部同意 关联请求消息
const agreeAllApplyMessage = async function({commit, state},_this) {
  // const _this = this

  _this.applyMessage.loading = true
  await agreeApplyMessageHandle().then(function(res) {
    _this.applyMessage.loading = false
    successTips(_this,"全部同意 操作成功")
    getApplyMessageList({commit, state}, {page: _this.applyMessage.currentPage}, _this)
  }).catch((res) => {
    _this.applyMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}
//同意 关联请求消息
const agreeApplyMessage = async function({commit, state},id) {
  const _this = this
  _this.applyMessage.loading = true
  await refuseApplyMessageHandle({id,agree:1}).then(function(res) {
    _this.applyMessage.loading = false
    successTips(_this,"同意 操作成功")
    getApplyMessageList({commit, state}, {page: _this.applyMessage.currentPage}, _this)
  }).catch((res) => {
    _this.applyMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}
//拒绝 关联请求消息
const refuseApplyMessage = async function({commit, state}, id) {
  const _this = this
  _this.applyMessage.loading = true
  await refuseApplyMessageHandle({id,agree:2}).then(function(res) {
    _this.applyMessage.loading = false
    successTips(_this,"拒绝 操作成功")
    getApplyMessageList({commit, state}, {page: _this.applyMessage.currentPage}, _this)
  }).catch((res) => {
    _this.applyMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//清除新消息标记
const clearNewApplyMessage = function () {
  const _this = this
  _this.$store.commit(DOCTOR_MESSAGE_NEW_APPLY,{count:0,date:''})
}


//点击全部忽略
const clickAgreeAllApplyMessage = function({commit, state}) {
  const _this = this
  _this.$confirm('此操作将同意全部未处理申请, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    agreeAllApplyMessage({commit, state},_this)
  }).catch(() => {

  });
}

//查看用户详情，  健康数据
const showApplyCustomerInfoDetail = function ({commit, state}, item) {
  if(item && item.agree < 1) {
    return
  }

  let patientId = 0
  if(item) {
    patientId = item.patientId
  }

  window.open("#/home/customer/info/"+patientId+"/doctor","_blank")
}

export default mapActions({
  handleApplyCurrentChange,
  searchApplyMessage,
  getApplyMessageList,
  agreeAllApplyMessage,
  agreeApplyMessage,
  refuseApplyMessage,
  clearNewApplyMessage,

  applySortChange,
  clickAgreeAllApplyMessage,

  showApplyCustomerInfoDetail,
})
