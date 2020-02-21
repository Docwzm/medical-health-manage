import {
  mapActions,
} from '../../../../../utils/vuex'
import {
  ADMINUSERLIST,
  DOCTORLIST,
} from '../../../../../store/mutation-types'
import {apiTips} from '../../../../../components/customer/actions'
import {
  getPatientsListApi,
  getDoctorListApi,
  getOrganListApi,
} from '../../../../../api/doctor'
import {
  getDoctorsListApi,
  allocateDoctorsApi,
} from '../../../../../api/customer'
import {
  savelocalStorage,
} from '../../../../../api/common'
import moment from 'moment'

const init = async function ({commit, state}) {
  const _this = this
  getOrganList({commit, state}, _this)
  getDoctorList({commit, state})
  _this.adminInfo = state['admin-info']
}

//获取机构id
const getOrganList = async function ({commit, state}, _this) {
  var organList = []
  const res = await getOrganListApi({})
  res.forEach(({id}) => {
    organList.push(id)
  })
  _this.organIds = organList
  _this.organList = res
}

//查询用户
const search = async function ({commit, state}, data, _this) {
  if (!_this) {
    var _this = this
  }

  if (_this.ageStart != "") {
    if (isNaN(_this.ageStart)) {
      apiTips(_this, "请输入正确的年龄", '错误', 'error')
      return false
    }
  }

  if (_this.ageEnd != "") {
    if (isNaN(_this.ageEnd)) {
      apiTips(_this, "请输入正确的年龄", '错误', 'error')
      return false
    }
  }

  if (!isNaN(_this.ageStart) && !isNaN(_this.ageEnd)) {
    if (parseInt(_this.ageStart) > parseInt(_this.ageEnd)) {
      apiTips(_this, "最小年龄不能大于最大年龄", '错误', 'error')
      return false
    }
  }

  if (!data.page) {
    _this.currentPage = 1
  }

  _this.loading = true
  const parameter = {
    name: _this.name != "" ? _this.name : undefined,
    minAge: _this.ageStart != "" ? _this.ageStart : undefined,
    maxAge: _this.ageEnd != "" ? _this.ageEnd : undefined,
    sex: _this.sex != -1 && typeof _this.sex != 'string' ? _this.sex : undefined,
    doctorId: _this.doctorId != "" ? _this.doctorId : undefined,
    sickType: _this.sickType != -1 && typeof _this.sickType != 'string' ? _this.sickType : undefined,
    bpLevel: _this.bp != "" && _this.bp != -1 ? _this.bp : undefined,
    patientSource: _this.patientSource != -1 && typeof _this.patientSource != 'string' ? _this.patientSource : undefined,
    orderBy: _this.orderBy != "" ? _this.orderBy : undefined,
    organId:  _this.organId,
    childOrganId: _this.selectOrganId != "" && _this.selectOrganId != 0 ? _this.selectOrganId : undefined,
    minCreated:_this.create_time[0] ? new Date(_this.create_time[0]).getTime() : undefined,
    maxCreated:_this.create_time[1] ? new Date(moment(_this.create_time[1]).format("YYYY-MM-DD 23:59:59")).getTime() : undefined,
  }

  try {
    const {list, total} = await getPatientsListApi({...parameter, ...data})
    if(list) {
      commit(ADMINUSERLIST, {list: list, total: total})
    } else {
      commit(ADMINUSERLIST, {list: [], total: 0})
    }
    _this.selectAll = false
    _this.loading = false
  } catch (res) {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//分页点击
const handleCurrentChange = function ({commit, state}, val) {
  const _this = this
  _this.currentPage = val
  search({commit, state}, {page: val}, _this)
}

//单元格被点击
const cellClick = function ({commit, state}, row, {type}, cell, {target}) {
  const {patientId: id, userId} = row
  if (type != 'selection' && target.className != 'go-download' && target.className != 'go-allocation') {
    //router.push({name: 'patient_admin_info', params: {id, userId}})
    savelocalStorage('menu-save','1-0')
    window.open(`#/home/customer/info/${id}/admin?page=1`)
  }
}

//排序
const tableSort = function ({commit, state}, {prop, order}) {
  const _this = this
  _this.orderBy = ""

  if (prop == 'name') {
    if (order == 'ascending') {
      _this.orderBy = 1
    } else {
      _this.orderBy = 2
    }
  }

  if (prop == 'age') {
    if (order == 'ascending') {
      _this.orderBy = 3
    } else {
      _this.orderBy = 4
    }
  }

  if (prop == 'bp') {
    if (order == 'ascending') {
      _this.orderBy = 5
    } else {
      _this.orderBy = 6
    }
  }

  if (prop == 'pulse') {
    if (order == 'ascending') {
      _this.orderBy = 7
    } else {
      _this.orderBy = 8
    }
  }

  if(prop == 'created') {
    if (order == 'ascending') {
      _this.orderBy = 9
    } else {
      _this.orderBy = 10
    }
  }

  search({commit, state}, {}, _this)
}

//选中用户
const handleSelectionChange = function ({commit, state}, array) {
  const _this = this
  _this.multipleSelection = []
  array.forEach(({patientId}) => {
    _this.multipleSelection.push(patientId)
  })
}

const selectionALl = function ({commit, state}) {
  const _this = this,
        table = _this.$refs.table
  _this.selectAll = !_this.selectAll
  this.userList.forEach((row) => {
    table.toggleRowSelection(row, _this.selectAll)
  })
}

//获取医生列表
const getDoctorList = async function ({commit, state}) {
  const {list} = await getDoctorListApi({pageSize: 999})
  commit(DOCTORLIST, {list})
}

//选择报告类型
const chooseDownload = function ({state}, row) {
    const _this = this
    _this.downDialog = true
    _this.downloadInfo = row
}

//下载报告
const goDownload = function ({state}) {
  const _this = this
  //_this.downDialog = true
  const {common: {pros: area}} = state,
        infos = _this.downloadInfo
  savelocalStorage('saveArea', JSON.stringify(area))
  savelocalStorage('userInfos', JSON.stringify(infos))
  let downloadList = []
  if( _this.isDownloadAll == '1') {
    downloadList = ['血压','血糖', '体重']
  } else {
    downloadList = _this.chooseList
  }
  savelocalStorage('pdfType', JSON.stringify(downloadList))
  window.open(`#/dowonloadPdf/${infos.userId}`)
}

//分配医生
const goAllocation = function ({}, {patientId}) {
  const _this = this
  _this.allocationDialog = true
  _this.allocationLoading = true
  _this.allowDoctorList = []
  getAllocationDoctor(_this, patientId)
}

const getAllocationDoctor = async function(_this, patientId) {
  if(!patientId) {
    let patientId = _this.SelectPatientId
  }
  try {
    const res = await getDoctorsListApi({organId:  _this.organId, patientId})
    if(res) {
      _this.allocationLoading = false
      _this.allowDoctorList = res
      _this.SelectPatientId = patientId
    }
  } catch(res) {
    _this.allocationLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

const allocationSubmit = async function ({}) {
  const _this = this
  _this.allocationLoading = true
  try {
    const res = await allocateDoctorsApi({organId:  _this.organId, patientId: _this.SelectPatientId, doctorIds: _this.doctorIds  })
    if(res) {
      _this.allocationLoading = false
      _this.allocationDialog = false
      _this.$message({
        message: "分配成功",
        type: 'success'
      });
    }
  } catch(res) {
    _this.allocationLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//选中医生
const handleSelectionChange2 = function ({}, array) {
  const _this = this
  let ids = []
  array.map(({id}) => {
    ids.push(id)
  })
  _this.doctorIds = ids
}

export default mapActions({
  init,
  tableSort,
  handleCurrentChange,
  search,
  cellClick,
  handleSelectionChange,
  getDoctorList,
  selectionALl,
  chooseDownload,
  goDownload,
  goAllocation,
  allocationSubmit,
  handleSelectionChange2,
})