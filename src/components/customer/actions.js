//api提示
import router from '../../router'
export const apiTips = ((_this, msg, title, type) =>{
  _this.$notify({
    title: title,
    message: msg,
    type: type,
    duration: 2000,
    offset: 150,
  })
  if(msg == '客户端未登陆') {
    setTimeout(function(){
      router.push({path: '/'})
    },1500)
  }
})
//成功提示
export const successTips = function (_this, msg) {
  _this.$message({
    message: msg,
    type: 'success'
  })
}
//error提示
export const errorTips = function (_this, msg) {
  _this.$notify.error({
    title: '错误',
    message: msg,
    offset: 150,
  })
}
//校验年龄
export const AgeCheck = function () {
    const _this = this
  if (_this.minAge >= 0 || _this.minAge == "") {
  } else {
    _this.minAge = ""
    errorTips(_this, '年龄必须大于等于0')
  }
  if (_this.maxAge >= 0 || _this.maxAge == "") {
  } else {
    _this.maxAge = ""
    errorTips(_this, '年龄必须大于等于0')
  }
  if (_this.maxAge != "" && _this.minAge != "") {
    if (parseInt(_this.maxAge) < parseInt(_this.minAge)) {
      _this.maxAge = ""
      errorTips(_this, '输入值必须大于' + _this.minAge)
    }
  }
}