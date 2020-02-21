import {
  savelocalStorage,
} from '../../api/common'
export const toggleDom = function ({clientX, clientY, offsetX, offsetY, target}, value, isShow, offsetLeft, offsetTop) {
  const _this = this
  if (isShow) {
    _this.rowTipsShow = true
    if (typeof value == 'string') {
      _this.rowTipsVal = value
    } else {
      var html = ""
      for (var i in value) {
        if (value[i].name) {
          html += value[i].name + '，'
        }

      }
      _this.rowTipsVal = html
    }

  } else {
    _this.rowTipsShow = false
  }
  let leftVal = offsetLeft ? offsetLeft : 0,
      topVal = offsetTop ? offsetTop : 0
  const dom = document.getElementsByClassName('row-tips-con')[0],
      left = clientX - offsetX  + 50 + leftVal + 'px',
      top = clientY - offsetY - 50 + topVal +  'px'
  dom.style.cssText = `left:${left};top:${top};`

}

export const loadingHide = function (obj) {
  var id = setInterval(function(){
    savelocalStorage('loadingIntervalId',id)
      try{
        var dom = document.querySelector(obj)
        dom.parentNode.removeChild(dom)
      } catch(res) {}
      console.log("done")
  },1000)
}