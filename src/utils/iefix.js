// 解决ie下按回车不触发input元素change的问题
export default function iefix(){
  if(navigator.userAgent.toLowerCase().indexOf('trident')<0){
    return
  }

  document.addEventListener('keyup',(e)=>{
    if(e.keyCode==13){
      triggerEvent(e.srcElement,'change')
    }
  })
}

 function triggerEvent(elm,evtName){
  let evt = document.createEvent('Event')
  evt.initEvent(evtName,true,true)
  elm.dispatchEvent(evt)
}
