/**
 * Created by 吴豪 on 2017/4/11.
 */
import {uploadImgApi} from '../../../../../api/custom'

import {getWcatchDetailApi,saveWchatDetailApi} from '../../../../../api/wchat'

import {mapActions} from '../../../../../utils/vuex'

import { savelocalStorage } from '../../../../../api/common'

import MyEditor from '../../../../../components/rich-editor/index'

const init = function ({commit, state}, val) {
  const _this = this
  _this.organId = val.id

  this.getCustomDetail({organId: _this.organId},_this)
}

//获取定制详情
const getCustomDetail = async function({commit, state},{organId}, _this) {
  _this.wchatLoading = true
  const res = await getWcatchDetailApi({organId})
  if(res) {
    _this.wchat_data = res
    _this.wchat_imgurl = _this.wchat_data.organCustomImgUrl
    _this.wchat_title  = _this.wchat_data.organCustomTitle
    _this.wchat_desc  = _this.wchat_data.organCustomBrief
    _this.wchat_author = _this.wchat_data.organCustomContentAuthor
    _this.wchat_link  = _this.wchat_data.organCustomLinkUrl
    _this.wchat_content = _this.wchat_data.organCustomContent

    _this.contentType = (_this.wchat_link != null && _this.wchat_link.length > 0)?"1":"0"
  }

  if(_this.wchat_imgurl != null && _this.wchat_imgurl.length > 0) {
    _this.hasImg = true
    _this.hasNew = false
    _this.hasEdit = false
  }


  if(_this.isFirst) {
    let myEditor = new MyEditor()
    myEditor.create('wangeditor')
    this.myEditor = myEditor
    _this.isFirst = false
  }

  this.myEditor.setContent(_this.wchat_content || "")

  if(!_this.hasEdit) {
    this.myEditor.disable()
  }

  _this.wchatLoading = false
}

//进入编辑状态
const wchatEdit = function () {
  const _this = this;
  _this.hasEdit = true
  _this.hasNew = false
  this.myEditor.enable()
}

//取消编辑状态
const cancleEdit = function ({commit, state}, hasNew) {
  const _this = this
  _this.fileFormDate = null
  _this.errorItem.isTitleError = false
  _this.errorItem.isDescError = false
  _this.errorItem.isLinkError = false
  _this.errorItem.isAuthorError = false

  if(hasNew) {
    _this.hasImg = false
    _this.wchat_imgurl = null
    _this.wchat_title  = null
    _this.wchat_desc  = null
    _this.wchat_author = null
    _this.wchat_link  = null
    _this.wchat_content = null
    _this.contentType = "0"
  } else {
      this.myEditor.disable()
      _this.hasEdit = false
      if(_this.wchat_data != null) {
        _this.wchat_imgurl = _this.wchat_data.organCustomImgUrl
        _this.wchat_title  = _this.wchat_data.organCustomTitle
        _this.wchat_desc  = _this.wchat_data.organCustomBrief
        _this.wchat_author = _this.wchat_data.organCustomContentAuthor
        _this.wchat_link  = _this.wchat_data.organCustomLinkUrl
        _this.wchat_content = _this.wchat_data.organCustomContent

        _this.contentType = (_this.wchat_link != null && _this.wchat_link.length > 0)?"1":"0"
      }
  }

  this.myEditor.setContent(_this.wchat_content || "")
}

//获取图片
const getFile = function ({commit, state},{target}) {
  const file = target.files[0],
    _this = this
  _this.imgLoading = true
  if((file.type != 'image/png' && file.type != "image/jpeg" && file.type != "image/jpg" ) || file.size/1024/1024 >= 2) {
    _this.imgLoading = false
    if(file.type != 'image/png' && file.type != "image/jpeg" && file.type != "image/jpg") {
      showErrorTips(_this,'图片必须为PNG格式','消息提醒')
    } else {
      showErrorTips(_this,'图片超过2M，请重新选择','消息提醒')
    }
    formSet()
    return false
  }

  if(window.FileReader) {
    var fr = new FileReader()
    fr.onload = function(e) {
      _this.wchat_imgurl = e.target.result
      _this.hasImg = true
      _this.imgLoading = false
    }
    fr.readAsDataURL(file)
  }
  _this.fileFormDate = file
}

//错误提示
const showErrorTips = (_this,tips) => {
  // _this.$confirm(tips,{
  //   confirmButtonText: '确定',
  //   customClass: 'upload_window',
  //   type: 'warning'
  // })
  _this.$message({
    message: tips,
    type: 'warning',
  })
}

//表单重置
const formSet = function () {
  const _form = document.getElementById('J_from')
  _form.reset()
}

//生成预览
const wchatPreviewSave = function () {
  const _this = this;
  savelocalStorage("wchat_preview_contentType",_this.contentType);
  savelocalStorage("wchat_preview_wchat_imgurl",_this.wchat_imgurl);
  savelocalStorage("wchat_preview_wchat_title",_this.wchat_title);
  savelocalStorage("wchat_preview_wchat_desc",_this.wchat_desc);
  savelocalStorage("wchat_preview_wchat_link",_this.wchat_link);
  if(_this.hasEdit) {
    const content = this.myEditor.getContent()
    _this.wchat_content = content
  }
  savelocalStorage("wchat_preview_wchat_content", _this.wchat_content);

  window.open("#/previewwchat/0","preview_list")
};

//提交保存
const wchatSaveSubmit = async function () {
  const _this = this

  let imgObj = {}
  //图片判断
  const reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
  if(!_this.hasImg) {
    showErrorTips(_this,'请上传图片')
    return false
  }

  if(_this.titleLen == 0 || _this.titleLen > _this.titleMaxLen) {
    _this.errorItem.isTitleError = false
    showErrorTips(_this,'标题为必填项，字数在32个汉字以内')
    return false
  } else {
    _this.errorItem.isTitleError = false
  }

  if(_this.descLen == 0 || _this.descLen > _this.descMaxLen) {
    _this.errorItem.isDescError = false
    showErrorTips(_this,'描述为必填项，字数在32个汉字以内')
    return false
  } else {
    _this.errorItem.isDescError = false
  }

  if(_this.contentType === "1") {
    if (!reg.test(_this.wchat_link) || _this.wchat_link == null || _this.wchat_link.length < 1) {
      _this.errorItem.isLinkError = true
      showErrorTips(_this,'详情链接输入错误，请填写正确的详情链接')
      return false
    } else {
      _this.errorItem.isLinkError = false
    }
  } else {
    if(_this.authorLen > _this.authorMaxLen) {
      _this.errorItem.isAuthorError = true
      showErrorTips(_this,'作者字数在8个汉字以内')
      return false
    } else {
      _this.errorItem.isAuthorError = false
    }
  }

  _this.errorItem.isTitleError = false
  _this.errorItem.isDescError = false
  _this.errorItem.isLinkError = false
  _this.errorItem.isAuthorError = false

  _this.wchatLoading = true
  //图片提交
  if(_this.fileFormDate) {
    imgObj = await uploadImgApi(_this.fileFormDate)
  } else {
    imgObj = {
      url: _this.wchat_imgurl
    }
  }

  //重新赋值文本和图片
  const content = this.myEditor.getContent()
  _this.wchat_content = content
  _this.wchat_imgurl = imgObj.url

  //保存
  let organCustomLinkUrl = null
  let organCustomContentAuthor = null
  let organCustomContent = null
  if(_this.contentType === "0") {
    organCustomContentAuthor = _this.wchat_author;
    organCustomContent =  _this.wchat_content
  } else {
    organCustomLinkUrl = _this.wchat_link
  }
  const res = await saveWchatDetailApi({
    id: _this.organId,
    organCustomLogo: null,
    organCustomImgUrl: _this.wchat_imgurl,
    organCustomTitle: _this.wchat_title,
    organCustomBrief: _this.wchat_desc,
    organCustomLinkUrl: organCustomLinkUrl,
    organCustomContentAuthor: organCustomContentAuthor,
    organCustomContent: organCustomContent
  })

  //成功处理
  if(res) {
    _this.hasEdit = false
    _this.hasNew = false
    this.myEditor.disable()

    this.getCustomDetail({organId: _this.organId},_this)
  }

  _this.wchatLoading = false
}

//获取字符长度
const getStrLength = (str) => {
  if(str == null || str.length < 1)
    return 0;

  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let a = str.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null)
    {
      len += 2;
    }
    else
    {
      len += 1;
    }
  }
  return len;
}

//计算输入框长度
const calcInputLength = function({commit, state},type,val) {
  const _this = this
  if(type === "title") {
    _this.titleLen = val?val.length:0 || 0//getStrLength(val)/2;
  } else if(type === "desc") {
    _this.descLen = val?val.length:0 || 0//getStrLength(val)/2;
  } else if(type === "author") {
    _this.authorLen = val?val.length:0 || 0//getStrLength(val)/2;
  }
}

//获取页面文本框提示
const getInputPlaceHolderForType = function ({commit, state},type,isShow) {
  if(!isShow)
    return ""

  switch(type) {
    case "title":
      return "请输入标题"
    case "desc":
      return "请输入描述"
    case "link":
      return "请输入详情链接"
    case "author":
      return "请输入作者"
  }
}

//检查输入错误
const checkInput = function ({commit, state},type) {
  const _this = this
  if(type == 'title') {
    if(_this.titleLen == 0 || _this.titleLen > _this.titleMaxLen) {
      _this.errorItem.isTitleError = true
    } else {
      _this.errorItem.isTitleError = false
    }
  } else if(type == 'desc') {
    if(_this.descLen == 0 || _this.descLen > _this.descMaxLen) {
      _this.errorItem.isDescError = true
    } else {
      _this.errorItem.isDescError = false
    }
  } else if(type == 'link') {
    const reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
    if (!reg.test(_this.wchat_link) || _this.wchat_link == null || _this.wchat_link.length < 1) {
      _this.errorItem.isLinkError = true
    } else {
      _this.errorItem.isLinkError = false
    }
  } else if(type == 'author') {
    if(_this.authorLen > _this.authorMaxLen) {
      _this.errorItem.isAuthorError = true
    } else {
      _this.errorItem.isAuthorError = false
    }
  }
}

export default mapActions ({
    init,
    getCustomDetail,
    wchatEdit,
    cancleEdit,
    getFile,
    wchatSaveSubmit,
    wchatPreviewSave,
    calcInputLength,
    getStrLength,
    getInputPlaceHolderForType,
    checkInput,
})
