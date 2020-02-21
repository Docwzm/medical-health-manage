// Copied from vue/src/core/util/debug.js
// import {mapActions} from '../../../../src/utils/vuex'

let warn = () => {
}

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined'

  warn = (msg, vm) => {
    if (hasConsole) {
      console.error(`[Vue warn]: ${msg} ` + (
              vm ? formatLocation(formatComponentName(vm)) : ''
          ))
    }
  }

  const formatComponentName = vm => {
    if (vm.$root === vm) {
      return 'root instance'
    }
    const name = vm._isVue
        ? vm.$options.name || vm.$options._componentTag
        : vm.name
    return name ? `component <${name}>` : `anonymous component`
  }

  const formatLocation = str => {
    if (str === 'anonymous component') {
      str += ` - use the "name" option for better debugging messages.`
    }
    return `(found in ${str})`
  }
}

export {warn}

export function getNums(num, type) { // 时间 往前推
  type = type || 'day'
  const d = new Date()
  if (type === 'day') { // 天数往前
    if (d.getDate() < num) {
      // 上个月的总天数
      const fMonth = ((d.getMonth() === 0) ? (12) : (d.getMonth()));
      const curMonthDays = new Date(d.getFullYear(), fMonth, 0).getDate()
      const nDays = curMonthDays - (num - d.getDate())
      const fDays = [...new Array(curMonthDays)].map((t, index) => index + 1)
      const fir = fDays.slice(nDays, fDays.length)
      return [...fir, ...[...new Array(d.getDate())].map((t, index) => index + 1)]
    } else {
      let gDa = [...new Array(d.getDate())].map((t, index) => index + 1)
      return gDa.slice((gDa.length - num), gDa.length)
    }
  }

  if (type === 'month') { // 月份往前
    const nowMo = d.getMonth() + 1
    let mDa = [...new Array(12)].map((t, index) => index + 1)
    if (nowMo < num) {
      const fir = mDa.slice((mDa.length - (num - nowMo)), mDa.length)
      return [...fir, ...[...new Array(nowMo)].map((t, index) => index + 1)]
    } else {
      let mDas = [...new Array(nowMo)].map((t, index) => index + 1)
      return mDas.slice((mDas.length - num), mDas.length)
    }
  }

}

export function getlineArr(arr, value, type, keys, none) { // 取出指定参数 数据集合
  let obj = {}
  none = none || '--'
  keys = keys  || 'day'
  const times = [...new Array(24)].map((t, index) => index)
  const tipArr = {
    'day': times,
    'week': getNums(7),
    'month': getNums(30),
    'year': getNums(12, 'month')
  }[type]

  arr.map(function (te) {
    const name = {
      'day': new Date(te[keys]).getHours(),
      'week': new Date(te[keys]).getDate(),
      'month': new Date(te[keys]).getDate(),
      'year': new Date(te[keys]).getMonth() + 1
    }[type]
    obj = Object.assign(obj, {[name]: te[value]})
  })

  return tipArr.map((t) => obj[t]).map((t2) => t2 === undefined ? none : t2)
}

function arrange(source) { // 检索出连续的数值
  let t
  let ta
  let r = []
  source.forEach(function (v) {
    if (t === v) {
      ta.push(t)
      t++
      return
    }
    ta = [v]
    t = v + 1
    r.push(ta)
  })
  return r
}

export function splitArr(oldArr, none) {
  none = none || '--'
  let f = []
  let y = []
  // 总的长度
  const tLength = oldArr.length
  // 分离出空值 与 有值的，下标
  oldArr.map((o, i) => o === none && f.push(i))
  oldArr.map((o, i) => o !== none && y.push(i))
  // 转化为二维数组，分离下标 是否连续
  let f1 = arrange(f)
  let y1 = arrange(y)
  // 分离出各自集合
  let f2 = []
  f1.map((f) => { // 虚线集合
    if (f1[0].length < 1 || f1[f1.length - 1].length < 1) {
    } else {
      const fir = f[0]
      const las = f[f.length - 1]
      if (las === (tLength - 1) || fir === 0) {
      } else {
        f.unshift(fir - 1)
        f.push(las + 1)
        f2.push(f)
      }
    }
  })
  // 实线集合
  let y2 = y1.filter((y) => y.length > 0)
  // 填充数据后的 实线集合
  let sData = []
  y2.map((yy) => {
    // 过滤掉多条实线中 只有一个数据的实线
    if ((yy.length > 1 && y2.length > 1) || y2.length < 2) {
      sData.push(setSolidData(yy, tLength, oldArr, none))
    }
  })

  // let hbArr = []
  // let bbArr = []
  // console.log('这是虚线的数组大集合 未合并前', f2)
  // f2.map((yy, i) => {
  //   //
  //   let pre = f2[i - 1]
  //   let next = f2[i + 1]
  //   let last = f2[f2.length - 1]
  //   // 判断是否 是最后一条
  //   let isLast = i === (f2.length - 1)
  //   // 对比每条 是否有临近的虚线
  //   console.log('cccccccc', !isLast)
  //   let ljLine = !isLast && yy[yy.length - 1] === next[0]
  //   // 最后一条与前一条 是否临近
  //   const laLine = f2.length !== 1 && isLast && last[0] === pre[pre.length - 1]
  //   // const laLine = false
  //
  //   // 合并临近的虚线
  //   if (!isLast && ljLine) {
  //     console.log('kkkkkk')
  //
  //     // hbArr.push(yy[0])
  //     // hbArr.push(yy[yy.length - 1])
  //     // if (isLast && laLine) {
  //     //   hbArr.push(last[0])
  //     //   hbArr.push(last[last.length - 1])
  //     // }
  //   } else {
  //     bbArr.push([yy[0], yy[yy.length - 1]])
  //   }
  // })
  // const f3 = hbArr.length > 1 ? [...bbArr, [...new Set(hbArr)]] : bbArr

  // console.log('这是实线的数组大集合', sData)

  // 填充数据后的 虚线集合
  let xData = []
  // console.log('这是虚线的数组大集合 未填充前', f3)
  f2.map((yy, i) => xData.push(setDashedData(yy, tLength, oldArr, none)))
  // console.log('这是虚线的数组大集合', xData)
  // console.log('Solid', sData, 'Dashed', xData)
  return {'Solid': sData, 'Dashed': xData}
}

function setDashedData(f21, len, oldArr, none) { // 对单条 虚线集合 进行填充数据
  none = none || '--'
  let data = [...new Array(len)].map((v, k) => none)
  f21.map((f) => {
    data[f] = oldArr[f]
  })
  return data
}

function setSolidData(y21, len, oldArr, none) { // 对单条 实线集合 进行填充数据
  none = none || '--'
  let newArr = [...new Array(len)].map(() => none)
  if (y21.length > 1) {
    // 根据下标 取出数值
    const data = oldArr.slice(y21[0], y21[y21.length - 1] + 1)
    newArr.splice(y21[0], data.length, data)
    newArr = [].concat.apply([], newArr)
  } else {
    newArr[y21[0]] = oldArr[y21[0]]
  }
  return newArr
}

// export default mapActions({
//   warn,
//   getlineArr,
//   splitArr
// })
