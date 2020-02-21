import {
  mapActions,
} from '../../../../../utils/vuex'
import router from '../../../../../router'
import{
  DOCTORORDERLIST,
  DOCTORGAINS,
} from '../../../../../store/mutation-types'
import {
  getGainsApi,
  getOrderListApi,
} from '../../../../../api/doctor'
import {apiTips} from '../../../../../components/customer/actions'

const init = function ({commit, state}, {id}) {
  const _this = this
  _this.doctorId = id
  search({commit, state}, {}, _this)
  getGanins({commit, state}, id, _this)
}

const goDetail = function () {
  router.push({name: 'doctor_detail', params: {id: this.doctorId}})
}

//查询订单列表
const search = async function ({commit, state}, data, _this) {
  if (!_this) {
    var _this = this
  }

  const rule1 = /^[\u4e00-\u9fa5]{0,}$/,
      rule2 = /^[A-Za-z]/
  if (_this.name != "") {
    if (!rule1.test(_this.name)) {
      if (!rule2.test(_this.name)) {
        apiTips(_this, "请输入中文、英文", '错误', 'error')
        return false
      }
    }
  }

  if (isNaN(_this.mobile) || _this.mobile.length != 11 && _this.mobile != "") {
    apiTips(_this, "请输入11位纯数字", '错误', 'error')
    return false
  }

  if (!data.page) {
    _this.currentPage = 1
  }

  var par = {
    sort: _this.sort != "" ? _this.sort : undefined,
    order: _this.order != "" ? _this.order : undefined,
    name: _this.name != "" ? _this.name : undefined,
    doctorId: _this.doctorId,
    mobile: _this.mobile != "" && _this.mobile.length == 11 ? _this.mobile : undefined,
    beginTime: _this.message_time[0] ? new Date(_this.message_time[0]).getTime(): undefined,
    endTime: _this.message_time[1] ? new Date(_this.message_time[1]).getTime() : undefined,
    orderStatus: _this.orderStatus != "" && _this.orderStatus != 0 ? _this.orderStatus : undefined,
  }

  _this.loading = true
  try {
    const res = await getOrderListApi({...par, ...data})
    commit(DOCTORORDERLIST, res)
    _this.loading = false
  } catch (res) {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}


//获取收益信息
const getGanins = async function ({commit, sate}, id, _this) {
  try {
    const res = await getGainsApi({doctorId: id})
    commit(DOCTORGAINS, res)
  } catch (res) {
  }
}

const tableSort = function ({commit, state}, {prop, order}) {
  const _this = this
  _this.sort = ""
  _this.order = ""

  if (prop == 'patientName') {
    _this.sort = "patient_name"
    if (order == 'ascending') {
      _this.order = "asc"
    } else {
      _this.order = "desc"
    }
  }

  if (prop == 'total') {
    _this.sort = "total"
    if (order == 'ascending') {
      _this.order = "asc"
    } else {
      _this.order = "desc"
    }
  }
  search({commit, state}, {}, _this)
}

const handleCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.currentPage = val
  search({commit, state}, {page: val}, _this)
}


export default mapActions({
  init,
  goDetail,
  tableSort,
  handleCurrentChange,
  getGanins,
  search,
})