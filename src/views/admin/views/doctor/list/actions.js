import {
  getDoctorListApi,
  getDoctorTitlesApi,
  getDepartmentApi,
  getOrganListApi,
} from '../../../../../api/doctor'
import{
  DOCTORLIST,
} from '../../../../../store/mutation-types'
import {
  mapActions,
} from '../../../../../utils/vuex'
import router from '../../../../../router'
import {apiTips} from '../../../../../components/customer/actions'


const init = async function ({commit, state}) {
  const _this = this
  search({commit, state}, {}, _this)
  getTitles({commit, state}, _this)
  getDepartment({commit, state}, _this)
  getOrgan({commit, state}, _this)
}


const search = async function ({commit, state}, data, _this) {
  if (!_this) {
    var _this = this
  }

  if (isNaN(_this.mobile) || _this.mobile.length != 11 && _this.mobile != "") {
    apiTips(_this, "请输入11位纯数字", '错误', 'error')
    return false
  }

  if(!data.page) {
    _this.currentPage = 1
  }

  _this.loading = true
  const parameter = {
    doctorName: _this.name != "" ? _this.name : undefined,
    organId: _this.organId != "" && _this.organId != "0" ? _this.organId : undefined,
    departmentId: _this.departmentId != "" && _this.departmentId != "0" ? _this.departmentId : undefined,
    titleId: _this.titleId != "" && _this.titleId != "0" ? _this.titleId : undefined,
    mobile: _this.mobile != "" && _this.mobile.length == 11 ? _this.mobile : undefined,
    sort: _this.sort != "" ? _this.sort : undefined,
    order: _this.order != "" ? _this.order : undefined,
  }
  try {
    const {list, total} = await getDoctorListApi({...parameter, ...data})
    commit(DOCTORLIST, {list, total})
    _this.loading = false
  } catch (res) {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

const getTitles = async function ({commit, state}, _this) {
  _this.titleList = await getDoctorTitlesApi({})
}

const getDepartment = async function ({commit, state}, _this) {
  _this.departmentList = await getDepartmentApi({})
}

const getOrgan = async function ({commit, state}, _this) {
  _this.organList = await getOrganListApi({})
}

const tableSort = function ({commit, state}, {prop, order}) {
  const _this = this
  _this.sort = ""
  _this.order = ""
  if (prop == 'name') {
    _this.sort = "name"
    if (order == 'ascending') {
      _this.order = "asc"
    } else {
      _this.order = "desc"
    }
  }

  if (prop == 'totalAmount') {
    _this.sort = "total_amount"
    if (order == 'ascending') {
      _this.order = "asc"
    } else {
      _this.order = "desc"
    }
  }
  search({commit, state}, {}, _this)
}

//分页
const handleCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.currentPage = val
  search({commit, state}, {page: val}, _this)
}

//新建医生
const create = function () {
  router.push({name: 'doctor_edit', params: {id: 'create', isEdit: true}})
}

//编辑医生
const editor = function ({commit, state}, {id}) {
  router.push({name: 'doctor_edit', params: {id, isEdit: true}})
}

//查看详情
const read = function ({commit, state}, {id}) {
  //router.push({name: 'doctor_detail', params: {id}})
  window.open(`#/admin/doctor/info/${id}`)
}

//单元格被点击
const cellClick = function ({commit, state}, row, {type}, cell, {target}) {
  const {id} = row
  if(target.className != 'row-click') {
    window.open(`#/admin/doctor/info/${id}`)
  }
}

export default mapActions({
  init,
  search,
  getTitles,
  getDepartment,
  getOrgan,
  tableSort,
  handleCurrentChange,
  create,
  editor,
  read,
  cellClick,
})