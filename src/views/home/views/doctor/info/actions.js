import {
  getAssistantCountAPi,
  getQrCodeApi,
  getFollowCountApi,
  getPatientCountApi,
} from '../../../../../api/account'
import {
  getDoctorQrcodeApi,
  getDeviceListApi,
  getDeviceDetailApi,
} from '../../../../../api/doctor'
import {getlocalStorage} from '../../../../../api/common'
import {mapActions} from '../../../../../utils/vuex'
import QRCode from 'davidshimjs-qrcodejs'

//显示设备详情
const viewDevice = async function ({commit, state}, id, index, event) {
  const _this = this
  var _event = event
  _event.target.localName === 'li' ? _event = _event.target : _event = _event.target.parentElement
  _this.offsetLeft = _event.offsetLeft + 125
  _this.offsetTop = _event.offsetTop + 50
  _this.isShowDevice = true
  try {
    const res = await getDeviceDetailApi(id)
    _this.deviceDetail = res
    document.getElementById('qrcode').innerHTML = ""
    new QRCode(document.getElementById("qrcode"), {
      text: res.qrcode,
      width: 80,
      height: 80,
    })
  } catch (res) {
  }
}

const init = async function ({commit, state}) {
  const _this = this
  _this.doctorLoading = true

  if(getlocalStorage('roleType') != 1 || !getlocalStorage('roleType')) {
    //获取医生详情
    _this.doctorInfo = state['doctor-info']

    //获取助理数量
    await getAssistantCountAPi({}).then(function (res) {
      _this.doctorAssistant = res
    })
    //获取二维码
    await getQrCodeApi({}).then(function (res) {
      if(!res || res == '') {
        getDoctorCode(_this)
      } else {
        _this.qrCode = '//mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res
      }

    })
    //获取协助
    await getFollowCountApi({}).then(function (res) {
      _this.followCount = res
    })
    //获取用户总数
    await getPatientCountApi({}).then(function (res) {
      _this.patientCount = res
    })
  } else {
    _this.isAdmin = true
    _this.adminInfo = state['admin-info']
  }
}

const getDoctorCode = async function (_this) {
  const res = await getDoctorQrcodeApi()
  new QRCode(document.getElementById("doctorQrcode"), {
    text: res.qrcodeUrl,
    width: 120,
    height: 120,
  })
}

const infosHandle = function({commit, state}, obj) {
  const _this = this
  if(obj.prov) {
    if(obj.prov.name == obj.city.name) {
      _this.prov_city = obj.city.name
    } else {
      _this.prov_city = obj.prov.name+obj.city.name
    }
    _this.qrCode = '//mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' +  obj.qrcodeTicket
  }

}

//获取设备列表
const getDeviceList = async function ({}, doctorId) {
  const _this = this
  const res = await getDeviceListApi({doctorId: doctorId})
  _this.deviceList = res
}


export default mapActions({
  init,
  infosHandle,
  getDeviceList,
  viewDevice,
})