import {
  getCustomDetailApi,
  uploadImgApi,
  saveCustomDetailApi,
} from '../../../../../api/custom'

import {mapActions} from '../../../../../utils/vuex'

const init = function ({commit, state}, val) {
  const _this = this
  _this.organId = val.id
  this.getCustomDetail({organId: _this.organId},_this)
}

//获取定制详情
const getCustomDetail = async function ({commit, state},{organId},_this) {
  _this.brandLoading = true
  const res = await getCustomDetailApi({organId})
  _this.brand_data = res
  if(res) {
    _this.brandLoading = false
    if(_this.brand_data.imgUrl ) {
      _this.hasImg = true
      _this.urlIsEidt = false
      _this.isNew = false
      _this.imgSrc = _this.brand_data.imgUrl
      _this.url = _this.brand_data.linkUrl
    } else {
      _this.hasImg = false
      _this.urlIsEidt = true
      _this.isNew = true
    }
  }
}

//获取图片
const getFile = function ({commit, state},{target}) {
  const file = target.files[0],
      _this = this
  _this.imgLoading = true
  if(file.type != 'image/png' || file.size/1024/1024 >= 2) {
    _this.imgLoading = false
    if(file.type != 'image/png') {
      imgSizeError(_this,'图片必须为PNG格式','消息提醒')
    } else {
      imgSizeError(_this,'图片超过2M，请重新选择','消息提醒')
    }
    formSet()
    return false
  }
  _this.showSave = true
  if(window.FileReader) {
    var fr = new FileReader()
    fr.onload = function(e) {
      _this.imgSrc = e.target.result
      _this.hasImg = true
      _this.imgLoading = false
    }
    fr.readAsDataURL(file)
  }
  _this.fileFormDate = file
}

//图片错误提示
const imgSizeError = (_this,tips) => {
  _this.$confirm(tips,{
    confirmButtonText: '确定',
    customClass: 'upload_window',
    type: 'warning'
  })
}

//编辑url
const urlEdit = function () {
  const _this = this
  _this.urlIsEidt = true
  _this.showSave = true
}

//取消编辑状态
const cancelEdit = function ({commit, state}, hasImg) {
  const _this = this
  formSet()
  _this.urlError = false
  _this.fileFormDate = null
  if(!hasImg) {
    _this.url = ""
    _this.hasImg = false
  } else {
    _this.urlIsEidt = false
    _this.url = _this.brand_data.linkUrl
    _this.imgSrc = _this.brand_data.imgUrl
    _this.showSave = false
  }
}

//图片上传
const uploadSubmit = async function () {
  var imgObj = {}
  const _this = this,
      reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
  if(!_this.hasImg) {
    imgSizeError(_this,'请上传图片')
    return false
  }
  if (!reg.test(_this.url) && _this.url != "") {
    _this.urlError = true
    return false
  } else {
    _this.urlError = false
  }
  _this.brandLoading = true
  if(_this.fileFormDate) {
    imgObj = await uploadImgApi(_this.fileFormDate)
  } else {
    imgObj = {
      url: _this.imgSrc
    }
  }
  const res = await saveCustomDetailApi({organId: _this.organId, imgUrl: imgObj.url, linkUrl: _this.url})
  if(res) {
    _this.showSave = false
    getCustomDetail({},{organId: _this.organId},_this)
  }
}

//表单重置
const formSet = function () {
  const _form = document.getElementById('J_from')
  _form.reset()
}

export default mapActions({
  init,
  getFile,
  cancelEdit,
  uploadSubmit,
  urlEdit,
  getCustomDetail,
})
