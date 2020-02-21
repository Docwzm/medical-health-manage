import {mapActions} from '../../../../../../../../utils/vuex'
import echarts from 'echarts'
import {apiTips} from '../../../../../../../../components/customer/actions'
import {
  getAvgRecordsApi,
  getAvgByPageApi,
  deleteRecordApi,
  addRecordApi,
} from '../../../../../../../../api/temperature'
import moment from 'moment'
import {options} from '../../chart/temperature/options'
import router from '../../../../../../../../router'

const initChart = async function ({}, _this) {
  if (!_this) {
    var _this = this
  }
    const {userId} = _this.Def,
          {timeRange} = _this,
          chart = echarts.init(document.getElementById('temperatureChart'))
  if(timeRange) {
    getTimeType({}, _this, timeRange)
  } else {
    let {timeRange} = _this.$route.query
    if(!timeRange) {
      timeRange = 'day'
    }
    getTimeType({}, _this, timeRange)
  }

  chart.showLoading({
    maskColor: 'rgba(255, 255, 255, 0.4)',
    text: '',
    color: '#4ea397',
  })

  let newOptions = {
    ...options
  }

  newOptions.xAxis[0].name = {day: '时', week: '', month: '天', year: '月'}[timeRange]
  newOptions.xAxis[0].data = _this.xLabel

  chart.setOption(newOptions)

  // chart.setOption({
  //   ...options,
  // })
  //
  // chart.setOption({
  //   xAxis: [{
  //     name:{day: '时', week: '', month: '天', year: '月'}[timeRange] ,
  //     data: _this.xLabel,
  //   }],
  // })

  if(_this.userId != "") {
    try {
      const parameter = getParameter(_this)
      //userId 4517755
      const res = await getAvgRecordsApi({userId: _this.userId, ...parameter})
      dataFilter(_this, chart, res)
    } catch(res) {

    }
  }
}

const getParameter = function (_this) {
  let obj = {}
  switch (_this.timeType) {
    case 1:
      obj = getTime(0,1)
      break
    case 2:
      obj = getTime(6,2)
      break
    case 3:
      obj = getTime(29,3)
      break
    case 4:
      obj = getTime(365,4)
  }
  return obj
}

const getTime = function(day, type) {
  let obj = {
    startDateTime: new Date(moment().subtract(day,'days').format('YYYY/MM/DD 00:00:00')).getTime(),
    endDateTime:new Date(moment().format('YYYY/MM/DD 23:59:59')).getTime(),
    peroid: type,
  }
  return obj
}

const setQuery = function ({},tab, queryName) {
  const _this = this
  _this.$router.replace({query: {...this.$route.query, [queryName]: tab.name}})
  getTimeType({}, _this, tab.name)
  initChart({}, _this)
}

const getTimeType = function ({}, _this, type) {
  switch(type) {
    case 'day' :
      _this.timeType = 1
      forXvalue(_this, _this.timeType)
      break
    case 'week' :
      _this.timeType = 2
      forXvalue(_this, _this.timeType)
      break
    case 'month' :
      _this.timeType = 3
      forXvalue(_this, _this.timeType)
      break
    case 'year' :
      _this.timeType = 4
      forXvalue(_this, _this.timeType)
      break
  }
}

const dataFilter = function (_this, chart, data) {
  chart.hideLoading()
  if(data.length == 0) {
    chart.setOption({
      title:{
        text:_this.chartTitle
      }
    })
  } else {
    chart.setOption({
      title:{
        text:""
      }
    })
  }
  var newDate = []
  switch(_this.timeType) {
    case 1:
      for(var i=0; i<24; i++) {
        data.map(({hour, degree}) => {
            if(hour == i && degree != 0) {
              newDate[i] = degree
            }
        })
      }
      setData(chart, newDate, _this, undefined, 1)
      break
    case 2:
      var times = forX(7, 'YYYY-MM-DD'),
          weeks = forX(7, 'dddd', '星期', '周')
      setData(chart, forXdata(7, data, 'YYYY-MM-DD', times), _this, weeks, 2)
      break
    case 3:
      var times = forX(30, 'YYYY-MM-DD'),
          day = forX(30, 'D')
      setData(chart, forXdata(30, data, 'YYYY-MM-DD', times), _this, day, 3)
      break
    case 4:
      var times = []
        for(var i=1; i<13; i++) {
          times.push(moment(moment().format('YYYY-MM-01 00:00:00')).subtract(i,'months').format('MM'))
        }
      setData(chart, forXdata(12, data, 'MM', times), _this, times, 4)
      break

  }
}

const forX = function (num, rule,  keyword, replaceWord) {
  var times = []
    for(var i=num-1; i>=0; i--) {
      if(!keyword) {
        times.push(moment().subtract(i,'days').format(rule))
      } else {
        times.push(moment().subtract(i,'days').format(rule).replace(keyword,replaceWord))
      }
    }
  return times
}

const forXdata = function (num, oldData, rule, times) {
  var newData = []
  for(var i=0; i<num; i++) {
    newData[i] = ""
    oldData.map(({measurementDate, degree}) => {
      if(moment(measurementDate).format(rule) == times[i] && degree != 0) {
        newData[i] = degree
      }
    })
  }
  return newData
}

const setData = function(chart, data, _this, x, type) {
  chart.setOption({
    xAxis: {
      data: x ? x : _this.xLabel
    },
    tooltip:{
      formatter: function(params, ticket, callback){
        let name = ""
       switch(type) {
         case 1:
           name = "小时"
           break
         case 2:
           name = params[0].axisValue
           break
         case 3:
           name = params[0].axisValue + "日"
           break
         case 4:
           name = params[0].axisValue + "月"
        }
        if(params[0].data) {
          return `${name}平时体温值<br>${params[0].data}&deg;C`
        }
      },
    },
    series:[
      {
        data:data,
      },
      {
        data:data,
      }
    ]
  })
}

const forXvalue = function ( _this, type) {
  _this.xLabel = []
  switch(type) {
    case 1:
      for(var i=0; i<24; i++) {
        _this.xLabel.push(i)
      }
      break
    case 2:
      _this.xLabel = ['周一', '周二', '周三', '周四', '周五', '周六' , '周日']
      break
    case 3:
      for(var i=0; i< 30; i++) {
        _this.xLabel.push(i)
      }
      break
    case 4:
      for(var i=1; i< 13; i++) {
        if(i < 10) {
          _this.xLabel.push(`0${i}`)
        }else {
          _this.xLabel.push(`${i}`)
        }
      }
      break
  }

}

//查询体温
const searchList = async function ({}, data, _this, hasLoading) {
  if (!_this) {
    var _this = this
  }
  if(data) {
    if (!data.page) {
      _this.currentPage = 1
    }
  }
  if(!hasLoading){
    _this.loading = true
  }

  const parameter = {
    userId: _this.userId,
    startTime: _this.search_time[0] ? new Date(_this.search_time[0]).getTime() :  new Date(moment().subtract(2,'years')).getTime(),
    endTime: _this.search_time[1] ? new Date(_this.search_time[1]).getTime() :  new Date().getTime(),
    source: _this.source != -1 && _this.source !="" ? _this.source : undefined,
    page: _this.currentPage,
  }

  try{
    const {list, total} = await getAvgByPageApi({
      ...parameter,
    })
    if(list) {
      _this.total = total
      _this.tableData = list
    } else {
      _this.total = 0
      _this.tableData = []
    }
    _this.loading = false
  }catch (res) {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//分页点击
const handleCurrentChange = function ({}, val) {
  const _this = this
  _this.currentPage = val
  searchList({}, {page: val}, _this)
}

//删除体温弹窗
const deleteTemperature = function ({} ,{id}) {
  const _this = this
  _this.$confirm("删除后，将无法在图表中查看该笔体温数据。", "确定删除数据？", {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    customClass: 'delete-temperature-dialog',
    modal: false,
    type: 'warning'
  }).then(() => {
    _this.loading = true
    deleteApi(id, _this)
  }).catch((res) => {
  });
}

//确定删除体温
const deleteApi = async function(id, _this) {
  try {
    const res = deleteRecordApi({id: id})
    if(res) {
      _this.loading = false
      searchList({}, {}, _this)
    }
  }catch(res) {
    _this.loading = false
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//判断是否管理员
const isAdminFn = function() {
  const {history} = router,
        _this = this
  if(history.current.fullPath.indexOf('admin') != -1) {
    _this.isAdmin = true
  } else {
    _this.isAdmin = false
  }
}


//添加体温
const addTemperature = function() {
  const _this = this
  _this.showDialog = true

}

//提交添加体温请求
const submitForm = function({}, formName) {
 const _this = this
  _this.$refs[formName].validate((valid) => {
   if(valid) {
     _this.dialogLoading = true
     addRecord(_this)
   }
  })
}

const addRecord = async function (_this) {

  if(new Date(_this.ruleForm.time).getTime() > new Date().getTime()) {
    apiTips(_this, "测量时间不能大于当前时间！", '错误', 'error')
    _this.ruleForm.time = ""
    _this.dialogLoading = false
    return false
  }

    try{
      const res = await addRecordApi({
        ..._this.ruleForm,
        userId: _this.userId,
        measurementDate: new Date(_this.ruleForm.time).getTime(),
      })
      if(res) {
        _this.showDialog = false
        _this.dialogLoading = false
        _this.$message({
          message: "添加成功",
          type: 'success'
        })
        initChart({}, _this)
        searchList({}, {}, _this, true)
      }
    } catch(res) {
      _this.dialogLoading = false
      apiTips(_this, res.msg, '错误', 'error')
    }
}

export default mapActions({
  initChart,
  setQuery,
  handleCurrentChange,
  deleteTemperature,
  searchList,
  isAdminFn,
  addTemperature,
  submitForm,
})
