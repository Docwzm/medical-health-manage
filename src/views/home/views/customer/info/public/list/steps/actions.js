/**
 * Created by 吴豪 on 2017/5/27.
 */
import moment from 'moment'

import {apiTips,successTips,errorTips} from '../../../../../../../../components/customer/actions'
import {queryStepsHistoryList} from '../../../../../../../../api/stepsChart'

// 调用接口
const getStepsMeasureList = async function (_this) {

  var params = {
    userId : _this.Def.userId,
    begin: _this.search.mDateRange[0] && _this.search.mDateRange[0].getTime() || '',
    end:_this.search.mDateRange[1] && _this.search.mDateRange[1].getTime() || '',
    pageSize: _this.pagination.pageSize,
    pageNum: _this.pagination.pageIndex
  }

  if(!moment(params.end).isBetween(moment(params.begin),moment(params.begin).add(30,"days"))) {
    errorTips(_this,"步数数据查询的时间跨度为30天")
    return
  }

  _this.loading = true
  try {
    let {list, total} = await queryStepsHistoryList(params)
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
const handleStepsCurrentChange = function (val) {
  const _this = this
  _this.pagination.pageIndex = val || 1
  getStepsMeasureList(_this)
}
// 搜索
const searchMeasureData = function () {
  const _this = this
  _this.pagination.pageIndex = 1
  getStepsMeasureList(_this)
}

//初始化
const init = function () {
  this.searchMeasureData()
}


export default {
  searchMeasureData,
  handleStepsCurrentChange,
  init,
}
