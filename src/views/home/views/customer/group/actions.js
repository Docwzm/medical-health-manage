import {
  searchGroupApi,
  deleteGroupApi,
  addGroupApi,
  editorGroupApi,
} from '../../../../../api/customer'
import router from '../../../../../router'
import {apiTips, successTips} from '../../../../../components/customer/actions'
//获取分组列表
const getGroupList = async function (parameter, _this) {
  _this.loading = true
  await searchGroupApi(parameter).then(function (res) {
    if (!res.list) {
      res.list = []
    }
    _this.tableData = res.list
    _this.total = res.total
    _this.loading = false
  }).catch((res) => {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  })
}
//分页点击
const handleCurrentChange = function (val) {
  const _this = this
  _this.currentPage = val
  searchList({offset: (val - 1) * 20}, _this)
}
//查询分组数据
const searchList = function (data, _this) {
  if (!_this) {
    var _this = this
    if (_this.currentPage) {
      _this.currentPage = 1
    }
  }
  const parameter = {
    orderBy: _this.orderBy != "" ? _this.orderBy : undefined,
    name: _this.keyword != '' ? _this.keyword : undefined,
    createdStart: _this.createTimeStr != '' ? _this.createTimeStr : undefined,
    createdEnd: _this.createTimeEnd != '' ? _this.createTimeEnd : undefined,
    editedStart: _this.editorTimeStr != '' ? _this.editorTimeStr : undefined,
    editedEnd: _this.editorTimeEnd != '' ? _this.editorTimeEnd : undefined,
  }
  getGroupList({...parameter, ...data}, _this)
}

const init = function () {
  const _this = this
  getGroupList({}, this)
}
//监听创建时间
const watchCreateTime = function (_this, val) {
  if (val[0] != null) {
    _this.createTimeStr = new Date(val[0]).getTime()
    _this.createTimeEnd = new Date(val[1]).getTime()
    _this.createTimeEnd += 86400000
  } else {
    _this.createTimeStr = ""
    _this.createTimeEnd = ""
  }
}
//监听编辑时间
const watchEditorTime = function (_this, val) {
  if (val[0] != null) {
    _this.editorTimeStr = new Date(val[0]).getTime()
    _this.editorTimeEnd = new Date(val[1]).getTime()
    _this.editorTimeEnd += 86400000
  } else {
    _this.editorTimeStr = ""
    _this.editorTimeEnd = ""
  }
}
//数据排序
const tableSort = function (obj) {
  const _this = this
  if (obj.prop == 'created' && obj.order == 'descending') {
    _this.orderBy = 1
  } else if (obj.prop == 'edited' && obj.order == 'descending') {
    _this.orderBy = 2
  } else {
    _this.orderBy = ""
  }
  if (_this.currentPage) {
    _this.currentPage = 1
  }
  searchList({}, _this)
}
//表格多选
const tableSelect = function (val) {
  var _this = this
  _this.groupSelect = []
  for (var i in val) {
    _this.groupSelect.push(val[i].id)
  }
}
//删除分组api
const deleteGroup = function (_this, title, msg, is_batch) {
  _this.$confirm(msg, title, {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    customClass: 'delete-group-dialog',
    modal: false,
    type: 'warning'
  }).then(() => {
    _this.loading = true
    var ids = []
    if (is_batch) {
      ids = _this.groupSelect
    } else {
      ids.push(_this.groupId)
    }
    deleteGroupApi({ids: ids}).then(function (res) {
      searchList({}, _this)
    }).catch((res) => {
      _this.loading = false
      apiTips(_this, res.msg, '错误', 'error')
    })
  }).catch((res) => {
  });
}
//批量删除分组
const batchDeleteGroup = function () {
  var _this = this
  if (_this.groupSelect.length == 0) {
    apiTips(_this, "请选择需要删除的组", '错误', 'error')
  } else {
    deleteGroup(_this, '确认要批量删除分组吗？', '删除后分组中的用户将被移除出该分组，但不会删除这些用户的信息。您仍可以在我的用户列表中找到相关的用户。', true)
  }
}
//单独删除分组
const aloneDeleeGroup = function (row) {
  const _this = this
  _this.groupId = row.id
  deleteGroup(_this, '确认要删除该分组吗？', '删除后该分组中的用户将被移除出该分组，但不会删除用户的信息。您仍可以在我的用户列表中找到相关的用户。', false)
}

//修改分组
const editorGroup = function (index, row, isCreate) {
  const _this = this
  if (isCreate) {
    _this.title = "新建分组"
    _this.isCreate = isCreate
  } else {
    _this.title = "编辑分组"
    _this.isCreate = isCreate
    _this.ruleForm = {
      ...row
    }
  }
  _this.dialogVisible = true
}

//保存分组
const saveGroup = async function (formName, isCreate) {
  const _this = this
  console.log(formName)
  console.log(isCreate)
  _this.$refs[formName].validate((valid) => {
    if (valid) {
      _this.dialogLoading = true
      if (isCreate) {
        createGroupApiFn(_this, _this.ruleForm)
      } else {
        editorGroupApiFn(_this, _this.ruleForm)
      }
    }
  })
}

//修改
const editorGroupApiFn = async function (_this, data) {
  _this.dialogLoading = false
  try {
    const res = await editorGroupApi({...data})
    if (res) {
      successTips(_this, "保存成功！")
      searchList({offset: (_this.currentPage - 1) * 20}, _this)
    }
    _this.dialogVisible = false
  } catch (res) {
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//新建
const createGroupApiFn = async function (_this, data) {
  _this.dialogLoading = false
  try {
    const res = await addGroupApi({...data})
    if (res) {
      successTips(_this, "新建成功！")
      searchList({offset: (_this.currentPage - 1) * 20}, _this)
    }
    _this.dialogVisible = false
  } catch (res) {
    apiTips(_this, res.msg, '错误', 'error')
  }
}

const cellClick = function ({id}, {type}, cell, {target}) {
  if(target.className != 'row-click' && target.className != 'row-click operation_delete' && type != 'selection') {
    goGroupDetail(id)
  }
}

//分组详情
const groupDetail = function (index, {id}) {
  goGroupDetail(id)

}

const goGroupDetail = function (id) {
  //router.push({path: `/home/customer/group/:${row.id}`})
  window.open(`#/home/customer/group/:${id}`)
}

export default {
  init,
  handleCurrentChange,
  searchList,
  watchCreateTime,
  watchEditorTime,
  tableSort,
  tableSelect,
  batchDeleteGroup,
  aloneDeleeGroup,
  groupDetail,
  editorGroup,
  saveGroup,
  cellClick,
}