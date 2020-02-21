import {mapActions} from '../../../../../utils/vuex'
import router from '../../../../../router'
// types
import {
  PATIENT_CHAT_RECORD, PATIENT_CHAT_MONTH_TIP
} from '../../../../../store/mutation-types'
// API
import {getTeamHisApi, getMonthTipApi, getTeamDayHisApi, upDateApi} from '../../../../../api/chat'
import {getDoctorApi} from '../../../../../api/account'
// getters
import {getPatient} from '../../../../../components/customerLeft/actions'
import {paramsGetter} from '../../../../../store/getters/route'
import {infoGetter} from '../../../../../components/customerLeft/getters'
import {recordGetter} from './getters'
// global
import moment from 'moment'
import {NOW} from '../../../../../constant'

let chatBoxBody = null
const init = async function (store) {
  store.commit(PATIENT_CHAT_RECORD)
  store.commit(PATIENT_CHAT_MONTH_TIP)
  const {id} = paramsGetter(store.state)
  await getPatient(store, id)
  this.doctor = await getDoctorApi()
  await getMsg(store)
  chatBoxBody = this.$refs.chatBoxBody
  if (chatBoxBody) {
    chatBoxBody.scrollTop = chatBoxBody.scrollHeight
  }
  updateDayList(store, this)
}
// 获取聊天记录
const getMsg = async({commit, state}, count = 1, date = NOW) => {
  commit(PATIENT_CHAT_RECORD)
  const {tid} = infoGetter(state)
  const res = await getTeamHisApi({tid, endTime: date, count: count * 20})
  await upDateApi({tid, readTime: NOW})
  commit(PATIENT_CHAT_RECORD, res)
}
// tab页面
const tabLink = (store, {name}) => {
  const {id} = paramsGetter(store.state)
  router.push({name, params: {id}})
}
// 获取更多，每次点击增加20条
let count = 1
const getMore = async function({commit, state}, This) {
  ++count
  const records = recordGetter(state)
  let lastTime = records[records.length - 1].CreateTime || NOW
  const _this = this || This
  _this.msgLoad = true
  lastTime = moment(lastTime).add(1, 'days').valueOf()
  await getMsg({commit, state}, count, lastTime || NOW)
  _this.msgLoad = false
  if (chatBoxBody) {
    chatBoxBody.scrollTop = chatBoxBody.scrollHeight
  }
}
// 获取每月那天有记录
const getMonthMsgTip = async({commit, state}, _this, date) => {
  const {tid} = infoGetter(state)
  const year = moment(date).year()
  const month = moment(date).month() + 1
  const res = await getMonthTipApi({tid, year, month})
  commit(PATIENT_CHAT_MONTH_TIP, res)
  // const monthTip = monthTipGetter(state)
  if (res) {
    _this.noData = false
    _this.dayList.map(function (day) {
      if (day.date) {
        Object.keys(res).map(function (m) {
          if (moment(day.date).date() === moment(res[m].date).date()) {
            day.count = res[m].count
          }
        })
      }
    })
  } else {
    _this.noData = true
  }
}
// 获取指定日期记录
const getDayMsg = async function ({commit, state}, date, num, index) {
  const {tid} = infoGetter(state)
  if (num > 0) {
    await upDateApi({tid, readTime: NOW})
    commit(PATIENT_CHAT_RECORD)
    this.idx = index
    this.msgLoad = true
    const res = await getTeamDayHisApi({tid, time: date})
    commit(PATIENT_CHAT_RECORD, res)
    count = 0
    // getMore({commit, state}, this, date)
    this.msgLoad = false
    if (chatBoxBody) {
      chatBoxBody.scrollTop = chatBoxBody.scrollHeight
    }
  } else {
    return false
  }
}
// 下个时间段
const next = function ({commit, state}, type) {
  this.time = moment(this.time).add(1, type + 's').valueOf()
  updateDayList({commit, state}, this)
}
// 上个时间段
const last = function ({commit, state}, type) {
  this.time = moment(this.time).subtract(1, type + 's').valueOf()
  updateDayList({commit, state}, this)
}
// 更新天列表
function updateDayList({commit, state}, _this) {
  _this.dayList = []
  _this.idx = null
  const m = moment(_this.time)
  const weekDay = m.startOf('month').weekday()
  const days = m.daysInMonth()
  for (let i = 0; i < weekDay; i++) {
    _this.dayList.push({})
  }
  for (let i = 1; i <= days; i++) {
    m.date(i)
    _this.dayList.push({
      text: i,
      count: 0,
      date: m.valueOf()
    })
  }
  getMonthMsgTip({commit, state}, _this, _this.time)
}

const clear = ({commit}) => commit(PATIENT_CHAT_RECORD)

export default mapActions({
  init,
  tabLink,
  getMore,
  getDayMsg,
  next,
  last,
  clear,
})
