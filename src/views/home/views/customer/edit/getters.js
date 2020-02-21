import {MUTATION_NAME} from './mutations'
import {mapGetters} from '../../../../../utils/vuex'
import {commonGetter} from '../../../../../store/getters/common'
// validator
import {inputNumValidator, inputValidator, selectValidator, nameValidator, mobileValidator,
  IDCardValidator, insurcodeValidator
} from '../../../../../../src/validator'

// 校验规则
const rules = (state) => {
  return {
    name: nameValidator('请输入正确的姓名！'),
    birthday: selectValidator('请选择出生日期', 'number'),
    sex: selectValidator('请选择性别', 'number'),
    phone: mobileValidator(),
    emergencyPhone: mobileValidator({required: false}),
    weight: inputNumValidator({message: '体重输入有误'}),
    height: inputNumValidator({message: '身高输入有误'}),
    waistline: inputNumValidator({message: '腰围输入有误'}),
    idNO: IDCardValidator({required: false}),
    insurcode: insurcodeValidator({required: false}),
    emergencyName: inputValidator(),
    // address: inputValidator(),
  }
}

// 用户详情
export const infoGetter = (state) => state[MUTATION_NAME].info
export const deviceGetter = (state) => state[MUTATION_NAME].device
// 获取公共
export const commonGet = (state) => {
  return {
    ...commonGetter(state),
    ...state[MUTATION_NAME].common,
  }
}

export default mapGetters({
  rules,
  common: commonGet,
  info: infoGetter,
  device: deviceGetter
})
