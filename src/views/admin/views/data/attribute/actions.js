import echarts from 'echarts'
import moment from 'moment'
import {
  mapActions,
} from '../../../../../utils/vuex'
import {
  getOrganBaseApi,
  getOrganActiveUserApi,
  getNewAddUserApi,
  getUserBindDeviceApi,
  getUpdateDataApi,
} from '../../../../../api/data'
import {apiTips} from '../../../../../components/customer/actions'

const init = function ({commit, state}) {
  const _this = this
  _this.adminInfo = state['admin-info']
}

//获取基础数据
const getOrganBase = async function ({commit, state}, id) {
  const _this = this
  try {
    const res = await getOrganBaseApi({organId: id})
    if(res.organId) {
      _this.baseData = {
        ...res,
      }
      ageChart(_this, [res.age1, res.age2, res.age3, res.age4, res.age5])
      fromChart(_this, [res.patientSource, res.patientSource1, res.patientSource2, res.patientSource3, res.patientSource4])
      sexChart(_this, [res.man, res.woman])
      _this.userTotal = res.total
    } else {
      ageChart(_this, [0, 0, 0, 0, 0], true)
      fromChart(_this, [0, 0, 0, 0, 0], true)
      sexChart(_this, [0, 0], true)
    }
  } catch (res) {
    apiTips(_this, `基础统计 ${res.msg}`, '错误', 'error')
    console.log("chart error!")
  }
}

//活跃用户
const getActiveUser = async function ({commit, state}, id) {
  const _this = this
  try {
    const res = await getOrganActiveUserApi({organId: id})
    if(res.dimActiveUserAnalysisDayDto) {
      _this.activeUser = {
        ...res,
      }
      _this.activeUserVal = {
        ..._this.activeUser.dimActiveUserAnalysisDayDto,
      }
    }
  } catch (res) {
    apiTips(_this, `活跃用户统计 ${res.msg}`, '错误', 'error')
    console.log("chart error!")
  }
}

//新增用户
const getNewUser = async function ({commit, state}, id) {
  const _this = this
  try {
    const res = await getNewAddUserApi({organId: id})
    if(res.dimNewAddUserAnalysisDayDto) {
      _this.newUser = {
        ...res,
      }
      _this.newUserVal = {
        ..._this.newUser.dimNewAddUserAnalysisDayDto,
      }
    }
  } catch (res) {
    apiTips(_this, `新增用户 ${res.msg}`, '错误', 'error')
    console.log("chart error!")
  }
}

//绑定设备
const getBindDevice = async function ({commit, state}, id) {
  const _this = this
  try {
    const res = await getUserBindDeviceApi({organId: id})
    if(res.organId) {
      _this.bindDeviceData = {
        ...res,
      }
      bindChart(_this, [res.bindDevice, res.unbindDevice])
    } else {
      bindChart(_this, [0, 0], true)
    }
  } catch (res) {
    apiTips(_this, `绑定设备 ${res.msg}`, '错误', 'error')
    console.log("chart error!")
  }
}

//上传数据
const getUploadData = async function ({commit, state}, id) {
  const _this = this
  try {
    const res = await getUpdateDataApi({organId: id})
    if(res.uploadData) {
      _this.updateDate = {
        ...res,
      }
    }
  } catch (res) {
    apiTips(_this, `上传数据 ${res.msg}`, '错误', 'error')
    console.log("chart error!")
  }
}

//年龄构成
const ageChart = function (_this, data, isNone) {
  _this.ageChart = [
    {value: data[0], name: '小于25岁'},
    {value: data[1], name: '25-35岁'},
    {value: data[2], name: '36-55岁'},
    {value: data[3], name: '56-65岁'},
    {value: data[4], name: '65岁以上'}
  ]
  chartInit(isNone, 'attribute-age-chart', '用户年龄构成', _this.ageChart, ['#20A0FF', '#35BF32', '#F7BA2A', '#FF9404', '#FF4949'])
}

//用户来源
const fromChart = function (_this, data, isNone) {
  _this.fromChart = [
    {value: data[0], name: 'APP'},
    {value: data[1], name: '健康管理平台'},
    {value: data[2], name: '微信'},
    {value: data[3], name: '海外运动app'},
    {value: data[4], name: '助理平台'}
  ]
  chartInit(isNone, 'attribute-from-chart', '用户来源构成', _this.fromChart, ['#20A0FF', '#35BF32', '#F7BA2A', '#FF9404', '#FF4949'])
}

//性别比例
const sexChart = function (_this, data, isNone) {
  _this.sexChart = [
    {value: data[0], name: '男'},
    {value: data[1], name: '女'}
  ]
  chartInit(isNone, 'attribute-sex-chart', '用户性别比例', _this.sexChart, ['#20A0FF', '#F7BA2A'])
}

//绑定设备比例
const bindChart = function (_this, data, isNone) {
  _this.bindChart = [
    {value: data[0], name: '已绑定设备'},
    {value: data[1], name: '未绑定设备'}
  ]
  chartInit(isNone, 'attribute-bind-chart', '用户绑定设备比例', _this.bindChart, ['#F7BA2A', '#35BF32'])
}

const chartInit = function (isNone, dom, name, seriesData, colors, formatter) {
  var chart = echarts.init(document.getElementById(dom)),
      noneDom = document.getElementById(dom+'-none'),
      data = [],
      legendData = []
  if(!isNone) {
    seriesData.forEach(({value,name}) => {
      if(value != 0) {
        noneDom.style.display = 'none'
        legendData.push(name)
        data.push({value: value, name: name})
      }
    })
  } else {
    seriesData.forEach(({value,name}) => {
      legendData.push(name)
      data.push({value: value, name: name})
    })
  }
  chart.setOption({
    title: {
      show: false,
    },
    tooltip: {
      trigger: 'item',
      formatter: formatter ? formatter : "{b} : {c}人  ({d}%)"
    },
    legend: {
      orient: 'vertical',
      data: legendData,
      x: 20,
      y: 20,
      textStyle: {
        color: '#000',
      },
      itemGap: 15,
      itemWidth: 12,
      itemHeight: 12,
      formatter: function (name) {
        return ' ' + name
      }
    },
    series: [
      {
        name: name,
        type: 'pie',
        radius: 100,
        center: ['50%', '50%'],
        data: data,
        color: colors,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{b} {c}人'
            }
          },
        }
      }
    ]
  })
}

const addUsers = function ({commit, state}, cricle, perCentRight, perCentLeft, cricleNum, val) {
  cricleAnimate(cricle, perCentRight, perCentLeft, cricleNum, val)
}

const activeUsers = function ({commit, state}, cricle, perCentRight, perCentLeft, cricleNum, val) {
  cricleAnimate(cricle, perCentRight, perCentLeft, cricleNum, val)
}

const cricleAnimate = function (cricleDom, perCentRight, perCentLeft, cricleNum, val) {
  const cricle = document.getElementsByClassName(cricleDom)[0],
      percentRight = document.getElementsByClassName(perCentRight)[0],
      percentLeft = document.getElementsByClassName(perCentLeft)[0],
      nums = document.getElementsByClassName(cricleNum)[0]
  cricle.className = 'circle' + ' ' + cricleDom
  percentRight.className = 'percent percent-right wth0 ' + perCentRight
  percentLeft.style.transform = "rotate(0deg)"
  if(val < 0) {
        val = 0
  } else {
        val *= 100
  }
  if(val > 50) {
    cricle.className = 'circle clip-auto ' + cricleDom
    percentRight.className = 'percent percent-right ' + perCentRight
    percentLeft.style.transform = "rotate(0deg)"
  } else {
    percentLeft.style.transform = "rotate(" + (18 / 5) * val + "deg)"
  }
  nums.text = val
}

const titleTipsShow = function ({}, type, {clientX, clientY, offsetX, offsetY, target}) {
  const _this = this
  switch (type) {
    case 1:
      _this.titleTipsTxt = '截止统计时间，来自医生获取以及来自机构获取的所有新增用户的总和，以及环比增长比例。<br><br>环比新增比例是指在日、月、年维度下，本期的新增用户数据占上一期的用户总数的比例。'
      break
    case 2:
      _this.titleTipsTxt = '截止统计时间，来自医生获取以及来自机构获取的、上传过一笔以上测量数据的所有活跃用户总和。以及活跃用户的环比增长。<br><br>活跃用户新增比例是指在日、月、年维度下，本期新增活跃用户占上一期的活跃用户总数的比例。'
      break
    case 3:
      _this.titleTipsTxt = '截止统计时间，来自医生获取以及来自机构获取的所有用户的年龄构成情况，按照小于25岁，26到35岁，36到55岁，56到65岁，65岁以上的年龄段划分用户，并统计每一年龄段的用户人数和占比。'
      break
    case 4:
      _this.titleTipsTxt = '截止统计时间，通过医生获取和机构获取的所有用户中，来自公众号渠道、乐心医生app渠道以及健康管理平台渠道的用户的占比。'
      break
    case 5:
      _this.titleTipsTxt = '截止统计时间，来自医生获取以及来自机构获取的所有用户的性别比例。'
      break
    case 6:
      _this.titleTipsTxt = '截止统计时间，来自医生获取以及来自机构获取的所有用户中，已绑定设备的用户与未绑定设备用户的比例。'
      break
  }

  _this.titleTipsTxt += '<br><br>注：当天新增的数据将在第二天统计，已被统计过的用户的历史测量数据即使被删除，则仍会被计入统计数据图表中。'

  var dom = document.getElementsByClassName('title-tips-win')[0],
      left = clientX - offsetX + 'px',
      top = clientY - offsetY + 42 + 'px'
  dom.style.cssText = `left:${left};top:${top}`
  _this.titleToggle = true
}

const chartTab = function ({}, type, index) {
  var _this = this,
      className = '',
      dom = {}
  if (type == 1) {
    className = 'add-user-item'
    switch (index) {
      case 0 :
        _this.addName = '日'
        _this.newUserVal = {
          ..._this.newUser.dimNewAddUserAnalysisDayDto,
        }
        break
      case 1 :
        _this.addName = '月'
        _this.newUserVal = {
          ..._this.newUser.dimNewAddUserAnalysisMonthDto,
        }
        break
      case 2 :
        _this.addName = '年'
        _this.newUserVal = {
          ..._this.newUser.dimNewAddUserAnalysisYearDto,
        }
        break
    }
  } else {
    className = 'active-user-item'
    switch (index) {
      case 0 :
        _this.activeName = '日'
        _this.activeUserVal = {
          ..._this.activeUser.dimActiveUserAnalysisDayDto,
        }
        break
      case 1 :
        _this.activeName = '月'
        _this.activeUserVal = {
          ..._this.activeUser.dimActiveUserAnalysisMonthDto,
        }
        break
      case 2 :
        _this.activeName = '年'
        _this.activeUserVal = {
          ..._this.activeUser.dimActiveUserAnalysisYearDto,
        }
        break
    }
  }
  try{
    dom = document.getElementsByClassName(className)
    for (var i =0; i< dom.length; i++) {
      dom[i].className = 'item' + ' ' + className
    }
    dom[index].className = 'item item-active' + ' ' + className
  }catch(res) {
    console.log(res)
  }
}

export default mapActions({
  addUsers,
  activeUsers,
  init,
  titleTipsShow,
  chartTab,
  getOrganBase,
  getActiveUser,
  getNewUser,
  getBindDevice,
  getUploadData,
})
