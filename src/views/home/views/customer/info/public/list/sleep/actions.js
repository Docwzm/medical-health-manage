/**
 * Created by 吴豪 on 2017/5/27.
 */
import moment from 'moment'

import {apiTips,successTips,errorTips} from '../../../../../../../../components/customer/actions'
import {querySleepHistoryList,getLastRecord} from '../../../../../../../../api/sleepChart'

// 调用接口
const getSleepMeasureList = async function (_this) {

  var params = {
    userId : _this.Def.userId,
    startDate: _this.search.mDateRange[0] && _this.search.mDateRange[0].getTime() || '',
    endDate:_this.search.mDateRange[1] && _this.search.mDateRange[1].getTime() || '',
    pageSize: _this.pagination.pageSize,
    pageNum: _this.pagination.pageIndex
  }

  if(!moment(params.endDate).isBetween(moment(params.startDate),moment(params.startDate).add(30,"days"))) {
    errorTips(_this,"睡眠数据查询的时间跨度为30天")
    return
  }

  _this.loading = true
  try {
    let {list, total} = await querySleepHistoryList(params)
    _this.meLi = list || []
    _this.pagination.totalRecord = total || 0
    _this.loading = false
  } catch({code, msg}) {
    _this.loading = false
    _this.pagination.totalRecord = 0
    _this.meLi = []
    apiTips(_this, msg, '错误', 'error')
  }
}
// 分页
const handleSleepCurrentChange = function (val) {
  const _this = this
  _this.pagination.pageIndex = val || 1
  getSleepMeasureList(_this)
}
// 搜索
const searchMeasureData = function () {
  const _this = this
  _this.pagination.pageIndex = 1

  getSleepMeasureList(_this)
}

//获取最后一条睡眠数据
const getLastSleep = async function (_this) {
  if(_this.Def && _this.Def.userId) {
    try {
      let res = await getLastRecord({userId: _this.Def.userId})
      if(res.analysisTime && res.analysisTime > 0) {
        _this.search.mDateRange = [
          (new Date(moment(res.analysisTime).subtract(29, 'days').valueOf())),
          (new Date(moment(res.analysisTime).valueOf())),
        ]
      }
    } catch(error) {}
  }

  _this.searchMeasureData()
}

//初始化
const init = function () {
  getLastSleep(this)
}

export default {
  searchMeasureData,
  handleSleepCurrentChange,
  init,
}
