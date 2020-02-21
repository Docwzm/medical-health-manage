import {
  CUSTOMER_INFO,
  LEFT_DEVICE_INFO,
  GET_CUSTOMER_COMMON,
} from '../../store/mutation-types'
import {NOW} from '../../constant'
export const MUTATION_NAME = 'views-customer-info-left'

export const def = {
  name: '',
  sex: 1,
  birthday: '',
  phone: '',
  remark: '',
  cardiovascularRiskFactors: {// 心血管病危险因素:是否吸烟,血脂异常,早发心血管家族史,肥胖,缺乏体力运动,C反应蛋白异常 ,
    isSmoking: 0, // 是否吸烟:-1.未设置,0.否,1.是 ,
    dyslipidemia: 0, // 是否血脂异常:-1.未设置,0.否,1.是 ,
    cardiovascularDisease: 0, // 早发心血管家族史:-1.未设置,0.否,1.是 ,
    isFat: 0, // 肥胖:-1.未设置,0.否,1.是 ,
    lackOfPhysical: 0, // 缺乏体力运动:-1.未设置,0.否,1.是 ,
    reactiveProteinC: 0, // C反应蛋白异常:-1.未设置,0.否,1.是
  },
  patientSource: 1, // 来源渠道:0.医生app,1.健康管理平台,2.公众号 ,
  created: NOW, // 创建时间戳 ,
}

// const dvi = [{
//   sn: "111",
//   qrcode: "https://www.baidu.com/",
//   model: "12345324",
//   userNo: 1,
//   name: "名字名字名字名字名字名字名字名字名字名字名字名字名字",
//   picture: "http://img.zcool.cn/community/03132e658574beea801219c775bb4db.jpg",
// }, {
//   sn: "222",
//   qrcode: "http://fanyi.baidu.com/#fra/zh/found%20in%20component",
//   model: "12345324",
//   userNo: 1,
//   name: "名字2222",
//   picture: "http://img.zcool.cn/community/03132e658574beea801219c775bb4db.jpg",
// }, {
//   sn: "333",
//   qrcode: "http://www.zcool.com.cn/img.html#src=http://img.zcool.cn/community/01083b58842ec0a8012060c8985d54.png",
//   model: "12345324",
//   userNo: 1,
//   name: "ghjkljhghjkljhgfhjkhgfhj名字2222",
//   picture: "http://img.zcool.cn/community/03132e658574beea801219c775bb4db.jpg",
// }]

export default {
  [MUTATION_NAME]: {
    state: {
      info: {},
      device: [],
      common: {
        pros: [],
        citys: []
      }
    },
    mutations: {
      [CUSTOMER_INFO] (state, info) {
        state.info = info ? {
          ...state.info,
          ...info
        } : {}
      },
      [LEFT_DEVICE_INFO] (state, device) {
        state.device = device ? [...state.device, ...device].filter((de, k) => de.sn === [...new Set([...state.device, ...device].map((dvi) => dvi.sn))][k]) : []
      },
      [GET_CUSTOMER_COMMON] (state, common) {
        state.common = common ? {
          ...state.common,
          ...common
        } : {}
      },
    }
  }
}
