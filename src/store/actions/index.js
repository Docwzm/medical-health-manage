// root actions
import {
  INIT_ROOT_STATE,
  SET_ROOT_STATE_PROP,
  DOCTOR
}from '../mutation-types'
import {
  getDoctorApi
} from '../../api/account'
export default {
  async [INIT_ROOT_STATE](context){
     let doctorInfo =await getDoctorApi()
    context.commit(SET_ROOT_STATE_PROP,{
      propName:DOCTOR,
      data:doctorInfo
    })
  }
}
