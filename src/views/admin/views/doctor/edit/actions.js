import {
  mapActions,
} from '../../../../../utils/vuex'
import router from '../../../../../router'
import {
  getDoctorTitlesApi,
  getDepartmentApi,
  getOrganListApi,
  createDoctorApi,
  editorDoctorApi,
  deleteDoctorApi,
  getDoctorDetailApi,
  restDoctorPasswordApi,
} from '../../../../../api/doctor'
import {
  uploadImgApi
} from '../../../../../api/custom'
import {apiTips} from '../../../../../components/customer/actions'

const init = function ({commit, state}, {id}) {
  const _this = this
  if (id == 'create') {
    _this.isCreate = true
  } else {
    _this.isCreate = false
    _this.id = id
    _this.formLoading = true
    getDoctorDetail({commit, state}, {doctorId: id}, _this)
  }
  getTitles({commit, state}, _this)
  getDepartment({commit, state}, _this)
  getOrgan({commit, state}, _this)

}

const getFile = function ({commit, state}, {target}) {
  const file = target.files[0],
      _this = this
  _this.imgLoading = true
  if (file.type != 'image/png' || file.size / 1024 / 1024 >= 2) {
    _this.imgLoading = false
    if (file.type != 'image/png') {
      imgSizeError(_this, '只允许选择PNG格式', '消息提醒')
    } else {
      imgSizeError(_this, '图片超过2M，请重新选择', '消息提醒')
    }
    formSet()
    return false
  }
  if (window.FileReader) {
    var fr = new FileReader()
    fr.onload = function (e) {
      _this.headimgurl = e.target.result
      _this.imgLoading = false
    }
    fr.readAsDataURL(file)
  }
  _this.fileFormDate = file

}

//图片错误提示
const imgSizeError = (_this, tips) => {
  _this.$confirm(tips, {
    confirmButtonText: '确定',
    customClass: 'upload_window',
    type: 'warning'
  })
}

//表单重置
const formSet = function () {
  const _form = document.getElementById('J_from')
  _form.reset()
}

const goList = function () {
  router.push({name: 'doctor_list'})
}


//获取职称
const getTitles = async function ({commit, state}, _this) {
  _this.titleList = await getDoctorTitlesApi({})
}

//获取科室
const getDepartment = async function ({commit, state}, _this) {
  _this.departmentList = await getDepartmentApi({})
}

//获取机构
const getOrgan = async function ({commit, state}, _this) {
  _this.hospitalList = await getOrganListApi({})
}

//提交表单
const submitForm = function ({commit, state}, formName) {
  const _this = this
  _this.$refs[formName].validate((valid) => {
    if (valid) {
      _this.formLoading = true
      submitFormDatas({commit, state}, _this)
    } else {
      _this.$message({
        message: '请完成必填项',
        type: 'warning',
      })
      return false;
    }
  })
}

//新建医生
const createDoctor = async function ({commit, state}, _this, datas) {
  try {
    const res = await createDoctorApi({...datas, ..._this.ruleForm})
    if (res) {
      _this.formLoading = false
      successTips(_this, "新建成功！")
      _this.goList()
    }
  } catch (res) {
    _this.formLoading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//编辑医生
const editorDoctor = async function ({commit, state}, _this, datas) {
  try {
    const res = await editorDoctorApi({..._this.ruleForm, ...datas,})
    if (res) {
      successTips(_this, "更新成功！")
      _this.formLoading = false
      _this.goList()
    }
  } catch (res) {
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//删除医生
const deleteDoctor = function ({commit, state}) {
  const _this = this
  warningDialog(_this, "确定要删除该医生信息吗？", "删除后，该医生将无法使用账号信息中的手机号码登录健康管理平台和乐心医生app", async function (_this) {
    _this.formLoading = true
    try {
      const res = await deleteDoctorApi({doctorId: _this.id})
      if (res) {
        successTips(_this, "删除成功！")
        setTimeout(function () {
          _this.goList()
        }, 1000)
      }
    } catch (res) {
      _this.formLoading = false
    }
  })
}

//上传图片
const submitFormDatas = async function ({commit, state}, _this) {
  var res
  if (_this.fileFormDate) {
    try {
      res = await uploadImgApi(_this.fileFormDate)
    } catch (res) {
      _this.formLoading = false
      apiTips(_this, res.msg, '错误', 'error')
      formSet()
      return false
    }
  } else {
    res = true
  }

  if (res) {
    var doms = document.querySelectorAll('.form_select input')
    var datas = {
      headimgurl: res.url ? res.url : _this.headimgurl,
      hospitalName: doms[0].value,
      departmentName: doms[1].value,
      title: doms[2].value,
      id: _this.id,
    }
    if (_this.isCreate) {
      createDoctor({commit, state}, _this, datas)
    } else {
      editorDoctor({commit, state}, _this, datas)
    }
  }
}

//获取医生详情
const getDoctorDetail = async function ({commit, state}, doctorId, _this) {
  try {
    const res = await getDoctorDetailApi(doctorId)
    if (res) {
      _this.formLoading = false
      _this.ruleForm = {...res}
      _this.headimgurl = res.headimgurl.indexOf('icon_user_no_man.png') == -1 ? res.headimgurl : ""
    }
  } catch (res) {
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//重置密码
const resetPassword = async function ({commit, state}) {
  warningDialog(this, "确定重置密码？", "重置密码后，该医生的账号登录密码将改为初始值123456，请谨慎操作。", async function (_this) {
    _this.formLoading = true
    try {
      const res = await restDoctorPasswordApi({doctorId: _this.id})
      if (res) {
        _this.formLoading = false
        successTips(_this, "重置成功！")
      }
    } catch (res) {
      _this.formLoading = false
    }
  })
}

//提示弹窗
const warningDialog = function (_this, title, msg, fun) {
  _this.$confirm(msg, title, {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    type: 'warning',
    customClass: 'admin-editor-dialog',
  }).then(() => {
    _this.formLoading = true
    fun(_this)
  }).catch((res) => {
  })
}

//成功提示
const successTips = function (_this, msg) {
  _this.$message({
    message: msg,
    type: 'success'
  });
}

export default mapActions({
  init,
  getFile,
  goList,
  submitForm,
  getTitles,
  getDepartment,
  getOrgan,
  createDoctor,
  editorDoctor,
  deleteDoctor,
  submitFormDatas,
  getDoctorDetail,
  resetPassword,
})