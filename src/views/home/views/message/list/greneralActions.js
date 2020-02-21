/**
 * Created by 吴豪 on 2017/4/24.
 */
import{
  DOCTOR_MESSAGE_LIST_TALK,
  DOCTOR_MESSAGE_NEW_TALK,
} from '../../../../../store/mutation-types'
import {
  getTalkMessageListApi,
  ignoreTalkMessageHandle,
  ignoreAllTalkMessageHandle,
} from '../../../../../api/doctorMessage'

import {mapActions} from '../../../../../utils/vuex'

import {apiTips,successTips,errorTips} from '../../../../../components/customer/actions'

const sortArrsForCreateTime = (nextItem, preItem) => {
  if(nextItem.lastMsg && nextItem.lastMsg.CreateTime) {
    if(!preItem.lastMsg || !preItem.lastMsg.CreateTime || nextItem.lastMsg.CreateTime > preItem.lastMsg.CreateTime) {
      return -1
    }
  }

  return 1
}

//排序
const sortResItem = function () {
  const _this = this
  if(_this.greneralMessage.resData && _this.greneralMessage.resData.length > 0) {
    if(_this.greneralMessage.sortType == 1) {

      let unreadArrs = []
      let readArrs = []

      for(let i=0,len=_this.greneralMessage.resData.length;i<len;i++) {
        let iItem = _this.greneralMessage.resData[i]
        if(iItem.unreadCount > 0) {
          unreadArrs.push(iItem)
        } else {
          readArrs.push(iItem)
        }
      }

      unreadArrs.sort(sortArrsForCreateTime)
      readArrs.sort(sortArrsForCreateTime)
      _this.greneralMessage.resData = [...unreadArrs,...readArrs]
    } else {
      _this.greneralMessage.resData.sort(sortArrsForCreateTime)
    }
  }
}
//分页
const getPageResItem = function ({commit, state}) {
  const _this = this
  if(!_this.greneralMessage.resData)
    _this.greneralMessage.resData = []

  let newTotal = _this.greneralMessage.resData.length || 0
  let newList = [];
  let i = (_this.greneralMessage.currentPage -1)*20
  let len = _this.greneralMessage.currentPage*20
  if(len > newTotal) len = newTotal

  for(;i<len;i++) {
    newList.push(_this.greneralMessage.resData[i])
  }

  let params = {
    list: newList,
    total:newTotal
  }
  commit(DOCTOR_MESSAGE_LIST_TALK,params)
}
//分页点击  对话消息
const handleGreneralCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.greneralMessage.currentPage = val
  _this.getPageResItem()
  // getGreneralMessageList({commit, state}, {pages: val}, _this)
}
//搜索 排序
const greneralSortChange = function({commit,state},val) {
  const _this = this
  _this.greneralMessage.sortType = val
  if(_this.greneralMessage.resData && _this.greneralMessage.resData.length > 0) {

  }
  _this.sortResItem()
  _this.getPageResItem()
  // getGreneralMessageList({commit,state},{pages:_this.greneralMessage.currentPage, sort:val==0?"date":"noread"},_this)
}

//搜索 对话消息
const searchGreneralMessage = function ({commit, state}) {
  const _this = this

  let regx = /^([a-zA-Z0-9\s\\.]|[\u4e00-\u9fa5]){0,20}$/
  if(_this.greneralMessage.searchWord && !regx.test(_this.greneralMessage.searchWord)) {
    errorTips(_this,"姓名输入错误，请输入中文、英文")
    return
  }

  _this.greneralMessage.currentPage = 1

  _this.greneralMessage.queryParam.startTime = _this.greneralMessage.searchDate && _this.greneralMessage.searchDate[0]? new Date(_this.greneralMessage.searchDate[0]).getTime() : undefined
  _this.greneralMessage.queryParam.endTime = _this.greneralMessage.searchDate && _this.greneralMessage.searchDate[1]?new Date(_this.greneralMessage.searchDate[1]).getTime() : undefined
  _this.greneralMessage.queryParam.searchKey = _this.greneralMessage.searchWord

  getGreneralMessageList({commit,state}, {}, _this)
}
//搜索 对话消息
const getGreneralMessageList = async function ({commit, state}, data, _this) {
  // var parameter = {
  //   startTime : _this.greneralMessage.searchDate && _this.greneralMessage.searchDate[0]? new Date(_this.greneralMessage.searchDate[0]).getTime() : undefined,
  //   endTime : _this.greneralMessage.searchDate && _this.greneralMessage.searchDate[1]?new Date(_this.greneralMessage.searchDate[1]).getTime() : undefined,
  //   searchKey : _this.greneralMessage.searchWord
  // }

  var parameter = {
    // startTime : _this.greneralMessage.queryParam.startTime,
    // endTime : _this.greneralMessage.queryParam.endTime,
    patientName : _this.greneralMessage.queryParam.searchKey && _this.greneralMessage.queryParam.searchKey.length > 0?_this.greneralMessage.queryParam.searchKey:undefined,
    doctorId:_this.doctorInfo.accid
  }

  _this.greneralMessage.loading = true
  await getTalkMessageListApi({...parameter, ...data}).then(function (res) {
    _this.greneralMessage.loading = false

    _this.greneralMessage.resData = []
    if(res) {
      let newList = []

      for(let i=0,len=res.length;i<len;i++) {
        let resItem = res[i]

        if(resItem && resItem.lastMsg) {
          if(_this.greneralMessage.queryParam.startTime && _this.greneralMessage.queryParam.endTime) {
            if(_this.greneralMessage.queryParam.endTime >= resItem.lastMsg.CreateTime &&  resItem.lastMsg.CreateTime >= _this.greneralMessage.queryParam.startTime) {
              newList.push(resItem)
            }
          } else {
            newList.push(resItem)
          }

        }
      }

      _this.greneralMessage.resData = newList
    }

    _this.sortResItem()
    _this.getPageResItem()
  }).catch((res) => {
    _this.greneralMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//全部忽略 对话消息
const ignoreAllGreneralMessage = async function({commit, state},_this) {
  // const _this = this

  _this.greneralMessage.loading = true
  await ignoreAllTalkMessageHandle().then(function(res) {
    _this.greneralMessage.loading = false
    successTips(_this,'全部忽略 操作成功')
    getGreneralMessageList({commit, state},{page: _this.greneralMessage.currentPage}, _this)
  }).catch((res) => {
    _this.greneralMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//忽略 对话消息
const ignoreGreneralMessage = async function ({commit, state}, item) {
  const _this = this

  let patientId = 0
  if(item) {
    patientId = item.patientId
  }

  _this.greneralMessage.loading = true
  await ignoreTalkMessageHandle({id:item.tid}).then(function (res) {
    _this.greneralMessage.loading = false
    successTips(_this,'忽略 操作成功')

    if(_this.greneralMessage.resData && _this.greneralMessage.resData.length > 0) {
      for(let i=0,len=_this.greneralMessage.resData.length;i<len;i++) {
        let citem = _this.greneralMessage.resData[i]
        if(citem.patientId == patientId) {
          citem.unRead = 1
          citem.unreadCount = 0
        }
      }
    }
    _this.sortResItem()
    _this.getPageResItem()

  }).catch((res) => {
    _this.greneralMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//回复 对话消息
const replyGreneralMessage = async function({commit, state}, item) {
  const _this = this

  if(item && item.bindWechat != 1) {
    _this.$message({
      message: '用户还未关联微信,不能与“'+item.patientName+'”对话',
      type: 'warning',
      showClose: true,
    })
    return
  }

  let patientId = 0
  if(item) {
    patientId = item.patientId
  }

  if(_this.greneralMessage.resData && _this.greneralMessage.resData.length > 0) {
    for(let i=0,len=_this.greneralMessage.resData.length;i<len;i++) {
      let item = _this.greneralMessage.resData[i]
      if(item.patientId == patientId) {
        item.unRead = 0
        item.unreadCount = 0
      }
    }
  }
  _this.sortResItem()
  _this.getPageResItem()
  window.open("#/home/customer/chat/"+patientId,"_blank")
}

//清除新消息标记
const clearNewGreneralMessage = function () {
  const _this = this
  _this.$store.commit(DOCTOR_MESSAGE_NEW_TALK,{count:0,date:''})
}


//点击全部忽略
const clickIgnoreAllGreneralMessage = function({commit, state}) {
  const _this = this
  _this.$confirm('此操作将忽略全部未读对话消息, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ignoreAllGreneralMessage({commit, state},_this)
    // _this.greneralMessage.currentPage = 1

    // if(_this.greneralMessage.resData && _this.greneralMessage.resData.length > 0) {
    //   for(let i=0,len=_this.greneralMessage.resData.length;i<len;i++) {
    //     let item = _this.greneralMessage.resData[i]
    //     if(item.unreadCount > 0) {
    //       item.unRead = 0
    //       item.unreadCount = 0
    //     }
    //   }
    // }
    // _this.sortResItem()
    // _this.getPageResItem()

  }).catch(() => {

  });
}

//查看用户详情，
const showGreneralCustomerInfoDetail = function ({commit, state}, item) {
  const _this = this
  if(item && item.unreadCount > 0) {
    return
  }

  if(item && item.bindWechat != 1) {
    _this.$message({
      message: '用户还未关联微信,不能与“'+item.patientName+'”对话',
      type: 'warning',
      showClose: true,
    })
    return
  }

  let patientId = 0
  if(item) {
    patientId = item.patientId
  }

  // window.open("#/home/customer/info/"+patientId+"/doctor","_blank")
  window.open("#/home/customer/chat/"+patientId,"_blank")
}

export default mapActions({
  handleGreneralCurrentChange,
  searchGreneralMessage,
  getGreneralMessageList,
  ignoreAllGreneralMessage,
  ignoreGreneralMessage,
  replyGreneralMessage,
  clearNewGreneralMessage,

  greneralSortChange,
  clickIgnoreAllGreneralMessage,
  getPageResItem,
  sortResItem,

  showGreneralCustomerInfoDetail,
})
