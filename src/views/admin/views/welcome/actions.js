import{
  ADMININDEX,
} from '../../../../store/mutation-types'
import {
  mapActions,
} from '../../../../utils/vuex'
import {
  getDataStatisticsApi,
} from '../../../../api/admin'
import router from '../../../../router'
import {
  getlocalStorage,
} from '../../../../api/common'
import moment from 'moment'

const init = async function ({commit, state}) {

  const _this = this
  _this.adminInfo = state['admin-info']
  _this.lastLoginTime = getlocalStorage('lastLoginTime') ? moment(parseInt(getlocalStorage('lastLoginTime'))).format('YYYY.MM.DD') + '\t\n\r\t\n\r\t\n\r' + moment(parseInt(getlocalStorage('lastLoginTime'))).format('HH:mm') : moment().format('YYYY.MM.DD') + '\t\n\r\t\n\r\t\n\r' + moment().format('HH:mm')
  getDataStatistics({commit, state})
}

//获取数据
const getDataStatistics = async function ({commit, sate}) {
  const res = await getDataStatisticsApi()
  commit(ADMININDEX, res)
}

const goDoctorList = function() {
  router.push({name: 'doctor_list'})
}

const goUserList = function() {
  router.push({name: 'user_list'})
}

export default mapActions({
  init,
  getDataStatistics,
  goDoctorList,
  goUserList,
})