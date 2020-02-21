export async function delay(n){
  return await new Promise(res=>setTimeout(res,n))
}

export function triggerEvent(elm,evtName){
  let evt = document.createEvent('Event')
  evt.initEvent(evtName,true,true)
  elm.dispatchEvent(evt)
}

export function getElmAttr(elm,attrName) {
  let attrs = elm.attributes

  for(let i = 0;i<attrs.length;i++){
    if(attrName==attrs[i].name){
      //alert(attrs[i].value)
      return attrs[i].value
    }
  }
}

export function mapObject(obj,fn){
 // let copied = JSON.parse(JSON.stringify(obj))
  let newObj = {}
  for(let p in obj){
    //console.log(12345,'xxx')
    let [k,v] = fn(p,obj[p])
    newObj[k] = v
  }
  return newObj
}
