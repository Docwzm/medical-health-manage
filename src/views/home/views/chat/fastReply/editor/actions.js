import {
  mapActions,
} from '../../../../../../utils/vuex'
import router from '../../../../../../router'
import {
  getReplyListApi,
  saveReplyApi,
  updateReplayApi,
  deleteReplyApi,
} from '../../../../../../api/reply'
import {apiTips} from '../../../../../../components/customer/actions'

const init = function ({commit, state}) {
  const _this = this
  _this.doctorInfos = state['doctor-info']
}

//返回对话
const goChat = function () {
  router.push({name: 'customer_chat'})
}

//查询回复
const search = async function ({}, _this) {
  if (!_this) {
    var _this = this
  }
  _this.currentPage = 1
  _this.loading = true

  try {
    const res = await getReplyListApi({id: _this.id})
    if(res.length >= 1) {
      _this.list = res
      _this.replyLength = res.length
    } else {
      _this.list = []
      _this.replyLength = 0
    }
    _this.loading = false
    _this.showList = _this.list.slice(0, _this.num)
  } catch (res) {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

const handleSelectionChange = function ({}, array) {
  const _this = this
  _this.multipleSelection = []
  array.forEach(({id}) => {
    _this.multipleSelection.push(id)
  })
}

//添加回复
const addReply = async function ({}, isEditor, row) {
  const _this = this
  console.log(isEditor)
  console.log(row)
  console.log(_this.replyLength >= 10)
  console.log(_this.replyLength >= 10 && !isEditor)
  if(_this.replyLength >= _this.maxLength && !isEditor) {
    apiTips(_this, `最多只能添加${_this.maxLength}条快捷语，已达到数量上限`, '错误', 'error')
    return false
  }
  _this.show = true
  _this.isEditor = isEditor
  // console.log("快捷语",row)
  if(!_this.isEditor) {
    _this.title = '添加快捷语'
  } else {
    _this.title = '修改快捷语'
    _this.ruleForm.textarea = row.word
    _this.replyId = row.id
  }

}

//提交表单
const submitForm = function ({}, formName) {
  const _this = this
  _this.$refs[formName].validate((valid) => {
    if(valid) {
      _this.dialogLoading = true
      if(!_this.isEditor) {
        saveReplay(_this, false)
      } else {
        saveReplay(_this, true)
      }
    }
  })
}

//保存回复
const saveReplay = async function (_this, isEditor) {
  var res,
      title
  try{
    if(!isEditor) {
      title = '添加成功'
      if(_this.replyLength < _this.maxLength) {
        res = await saveReplyApi({doctorId: _this.id, word: _this.ruleForm.textarea})
      } else {
        _this.dialogLoading = false
        apiTips(_this, `最多只能添加${_this.maxLength}条快捷语`, '错误', 'error')
      }
    } else {
      title = '修改成功'
      res = await updateReplayApi({quickReplyList: [{doctorId: _this.id, id: _this.replyId, word: _this.ruleForm.textarea}]})
    }
    if(res) {
      _this.dialogLoading = false
      _this.show = false
      _this.$message({
        message: title,
        type: 'success'
      })
      search({}, _this)
    }
  } catch (res) {
    _this.dialogLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//删除回复
const deleteReply = async function ({}, isOnce, row) {
  const _this = this
  if(!isOnce) {
    if(_this.multipleSelection.length <= 0) {
      apiTips(_this, "请选中需要删除的快捷回复", '错误', 'error')
      return false
    }
  }
  this.$confirm('是否删除快捷语，删除后您将无法在健康管理平台和乐心医生APP上使用该快捷语', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSubmit(_this, isOnce, row)
  }).catch(() => {
  })
}

//确认删除回复
const deleteSubmit = async function (_this, isOnce, row) {
  var res
  try{
    if(isOnce) {
      _this.loading = true
      res = await deleteReplyApi({quickReplyList:[{doctorId: _this.id, id: row.id, deleted: 1,}]})
    } else {
        var array = []
        _this.multipleSelection.forEach((item) => {
          array.push({doctorId: _this.id, id: item, deleted: 1,})
        })
        res = await deleteReplyApi({quickReplyList:array})
    }
    if(res) {
      _this.loading = false
      search({}, _this)
    }
  } catch(res) {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//分页
const handleCurrentChange = function ({}, val) {
  const _this = this
  _this.currentPage = val
  _this.showList = _this.list.slice((val-1)*_this.num,val*_this.num)
}

export default mapActions({
  init,
  goChat,
  search,
  handleSelectionChange,
  addReply,
  deleteReply,
  submitForm,
  handleCurrentChange,
})