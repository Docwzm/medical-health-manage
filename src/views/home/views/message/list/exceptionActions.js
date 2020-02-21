/**
 * Created by 吴豪 on 2017/4/24.
 */
import{
  DOCTOR_MESSAGE_LIST_ABNORMAL,
  DOCTOR_MESSAGE_NEW_ABNORMAL,
} from '../../../../../store/mutation-types'
import {
  getExceptionMessageListApi,
  ignoreExceptionMessageApi,
  getExceptionMessageItemListApi,
} from '../../../../../api/doctorMessage'

import {bsTypeFilter,toMinuteForHoursFilter} from '../../../../../filters/index'
import {mapActions} from '../../../../../utils/vuex'

import {apiTips,successTips,errorTips} from '../../../../../components/customer/actions'

//分页点击 异常数据
const handleExceptionCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.exceptionMessage.currentPage = val
  getExceptionMessageList({commit, state}, {page:val}, _this)
}

//搜索 排序
const exceptionSortChange = function({commit,state},val) {
  const _this = this
  _this.exceptionMessage.sortType = val
  getExceptionMessageList({commit,state},{page:_this.exceptionMessage.currentPage},_this)
}

//搜素 异常数据
const searchExceptionMessage = function({commit, state}) {
  const _this = this

  let regx = /^([a-zA-Z0-9\s\\.]|[\u4e00-\u9fa5]){0,20}$/
  if(_this.exceptionMessage.searchWord && !regx.test(_this.exceptionMessage.searchWord)) {
    errorTips(_this,"姓名输入错误，请输入中文、英文")
    return
  }

  _this.exceptionMessage.currentPage = 1

  _this.exceptionMessage.queryParam.startTime = _this.exceptionMessage.searchDate && _this.exceptionMessage.searchDate[0]? new Date(_this.exceptionMessage.searchDate[0]).getTime() : undefined
  _this.exceptionMessage.queryParam.endTime = _this.exceptionMessage.searchDate && _this.exceptionMessage.searchDate[1]?new Date(_this.exceptionMessage.searchDate[1]).getTime() : undefined
  _this.exceptionMessage.queryParam.patientName = _this.exceptionMessage.searchWord

  getExceptionMessageList({commit, state}, {}, _this)
}
//搜索 异常数据
const getExceptionMessageList = async function({commit, state}, data, _this) {
  let parameter = {
    // startTime : _this.exceptionMessage.searchDate && _this.exceptionMessage.searchDate[0]? new Date(_this.exceptionMessage.searchDate[0]).getTime() : undefined,
    // endTime : _this.exceptionMessage.searchDate && _this.exceptionMessage.searchDate[1]?new Date(_this.exceptionMessage.searchDate[1]).getTime() : undefined,
    // patientName : _this.exceptionMessage.searchWord,

    startTime: _this.exceptionMessage.queryParam.startTime,
    endTime: _this.exceptionMessage.queryParam.endTime,
    patientName: _this.exceptionMessage.queryParam.patientName,

    sort:_this.exceptionMessage.sortType==0?undefined:"handler_status",
    order:_this.exceptionMessage.sortType==0?undefined:"asc",
    doctorId:_this.doctorInfo.accid
  }

  _this.exceptionMessage.loading = true
  await getExceptionMessageListApi({...parameter, ...data}).then(function (res) {
    _this.exceptionMessage.loading = false
    commit(DOCTOR_MESSAGE_LIST_ABNORMAL,res)
  }).catch((res) => {
    _this.exceptionMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}

//全部忽略 异常数据消息
const ignoreAllExceptionMessage = async function ({commit, state},_this) {
  // const _this = this

  let params = {
    doctorId:_this.doctorInfo.accid
  }

  _this.exceptionMessage.loading = true
  await ignoreExceptionMessageApi({...params}).then(function(res) {
    _this.exceptionMessage.loading = false
    successTips(_this,"全部忽略 操作成功")
    getExceptionMessageList({commit,state},{page:_this.exceptionMessage.currentPage},_this)
  }).catch((res) => {
    _this.exceptionMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}
//忽略异常数据消息
const ignoreExceptionMessage = async function({commit, state}, item) {
  const _this = this
  let patientId = 0
  if(item) {
    patientId = item.patientId
  }
  let params = {
    doctorId:_this.doctorInfo.accid,
    patientId
  }
  _this.exceptionMessage.loading = true
  await ignoreExceptionMessageApi({...params}).then(function(res) {
    _this.exceptionMessage.loading = false
    successTips(_this,"忽略 操作成功")
    getExceptionMessageList({commit, state},{page: _this.exceptionMessage.currentPage},_this)
  }).catch((res) => {
    _this.exceptionMessage.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}
//对话 异常数据消息
const replayExceptionMessage = async function({commit, state}, item) {
  const _this = this

  let patientId = 0
  if(item) {
    patientId = item.patientId
  }

  if(_this.abnormalList) {
    for(let i=0,len=_this.abnormalList.length;i<len;i++) {
      let item = _this.abnormalList[i]
      if(item.patientId == patientId) {
        item.handlerStatus = 2
      }
    }
    // _this.$store.commit(DOCTOR_MESSAGE_LIST_ABNORMAL,{list:_this.abnormalList,total:_this.abnormalTotal})
  }

  replayExceptionMessageHandle(patientId,_this)

  if(item && !item.bindWechat) {
    _this.$message({
      message: '用户还未关联微信,不能与“'+item.patientName+'”对话',
      type: 'warning',
      showClose: true,
    })
  } else {
    window.open("#/home/customer/chat/"+patientId,"_blank")
  }
}
//对话 异常数据消息 修改标记状态
const replayExceptionMessageHandle = async function (patientId, _this) {
  // 标记对话状态
  let params = {
    doctorId:_this.doctorInfo.accid,
    patientId,
    handlerStatus: 2,
  }

  await ignoreExceptionMessageApi({...params}).then(function(res) {}).catch((res) => {})
}

//清除新消息标记
const clearNewExceptionMessage = function ({commit, state}) {
  commit(DOCTOR_MESSAGE_NEW_ABNORMAL,{count:0,date:''})
}

//点击全部忽略
const clickIgnoreAllExceptionMessage = function({commit, state}) {
  const _this = this
  _this.$confirm('此操作将忽略全部未读异常数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ignoreAllExceptionMessage({commit, state},_this)
  }).catch(() => {

  });
}

//点击查看详情
const showExceptionItemDetail = function ({commit, state},event,item) {
  const _this = this
  _this.exceptionMessage.itemDetails.hasItemDetails = true
  _this.exceptionMessage.itemDetails.patientId = item.patientId
  _this.exceptionMessage.itemDetails.currentPage = 1

  getExceptionItemMessageList({commit,state},{},_this)

  event.cancelBubble = true
}

//查看用户详情，  健康数据
const showExceptionCustomerInfoDetail = function ({commit, state},event, item) {
  const _this = this
  if(item && item.handlerStatus == 1) {
    _this.showExceptionItemDetail(event,item)
    return
  }

  let patientId = 0
  if(item) {
    patientId = item.patientId
  }
  window.open("#/home/customer/info/"+patientId+"/doctor","_blank")
}

//分页点击 异常数据详情
const handleExceptionItemCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.exceptionMessage.itemDetails.currentPage = val
  getExceptionItemMessageList({commit, state}, {page:val}, _this)
}

//搜索 异常数据
const getExceptionItemMessageList = async function({commit, state}, data, _this) {
  let parameter = {
    doctorId:_this.doctorInfo.accid,
    patientId:_this.exceptionMessage.itemDetails.patientId,
    pageSize: 5
  }

  _this.exceptionMessage.itemDetails.loading = true
  await getExceptionMessageItemListApi({...parameter, ...data}).then(function (res) {
    _this.exceptionMessage.itemDetails.loading = false
    _this.exceptionMessage.itemDetails.data = res.list
    _this.exceptionMessage.itemDetails.total = res.total
  }).catch((res) => {
    _this.exceptionMessage.itemDetails.loading = false
    _this.exceptionMessage.itemDetails.data = []
    _this.exceptionMessage.itemDetails.total = 0
    apiTips(_this, res.msg, '错误', 'error')
  })
}
//根据item获取异常类型
const detectionTypeValueFilter = function({commit,state},item) {
  // console.log(item)
  let detectionType = item.detectionType
  let contentMap = item.contentMap
  return getDetectionTypeDesc(detectionType,contentMap)
}
//获取异常内容
const getDetectionTypeDesc = function (detectionType,contentMap) {
  let val = ""
  switch(""+detectionType) {
    case "1"://血压
      val = "--/--mmHg"
      if(contentMap) {
        val = contentMap.systolicPressure+"/"+contentMap.diastolicPressure+"mmHg"
      }
      break
    case "2"://体重
      val = "--kg,BMI:--"
      if(contentMap) {
        let bmi = ''
        try{
          //格式化BMI为1位小数
          bmi = Math.round(contentMap.bmi*10)/10
          if(isNaN(bmi)) {
            bmi = ''
          }
        } catch(e) {}
        val = contentMap.weight + "kg,BMI:" + bmi
      }
      break
    case "3"://心率
      val = "--次/分"
      if(contentMap) {
        val = contentMap.heartRate + "次/分"
      }
      break
    case "4"://睡眠
      // val = "浅睡:--分钟;深睡:--分钟;苏醒:--次,--分钟"
      val = "睡眠时长:--"
      if(contentMap) {
        // val = "浅睡:"+contentMap.shallowSleep+"分钟;深睡:"+contentMap.deepSleep+"分钟;苏醒:"+contentMap.awakeningCount+"次,"+contentMap.awakening+"分钟"
        val = `睡眠时长: ${toMinuteForHoursFilter(contentMap.shallowSleep+contentMap.deepSleep+contentMap.awakening)}`
      }
      break
    case "5"://运动
      val = "距离:--米,步数:--,消耗:--CAL"
      if(contentMap) {
        val = "距离:"+contentMap.distance+"米,步数:"+contentMap.step+",消耗:"+contentMap.calories+"CAL"
      }
      break
    case "6"://血糖
      val = "--mmol/L"
      if(contentMap) {
        val = `${bsTypeFilter(contentMap.mealPeroid)} ${contentMap.glucoseConcentration}mmol/L`
      }
      break
    case "7"://体温
      val = "--℃"
      if(contentMap) {
        val = `${contentMap.degree}℃`
      }
      break
  }
  return val
}

export default mapActions({
  handleExceptionCurrentChange,
  searchExceptionMessage,
  getExceptionMessageList,
  ignoreAllExceptionMessage,
  ignoreExceptionMessage,
  replayExceptionMessage,
  clearNewExceptionMessage,

  exceptionSortChange,
  clickIgnoreAllExceptionMessage,

  showExceptionItemDetail,
  showExceptionCustomerInfoDetail,
  handleExceptionItemCurrentChange,
  getExceptionItemMessageList,
  replayExceptionMessageHandle,

  detectionTypeValueFilter,
  getDetectionTypeDesc,
})
