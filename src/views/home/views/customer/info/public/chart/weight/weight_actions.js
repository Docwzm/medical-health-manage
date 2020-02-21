import {mapActions} from '../../../../../../../../utils/vuex'
import echarts from 'echarts'
import {apiTips} from '../../../../../../../../components/customer/actions'
import moment from 'moment'
import {
  getRecordListApi,
  getRecordsByResourceApi,
  getLastsRecordApi,
  addWeightRecordApi,
} from '../../../../../../../../api/weight'
import {options} from '../../chart/weight/options'
import router from '../../../../../../../../router'

const initChart = async function({}, _this) {
  if (!_this) {
    var _this = this
  }
  const {userId} = _this.Def,
      {timeRange} = _this,
      chart = echarts.init(document.getElementById('weightChart'))
  if(timeRange) {
    getTimeType({}, timeRange, _this)
  } else {
    let {timeRange} = _this.$route.query
    if(!timeRange) {
      timeRange = 7
    }
    getTimeType({}, timeRange, _this)
  }


  chart.showLoading({
    maskColor: 'rgba(255, 255, 255, 0.4)',
    text: '',
    color: '#4ea397',
  })

  chart.setOption({
    ...options,
  })

  if(_this.userId != "") {

    try {
      //userId 4086159
      const res = await getRecordListApi({userId: _this.userId, count: _this.times})
      dataFilter(_this, chart, res)
    } catch(res) {

    }
  }

}

const dataFilter = function ( _this, chart, data) {
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



  var newDate = [[],[],[]],
      max = 120,
      data2 = []
  for(var i=data.length-1; i>=0; i--) {
    data2.push(data[i])
  }

  data2.map(({weight, pbf, measurementDate,}) => {
    weight > max ? max = null : max = max
    newDate[0].push(weight)
    if(pbf) {
      newDate[1].push(pbf)
    } else {
      newDate[1].push('')
    }
    newDate[2].push(moment(measurementDate).format('YYYY-MM-DD HH:mm'))
  })

  chart.setOption({
    yAxis: {
      max: max,
    },
    xAxis: {
      show: false,
      data: getXvalue(_this)
    },
    tooltip:{
      formatter: function(params){
        if(params[0].data) {
          var pbf = params[1].data ? `<br>体脂率：${params[1].data}%` : ''
          return `体重：${params[0].data}kg${pbf}<br>${params[2].data}`
        }
      }
    },
    series:[
      {
        data:newDate[0],
      },
      {
        data:newDate[1],
      },
      {
        data:newDate[2],
      }
    ]
  })
}

//获取x轴
const getXvalue = function (_this) {
  var array = []
  switch(parseInt(_this.times)) {
    case 7:
      for(var i=1; i<8; i++) {
        array.push(i)
      }
      break
    case 14:
      for(var i=1; i<15; i++) {
        array.push(i)
      }
      break
    case 21:
      for(var i=1; i<22; i++) {
        array.push(i)
      }
      break
  }
  return array
}

const setQuery = function ({},tab, queryName) {
  const _this = this
  _this.$router.replace({query: {...this.$route.query, [queryName]: tab.name}})
  getTimeType({}, tab.name, _this)
  initChart({}, _this)
}

const getTimeType = function({}, val, _this) {
  var times = 7,
      title = ''
  switch (parseInt(val)) {
    case 7:
      times = 7
      break
    case 14:
      times = 14
      break
    case 21:
      times = 21
      break
  }
  title = `最近${times}次体重变化趋势`
  _this.times = times
  _this.title = title
}

//查询体重
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
    begin: _this.search_time.length > 0 ? new Date(_this.search_time[0]).getTime() :  new Date(moment().subtract(2,'years')).getTime(),
    end: _this.search_time.length > 0 ? new Date(_this.search_time[1]).getTime() :  new Date().getTime(),
    pageNum: _this.currentPage,
    deviceUpload: _this.source != 3 && _this.source != "" ? _this.source : undefined,
  }

  try{
    const {list, total} = await getRecordsByResourceApi({
        ...parameter,
      // userId: 4517566
    })
    if(list) {
      _this.total = total
      _this.tableData = list
    } else {
      _this.total = 0
      _this.tableData = []
    }
    _this.loading = false
  } catch(res) {
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

//获取最新一笔体重
const getLastWeight = async function ({}) {
  if (!_this) {
    var _this = this
  }
  try{
    //4086159 4517566
    const {result} = await getLastsRecordApi({userId: _this.userId})
    if(result) {
      _this.hasNewWeight = true
      _this.weightInfos = result
    }else {
      _this.hasNewWeight = false
    }
  } catch(res) {
    apiTips(_this, res.msg, '错误', 'error')
  }
}

//计算等级
const getLevel = function ({}, val) {
  if(val == "偏瘦" || val == "偏低") {
    return "btn1"
  } else if(val == "标准"){
    return "btn2"
  }else if(val == "理想") {
    return "btn3"
  } else if(val == "偏胖" || val == "偏高") {
    return "btn4"
  } else if( val == "肥胖" || val == "超高"){
    return "btn5"
  } else {
    return "btn-none"
  }
}

//表格点击
const cellClick = function ({}, row) {
  const _this = this
  _this.dialog = true
  _this.dialogWeightInfos = row
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

//添加体重
const addWeight = function() {
  const _this = this
  _this.showDialog = true
}

//提交添加体重请求
const submitForm = function({}, formName) {
  const _this = this
  _this.$refs[formName].validate((valid) => {
    if(valid) {
      _this.dialogLoading = true
      addRecord(_this)
    }
  })
}

//请求
const addRecord = async function (_this) {

  if(new Date(_this.ruleForm.time).getTime() > new Date().getTime()) {
    apiTips(_this, "测量时间不能大于当前时间！", '错误', 'error')
    _this.ruleForm.time = ""
    _this.dialogLoading = false
    return false
  }

  try{
    const res = await addWeightRecordApi({
      userId: _this.userId,
      measurementDate: new Date(_this.ruleForm.time).getTime(),
      weight: _this.ruleForm.weight,
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
  searchList,
  getTimeType,
  getLastWeight,
  handleCurrentChange,
  getLevel,
  cellClick,
  addWeight,
  isAdminFn,
  submitForm,
})