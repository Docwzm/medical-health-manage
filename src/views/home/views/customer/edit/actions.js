import {mapActions} from '../../../../../utils/vuex'
import router from '../../../../../router'
// getter
import {infoGetter, commonGet} from './getters'
import {paramsGetter, queryGetter} from '../../../../../store/getters/route'
// actions
import {getCity} from '../../../../../store/actions/common'
import {showAlert} from '../../../../../store/actions/alert'
import {showConfirm} from '../../../../../store/actions/confirm'
// types
import {
  CUSTOMER_EDIT,
  GET_CUSTOMER_COMMON,
  DEVICE_INFO
} from '../../../../../store/mutation-types'
// apis
import {
  getPatientInfo, addPatientInfo, getPatientAs,
  editPatientInfo, delPatientInfo
} from '../../../../../api/patient'
import {getPatientDeviceApi} from '../../../../../api/device'
import {CREATE} from '../../../../../constant'
import {def} from './mutations'

export const getCityList = async function ({commit, state}, province) {
  const {pros} = commonGet(state)
  if (province) {
    const {citys} = pros[Object.keys(pros).filter((key) => pros[key].id === province)]
    commit(GET_CUSTOMER_COMMON, {pros, citys})
  } else {
    return false
  }
}
// 筛选出所选省下的市级
const getCitys = function ({commit, state}, key, eve) {
  changeValue({commit, state}, key, eve)
  const {pros} = commonGet(state)
  const {citys} = pros[Object.keys(pros).filter((key) => pros[key].id === eve)]
  commit(CUSTOMER_EDIT, {city: citys[0].id})
  commit(GET_CUSTOMER_COMMON, {citys})
}

const init = async function ({commit, state}) {
  commit(CUSTOMER_EDIT, {...def})
  commit(DEVICE_INFO, undefined)
  const {id} = paramsGetter(state)
  await getCity({commit, state}, 'pros')
  if (id === 'create') {
    const {pros} = commonGet(state)
    commit(GET_CUSTOMER_COMMON, {pros})
  } else {
    await getPatient({commit, state}, id)
  }
}

// 获取设备信息
const getPatientDevice = async({commit, state}) => {
  const {userId} = infoGetter(state)
  await getPatientDeviceApi(userId).then((res) => {
    commit(DEVICE_INFO, res)
  }).catch((res) => {
    showAlert(res.msg, 'warning')
  })
}
let infoData
// 获取患者信息
const getPatient = async({commit, state}, id) => {
  const {from} = queryGetter(state)
  const data = (from === 'patient_admin_info') ? await getPatientAs(id) : await getPatientInfo(id)
  const {qrcode: {ticket}, province, ...res} = data
  infoData = {qrcode: {qrcodeUrl: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURI(ticket)}`}, province, ...res}
  commit(CUSTOMER_EDIT, infoData)
  getPatientDevice({commit, state})
  await getCityList({commit, state}, province)
}
// 取消
const cancel = function (store) {
  const {id} = paramsGetter(store.state)
  if (id === 'create') {
    router.push({name: 'customer_list'})
  }
  this.isEdit = !this.isEdit
  store.commit(CUSTOMER_EDIT, infoData)
}
// 保存
const save = function (store) {
  this.$refs.customerForm.validate(async(valid) => {
    if (valid) {
      const {state} = store
      const {id} = paramsGetter(state)
      const info = infoGetter(state)
      if (id === CREATE) {
        await addPatient(store, info)
      } else {
        await editPatient(store, info)
      }
    } else {
      showAlert('请填写基本信息！', 'warning')
      return false
    }
  })
}
// 新增患者信息
const addPatient = async ({commit, state}, info) => {
  await addPatientInfo({...info}).then(() => {
    commit(CUSTOMER_EDIT, {})
    showAlert('创建用户成功！')
    // back()
    go({commit, state}, {name: 'customer_list'})
  }).catch((res) => {
    showAlert(res.msg, 'warning')
  })
}

// 编辑患者信息
const editPatient = async({commit, state}, info) => {
  await editPatientInfo({...info}).then(() => {
    showAlert('编辑用户成功！')
    // back()
    go({commit, state}, {name: 'customer_list'})
  }).catch((res) => {
    showAlert(res.msg, 'warning')
  })
}
// 删除患者信息
const delPatient = ({commit, state}) => {
  const {id, bindWechat} = infoGetter(state)
  const msg = bindWechat === 1 ? '是否删除该用户？若确认删除，将取消与该用户的微信关联，并删除该用户在健管平台和乐心医生app上的用户信息。' : '是否删除该用户？若确认删除，将删除该用户在健管平台和乐心医生app上的用户信息。'
  showConfirm(msg, '确认删除').then(async() => {
    await delPatientInfo(id).then(() => {
      showAlert('删除成功!')
      router.push({name: 'customer_list'})
    }).catch((res) => {
      showAlert(res.msg, 'warning')
    })
  })
}

const go = ({commit, state}, obj) => {
  router.push(obj)
}

// 改变数据
const changeValue = ({commit}, key, value) => {
  commit(CUSTOMER_EDIT, {[key]: value})
}
// 疾病类型选择
const chaninValue = ({commit, state}, key, value) => {
  const {cardiovascularRiskFactors} = infoGetter(state)
  commit(CUSTOMER_EDIT, {cardiovascularRiskFactors: {...cardiovascularRiskFactors, [key]: value}})
}
// 返回
const back = () => router.back()
// 清空
const clear = ({commit}) => commit(CUSTOMER_EDIT)

export default mapActions({
  init,
  clear,
  back,
  cancel,
  getCitys,
  save,
  go,
  delPatient,
  changeValue,
  chaninValue,
})
