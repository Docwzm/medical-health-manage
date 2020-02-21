import {mapActions} from '../../utils/vuex'
import router from '../../router'
// getter
import {infoGetter} from './getters'
import {paramsGetter} from '../../store/getters/route'
// types
import {
  CUSTOMER_INFO,
  LEFT_DEVICE_INFO,
} from '../../store/mutation-types'
// apis
import {getPatientInfo, editPatientRemarkApi} from '../../api/patient'
import {getPatientDeviceApi} from '../../api/device'
// actions
import {showAlert} from '../../store/actions/alert'
import {def} from './mutations'
import {getCityList} from '../../../src/views/home/views/customer/edit/actions'

const init = async function (store) {
  store.commit(CUSTOMER_INFO)
  store.commit(LEFT_DEVICE_INFO)
  store.commit(CUSTOMER_INFO, {...def})
  const {id} = paramsGetter(store.state)
  getPatient(store, id)
}
// 获取设备信息
const getPatientDevice = async({commit, state}) => {
  const {userId} = infoGetter(state)
  const res = await getPatientDeviceApi(userId)
  commit(LEFT_DEVICE_INFO, res)
}

// 获取患者信息
export const getPatient = async({commit, state}, id) => {
  const {qrcode: {ticket}, remark, province, ...res} = await getPatientInfo(id)
  commit(CUSTOMER_INFO, {
    remark, province,
    qrcode: {qrcodeUrl: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURI(ticket)}`}, ...res
  })
  await getCityList({commit, state})
  await getPatientDevice({commit, state}, province)
}

// 编辑患者备注
const editPatientRemark = async({commit, state}) => {
  const {id, remark} = infoGetter(state)
  await editPatientRemarkApi({id, remark})
  await getPatient({commit, state}, id)
}
const tabLink = function ({state, commit}, {name}) {
  const {id} = paramsGetter(state)
  const {name: paName, bindWechat} = infoGetter(state)
  if (name === 'customer_chat' && bindWechat === 0) {
    this.activeName = 'patient_doctor_info'
    showAlert(`用户还未关联微信,不能与“${paName}”对话`, 'warning')
  } else {
    router.push({name, params: {id}})
  }
}

// 改变数据
const changeValue = ({commit}, key, value) => {
  commit(CUSTOMER_INFO, {[key]: value})
}

// 清空
const clear = ({commit}) => commit(CUSTOMER_INFO)

export default mapActions({
  init,
  clear,
  tabLink,
  changeValue,
  editPatientRemark,
})
