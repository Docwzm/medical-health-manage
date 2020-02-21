import moment from 'moment'
const cutLength = function (val, num) {
  if (val.length > num) {
    return val.substring(0, num) + "..."
  } else {
    return val
  }
}

const timeFilter = function (obj) {
  if (obj) {
    return moment(obj).format('YYYY.MM.DD')
  } else {
    return "未到期"
  }
}
const paymentStatusFilter = function (val) {
  return "支付成功"
  // switch (val) {
  //   case 1:
  //     return "未支付"
  //     break
  //   case 2:
  //     return "支付成功"
  //     break
  //   case 3:
  //     return "支付失败"
  //     break
  //   case 4:
  //     return "取消支付"
  //     break
  //   case 5:
  //     return "转入退款"
  //     break
  // }
}

const orderIdFilter = function(val) {
  return cutLength(val, 16)
}

const nameFilter = function(val) {
  return cutLength(val, 5)
}

const totalFilter = function(val) {
  var val = val + ''
  if(val.indexOf('.') != -1) {
    var newVal = val.split('.')[1]
    if(newVal.length > 2) {
      return val.split('.')[0] + '.' + val.split('.')[1].substring(0,2)
    }else {
      return val
    }
  }else {
    return val
  }
}

export default {
  timeFilter,
  paymentStatusFilter,
  orderIdFilter,
  nameFilter,
  totalFilter,
}