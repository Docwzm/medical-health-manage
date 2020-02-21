import {
  getExceptionApi,
  getImApi,
  getUnhandleApi,
  getFollowApi,
  getFollowRecordApi,
  getDayCountApi,
  getDoctorDataStatApi,
} from '../../../../api/index'
import {
  getDoctorApi,
} from '../../../../api/account'
import {
  getDoctorQrcodeApi
} from '../../../../api/doctor'
import {getlocalStorage} from '../../../../api/common'
import {
  mapActions,
} from '../../../../utils/vuex'
import QRCode from 'davidshimjs-qrcodejs'
import router from '../../../../router'
import moment from 'moment'

export const init = async function ({commit, state}) {
  const _this = this

  //判断是否管理员
  if (getlocalStorage('roleType') != 1 || !getlocalStorage('roleType')) {
    _this.doctorInfos = state['doctor-info']
    var id
    console.log(_this.doctorInfos.infos.accid)
    if (_this.doctorInfos.infos.accid) {
      id = _this.doctorInfos.infos.accid
    } else {
      const {accid} = await getDoctorApi({})
      id = accid
    }
    if (id) {
      const res = await getDoctorDataStatApi()
      console.log("-----")
      console.log(res)
      if(res.patientCount || res.patientCount == 0) {
        _this.docotorData = {...res}
      }
    }
  }
  //
  // clearInterval(timer)
  // upDateIm(_this)
  // var timer = setInterval(function () {
  //   upDateIm(_this)
  // }, 15000)
  // await getUnhandleApi({}).then(function (res) {
  //   _this.patient = res
  // })
  await getFollowApi({}).then(function (res) {
    _this.follow = res
  })
  await getFollowRecordApi({}).then(function (res) {
    _this.weekFollow = res
  })
  await getDayCountApi().then(function (res) {
    _this.today = res.todayCount
    _this.tomorrow = res.tomorrowCount
  })
}

//未读消息
const upDateIm = function (_this) {
  getImApi({}).then(function (res) {
    _this.IM = res
  })
}

//生成二维码
const createCode = async function ({commit}, codeUrl) {
  var res
  if (!codeUrl) {
    res = await getDoctorQrcodeApi()
  }
  new QRCode(document.getElementById("doctorCode"), {
    text: codeUrl ? codeUrl : res.qrcodeUrl,
    width: 80,
    height: 80,
  })
}

const goList = function () {
  router.push({name: 'customer_list'})
}

const goGroup = function () {
  router.push({name: 'customer_group'})
}

const goMessage = function ({}, type) {
  router.push({name: 'doctor_message_list', params: {type : type}})
}


export default mapActions({
  init,
  createCode,
  goList,
  goGroup,
  goMessage,
})
