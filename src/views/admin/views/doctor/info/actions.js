import {
  mapActions,
} from '../../../../../utils/vuex'

import router from '../../../../../router'
import {
  DOCTORDETAIL,
  DOCTORDEVICELIST,
  DEVICEDETAIL,
} from '../../../../../store/mutation-types'

import {
  getDoctorDetailApi,
  getDeviceListApi,
  getDeviceDetailApi,
  getDoctorQrcodeByIdApi,
} from '../../../../../api/doctor'
import QRCode from 'davidshimjs-qrcodejs'
const init = function ({commit, state}, {id}) {
  const _this = this
  _this.doctorId = id
  getDoctorDetail({commit, state}, _this.doctorId, _this)
  getDeviceList({commit, state}, _this.doctorId, _this)

}

//订单详情
const goOrder = function ({commit, state}) {
  router.push({name: 'doctor_order', params: {id: this.doctorId}})
}

const getDeviceList = async function ({commit, state}, id, _this) {
  try {
    const res = await getDeviceListApi({doctorId: id}, _this)
    commit(DOCTORDEVICELIST, res)
  } catch (res) {

  }
}

const getDoctorDetail = async function ({commit, state}, id, _this) {
  _this.infoLoading = true
  try {
    const res = await getDoctorDetailApi({doctorId: id})
    _this.infoLoading = false
    commit(DOCTORDETAIL, res)
    var codeUrl
    if (!res.qrcodeUrl) {
      codeUrl = await getDoctorQrcodeByIdApi({doctorId:_this.doctorId})
    }

    new QRCode(document.getElementById("doctorCode"), {
      text: res.qrcodeUrl ? res.qrcodeUrl : codeUrl,
      width: 100,
      height: 100,
    })
  } catch (res) {
    _this.infoLoading = false
  }

}
//显示设备详情
const viewDevice = async function ({commit, state}, id, index, event) {
  const _this = this
  var _event = event
  _event.target.localName === 'li' ? _event = _event.target : _event = _event.target.parentElement
  _this.offsetLeft = _event.offsetLeft + 125
  _this.offsetTop = _event.offsetTop - 50
  _this.isShowDevice = true
  try {
    const res = await getDeviceDetailApi(id)
    commit(DEVICEDETAIL, res)
    document.getElementById('qrcode').innerHTML = ""
    new QRCode(document.getElementById("qrcode"), {
      text: res.qrcode,
      width: 80,
      height: 80,
    })
  } catch (res) {
  }
}


export default mapActions({
  init,
  goOrder,
  viewDevice,
})