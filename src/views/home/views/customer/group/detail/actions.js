import router from '../../../../../../router'
import {
  getGroupDetailApi,
  deleteGroupPeopleApi,
  addGroupPatiensApi,
  getGroupsApi,
  addPatientToGroupApi
} from '../../../../../../api/customer'
import {
  savelocalStorage,
} from '../../../../../../api/common'
import {selectLevel, selectLevelClick, hideLevel} from '../../selectLevel/actions'
import {AgeCheck, apiTips} from '../../../../../../components/customer/actions'

const init = function () {
  const _this = this
  _this.groupId = router.currentRoute.fullPath.split(':')[1]
  searchGroupDetail({groupId: _this.groupId}, _this)
  searchAddGroupPatients({}, _this)
  getGroups({id: _this.groupId}, _this)
}
//查询分组成员
const searchGroupDetail = async function (data, _this) {
  _this.loading = true
  await getGroupDetailApi(data).then(function (res) {
    _this.loading = false
    _this.groupInfo = res
    _this.tableData = _this.groupInfo.patients
    _this.total = _this.groupInfo.patientNum
  }).catch(function (res) {
    _this.loading = false
  })
}
//组内成员分页点击
const handleCurrentChange = function (val) {
  const _this = this
  _this.currentPage = val
  searchGroupDetail({groupId: _this.groupId, offset: (val - 1) * 20}, _this)
}
//组内成员排序
const tableSort = function (obj) {
  const _this = this
  if (obj.prop == 'name' && obj.order == 'ascending') {
    _this.orderBy = 1
  } else if (obj.prop == 'age' && obj.order == 'descending') {
    _this.orderBy = 2
  } else {
    _this.orderBy = -1
  }

  var data = {
    orderBy: _this.orderBy != -1 ? _this.orderBy : undefined,
    groupId: _this.groupId
  }
  _this.currentPage = 1
  searchGroupDetail({...data}, _this)
}

//删除成员api
const deletePeople = function (_this, title, msg, is_batch) {
  _this.$confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    var ids = []
    if (is_batch) {
      ids = _this.patientIds
    } else {
      ids = _this.patientId
    }
    deleteGroupPeopleApi({id: _this.groupId, patientIds: ids}).then(function (res) {
      var newDate = []
      if (is_batch) {
        for (var i in _this.patientIds) {
          var temporaryDate = []
          for (var j in _this.tableData) {
            if (_this.tableData[j].id != _this.patientIds[i]) {
              temporaryDate.push(_this.tableData[j])
            }
          }
          _this.tableData = temporaryDate
        }
        _this.groupInfo.patientNum = parseInt(_this.groupInfo.patientNum)-_this.patientIds.length
      } else {
        for (var i in _this.tableData) {
          if (i != _this.patientIndex) {
            newDate.push(_this.tableData[i])
          }
        }
        _this.tableData = newDate
        _this.groupInfo.patientNum = parseInt(_this.groupInfo.patientNum)-1
      }
      searchGroupDetail({groupId: _this.groupId}, _this)
    }).catch(function (res) {
      _this.loading = false
      apiTips(_this, res.msg, '错误', 'error')
    })
  }).catch((res) => {
  });
}
//批量删除成员
const batchDeletePeople = function () {
  var _this = this
  if (_this.patientIds.length == 0) {
    apiTips(_this, "请选择需要删除的成员", '错误', 'error')
  } else {
    deletePeople(_this, '是否移除分组？', '若选择"是"，那么将该用户从该分组中移除，但不删除该用户的数据。', true)
  }
}
//单独删除成员
const aloneDeleePeople = function (index, row) {
  const _this = this
  _this.patientId = []
  _this.patientId.push(row.id)
  _this.patientIndex = index
  deletePeople(_this, '是否移除分组？', '若选择"是"，那么将该用户从该分组中移除，但不删除该用户的数据。', false)
}
//表格选择
const tableSelect = function (selection) {
  const _this = this
  _this.patientIds = []
  for (var i in selection) {
    _this.patientIds.push(selection[i].id)
  }
}
const searchAddGroupPatients = async function (data, _this, sign) {
  if(!sign) {
    _this.userLoading = true
  }
  var parameter = {
    orderBy: _this.userOrderBy != -1 ? _this.userOrderBy : undefined,
    groupId: _this.group_val != -1 && _this.group_val != "" ? _this.group_val : undefined,
    name: _this.keyword != "" ? _this.keyword : undefined,
    ageStart: _this.minAge != "" ? _this.minAge : undefined,
    ageEnd: _this.maxAge != "" ? _this.maxAge : undefined,
    sex: _this.sex_val != -1 ? _this.sex_val : undefined,
    patientSource: _this.source_val != -1  ? _this.source_val : undefined,
    withoutGroupId: _this.groupId,
  }

  try{
    const res = await addGroupPatiensApi({...parameter, ...data})
    if(res) {
      _this.userLoading = false
      _this.userTabeleData = res.datas
      _this.userTotal = res.total
    }
  } catch(res) {
    _this.userLoading = false
  }
}
//搜索
const userDialogSearch = function () {
  const _this = this
  _this.userCurrentPage = 0
  searchAddGroupPatients({}, _this)
}
//添加用户筛选
const userTableSelect = function (selection) {
  const _this = this
  _this.addGroupUserIds = []
  for (var i in selection) {
    _this.addGroupUserIds.push(selection[i].id)
  }

}
//添加成员排序
const userTableSort = function (obj) {
  const _this = this
  if (obj.prop == 'name' && obj.order == 'ascending') {
    _this.userOrderBy = 1
  } else if (obj.prop == 'age' && obj.order == 'descending') {
    _this.userOrderBy = 2
  } else {
    _this.userOrderBy = -1
  }
  _this.userCurrentPage = 0
  searchAddGroupPatients({}, _this)
}
//添加成员分页
const userHandleCurrentChange = function (val) {
  const _this = this
  _this.userCurrentPage = val
  userDialogSearch()
  //searchAddGroupPatients({offset: (val - 1) * 20}, _this)
}

//获取分组
const getGroups = async function (data, _this) {
  await getGroupsApi(data).then(function (res) {
    _this.group = res
  }).catch(function (res) {
    //apiTips(_this, res.msg, '错误', 'error')
  })
}

//添加用户到分组
const addUsersInGroup = async function () {
  const _this = this

  if (_this.addGroupUserIds.length > 0) {
    _this.dialogLoading = true
    await addPatientToGroupApi({id: _this.groupId, patientIds: _this.addGroupUserIds}).then(function (res) {
      _this.dialogLoading = false
      _this.dialogVisible = false
      setTimeout(function () {
        searchGroupDetail({groupId: _this.groupId}, _this)
        searchAddGroupPatients({}, _this, true)
      }, 200)
      setTimeout(function(){
        apiTips(_this, "添加成功", '成功', 'success')
      },1000)

    }).catch(function (res) {
      _this.dialogLoading = false
      apiTips(_this, res.msg, '错误', 'error')
    })

  } else {
    apiTips(_this, "请选择需要添加到组的用户", '错误', 'error')
  }
}

const groupDetail = function(index, {id}) {
  //router.push({name: 'patient_doctor_info', params: {id}})
  savelocalStorage('menu-save','0-1')
  window.open(`#/home/customer/info/${id}/doctor?page=1`)
}

const cellClick = function ({id}, {type}, cell, {target}) {
  if(target.className != 'row-click' && type != 'selection') {
    //router.push({name: 'patient_doctor_info', params: {id}})
    savelocalStorage('menu-save','0-1')
    window.open(`#/home/customer/info/${id}/doctor?page=1`)
  }
}

export default {
  init,
  handleCurrentChange,
  tableSort,
  selectLevel,
  hideLevel,
  selectLevelClick,
  aloneDeleePeople,
  batchDeletePeople,
  tableSelect,
  userTableSelect,
  userTableSort,
  userHandleCurrentChange,
  AgeCheck,
  userDialogSearch,
  addUsersInGroup,
  groupDetail,
  searchAddGroupPatients,
  cellClick,
}