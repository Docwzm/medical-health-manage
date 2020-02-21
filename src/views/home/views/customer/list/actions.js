import {
  saveUserGroupApi,
  searchGroupApi,
} from '../../../../../api/customer'
import {
  getPatientsListApi,
} from '../../../../../api/doctor'
import {
  savelocalStorage,
} from '../../../../../api/common'
import router from '../../../../../router'
import {apiTips} from '../../../../../components/customer/actions'
import {route} from '../../../../../store/getters/route'
import {
  mapActions,
} from '../../../../../utils/vuex'

const init = function ({commit, state}) {
  const _this = this
  _this.doctorInfo = state['doctor-info']
}

//创建用户
const createUser = function () {
  const path = route(this.$store.state).fullPath
  router.push({name: 'customer_edit', params: {id: 'create', isEdit: true}})
}

//编辑用户
const editorUser = function ({commit}, {patientId}) {
  const path = route(this.$store.state).fullPath,
        id = patientId

 // router.push({name: 'customer_edit', params: {id, isEdit: true}})
  window.open(`#/home/customer/edit/${id}?isEdit=true`)
}

//查询患者列表
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
  }
  try {
    const {list, total} = await getPatientsListApi({...parameter, ...data})
    _this.userList = list
    _this.total = total
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

//跳转详情
const cellClick = function ({commit, state}, {patientId}, {type}, cell, {target}) {
  if(target.className != 'row-click' && type != 'selection') {
    const id = patientId
    //router.push({name: 'patient_doctor_info', params: {id}})
    savelocalStorage('menu-save','0-0')
    window.open(`#/home/customer/info/${id}/doctor?page=1`)
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

  if (prop == 'bloodsugar') {
    if (order == 'ascending') {
      _this.orderBy = 11
    } else {
      _this.orderBy = 12
    }
  }

  if (prop == 'weight') {
    if (order == 'ascending') {
      _this.orderBy = 15
    } else {
      _this.orderBy = 16
    }
  }

  if (prop == 'heartRate') {
    if (order == 'ascending') {
      _this.orderBy = 17
    } else {
      _this.orderBy = 18
    }
  }

  if (prop == 'sleep') {
    if (order == 'ascending') {
      _this.orderBy = 19
    } else {
      _this.orderBy = 20
    }
  }

  search({commit, state}, {}, _this)
}

//选中用户
const handleSelectionChange = function ({commit, state}, array) {
  const _this = this
  _this.multipleSelection = []
  array.forEach( ({patientId}) => {
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

//读取分组信息
const loadGroup = async function ({commit, state}, {patientId,groupingIds}) {
  const _this = this
  _this.dialogVisible = true
  _this.patientId = patientId
  _this.loading2 = true
  try{
    const {list,total} = await searchGroupApi({pageSize:999})
    if(total != 0) {
      _this.hasGroup = true
    } else {
      _this.hasGroup = false
    }
    _this.groupList = list
    if(groupingIds) {
      _this.groupIds = groupingIds
    } else {
      _this.groupIds = []
    }
  } catch(res) {

  }
  _this.loading2 = false
}

//确定分组
const addGroup = async function({}) {
  const _this = this
  _this.loading2 = true
  try{
    _this.loading2 = false
    await saveUserGroupApi({id:_this.patientId, groupIds: _this.groupIds})
    _this.dialogVisible = false
    _this.$message({
      message: "添加成功",
      type: 'success'
    });
    search({},{page:_this.currentPage},_this)
  } catch(res) {
    _this.loading2 = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//去分组页面
const goGroup = function() {
  router.push({name: 'customer_group'})
}

const handleCheckedGroupChange = function({}, value) {
  this.groupIds = value
}

export default mapActions({
  init,
  search,
  handleCurrentChange,
  tableSort,
  createUser,
  editorUser,
  handleSelectionChange,
  cellClick,
  selectionALl,
  loadGroup,
  goGroup,
  addGroup,
  handleCheckedGroupChange,
})
