import {
  mapActions,
} from '../../utils/vuex'
import {
  getlocalStorage,
} from '../../api/common'
import echarts from 'echarts'
import moment from 'moment'
import {
  getRecordListApi,
  getRecordsByResourceApi,
} from '../../api/weight'
import {
  getTrendGraphDataApi,
  getMeasureDataApi,
} from '../../api/abnormal'
import {
  getPeroidLastApi
} from '../../api/datachart'
import {
  weightOptions
} from "./weightOptions"
import {
  bpOptions
} from "./bpOptions"
import jspdf from 'jspdf'

const init = function ({commit, state}) {
  const _this = this
  _this.area = JSON.parse(getlocalStorage('saveArea'))
  _this.userInfos = JSON.parse(getlocalStorage('userInfos'))
  _this.pdfType = getlocalStorage('pdfType')
  _this.userId = _this.userInfos.userId
  _this.date = moment(new Date()).format('YYYY-MM-DD')
  handlePdfType( _this, _this.pdfType)
  initChart({}, _this)
}

//处理pdf类型
const handlePdfType = ( _this, type) => {
  let num = 5
  if(type.indexOf('血压') == -1) {
    _this.showBp = false
    num -=2
    _this.dataNum = num
  } else {
    getMeasureData(_this)
  }
  if(type.indexOf('血糖') == -1) {
    _this.showBs = false
    _this.dataNum = --num
  } else {
    getPeroidLast(_this)
  }
  if(type.indexOf('体重') == -1) {
    _this.showWeight = false
    num -=2
    _this.dataNum = num
  } else {
    getRecordsByResource(_this)
  }

  console.log(" _this.dataNum",  _this.dataNum)
}

//下载pdf
const download = () => {
  let dom = document.getElementsByClassName('pdf-download-layout')
  html2canvas(dom, {
    onrendered: function(canvas) {
      console.log("running")
      let bl = 0.265,
          img = new Image(),
          imgData = canvas.toDataURL('image/png', 1.0)
      img.crossOrigin = "anonymous"
      img.src = imgData
      img.onload = function () {
        let imgWidth = this.width,
            imgHeight = this.height
        // if (imgWidth> imgHeight) {
        //   var doc = new jspdf('l', 'mm', [imgWidth * bl, imgHeight * bl]);
        // } else {
        //   var doc = new jspdf('p', 'mm', [imgWidth * bl, imgHeight * bl]);
        // }
        // doc.addImage(imgData, 'jpeg',0, 0, imgWidth * bl, imgHeight * bl);
        if(imgWidth > imgHeight) {
          var doc = new jspdf('','pt', [imgWidth, imgWidth])
        } else {
          var doc = new jspdf('','pt', [imgWidth, imgHeight])
        }
        doc.addImage(imgData, 'PNG', 0, 1, imgWidth, imgHeight);
        doc.save('report_pdf_' + new Date().getTime() + '.pdf');
        setTimeout(function(){
          //window.close()
        },100)
      }
    },
    allowTaint: true,
  });
}

//初始化图表
const initChart = async function ({}, _this){
  const bpChart = echarts.init(document.getElementById('bpChart')),
        weightChart = echarts.init(document.getElementById('weightChart')),
        loadingObj = {
          maskColor: 'rgba(255, 255, 255, 0.4)',
          text: '',
          color: '#4ea397',
        }
    if(_this.showBp) {
      bpChart.showLoading({
        ...loadingObj,
      })
      initBpChart(bpChart, _this)
    }

    if(_this.showWeight) {
      weightChart.showLoading({
        ...loadingObj,
      })
      initWeightChart(weightChart, _this)
    }


}

//血压图表
const initBpChart = async function (bpChart, _this) {
  let newOptions = {
    ...bpOptions
  }
  newOptions.xAxis[0].name = '天'
  newOptions.xAxis[0].data = getXvalue()

  bpChart.setOption(newOptions)
  try{
    bpChart.hideLoading()
    const bpData = await getTrendGraphDataApi({type: 'month', userId: _this.userId})

    let newData = [[], []]
    let times = forX(30, 'YYYY-MM-DD'),
        day = forX(30, 'D')
    newData = forXdata(30, bpData, 'YYYY-MM-DD', times)

    bpChart.setOption({
      title: {
        text: bpData.length == 0 ? _this.chartTitle : '',
      },
      xAxis: {
        data: day
      },
      series:[
        {
          data:newData[0]
        },
        {
          data:newData[0]
        },
        {
          data:newData[1]
        },
        {
          data:newData[1]
        }
      ]
    })
    _this.isDone = ++_this.isDone
  } catch(res) {
      console.log(res)
  }
}

//体重图表
const initWeightChart = async function (weightChart, _this) {
  weightChart.setOption({
    ...weightOptions,
  })

  try{
    weightChart.hideLoading()
    const weightData = await getRecordListApi({userId: _this.userId, count: 30})
    let max = 120,
        newData = [[], []]
    _this.weightList = weightData
    weightData.map(({weight, pbf}) => {
      weight > max ? max = null : max = max
      newData[0].push(weight)
      if(pbf) {
        newData[1].push(pbf)
      }
    })

    weightChart.setOption({
      yAxis: {
        max: max,
      },
      xAxis: {
        show: false,
        data: getXvalue()
      },
      title: {
        text: weightData.length == 0 ? _this.chartTitle : ''
      },
      tooltip:{
        formatter: function(params){
        }
      },
      series:[
        {
          data:newData[0],
        },
        {
          data:newData[1],
        },
      ]
    })
    _this.isDone = ++_this.isDone
  } catch(res) {
    console.log(res)
  }
}

//获取体重列表
const getRecordsByResource = async (_this) => {
  try {
    const {list} = await getRecordsByResourceApi({userId: _this.userId, begin: new Date(moment().subtract(29,'days').format('YYYY/MM/DD 00:00:00')).getTime(), end: new Date(moment().format('YYYY/MM/DD 23:59:59')).getTime(), pageSize: _this.pageSize })
    _this.weigthTabList = list || []
    _this.isDone = ++_this.isDone
  } catch(res) {
  }
}

//获取体重x轴
const getXvalue = () => {
  let array = []
  for(let i=1; i< 31; i++) {
    array.push(i)
  }
  return array
}

const forX = function (num, rule,) {
  let times = []
  for(let i=num-1; i>=0; i--) {
    times.push(moment().subtract(i,'days').format(rule))
  }
  return times
}

const forXdata = function (num, oldData, rule, times) {
  var newData = [[], []]
  for(var i=0; i<num; i++) {
    newData[0][i] = ""
    newData[1][i] = ""
    oldData.map(({day, diastolicPressure, systolicPressure}) => {
      if(moment(day).format(rule) == times[i] && systolicPressure != 0) {
        newData[0][i] = systolicPressure
      }

      if(moment(day).format(rule) == times[i] && diastolicPressure != 0) {
        newData[1][i] = diastolicPressure
      }
    })
  }
  return newData
}

//地址过滤
const addressFilter = ({}, _this, infos) => {
  let addressInfo = infos,
      province = "",
      city = "",
      address = ""
  _this.area.map((item) => {
    if(addressInfo.province == item.id) {
      province = item.name
      item.citys.map((item2) => {
        if(addressInfo.city == item2.id) {
          city = item2.name
        }
      })
    }
  })

  if(addressInfo.address) {
    address = addressInfo.address
  } else {
    if(province == "" && city == "") {
      address = "--"
    }
  }

  _this.address = province + city + address
}

//获取血压列表
const getMeasureData = async (_this) => {
  const {data} = await getMeasureDataApi({pageSize: _this.pageSize, userId: _this.userId, sort: 'measurementDate', order:'desc', begin: new Date(moment().subtract(29,'days').format('YYYY/MM/DD 00:00:00')).getTime(), end: new Date(moment().format('YYYY/MM/DD 23:59:59')).getTime()})
  if(data) {
    _this.bpTabList = data
  }
  _this.isDone = ++_this.isDone
}

// 根据数值 设置颜色
const markAbnormalRows = function (store, row) {
  let color = 'inherit'
  if (row.diastolicPressure < 60
      || row.systolicPressure < 90) {
    color = '#FF9404'
  }
  if (row.diastolicPressure <= 99 && row.diastolicPressure >= 90
      || row.systolicPressure <= 159 && row.systolicPressure >= 140) {
    color = '#FF9404'
  }
  if (row.diastolicPressure <= 109 && row.diastolicPressure >= 100
      || row.systolicPressure <= 179 && row.systolicPressure >= 160) {
    color = '#FF4949'
  }
  if (row.diastolicPressure >= 109
      || row.systolicPressure >= 180) {
    color = '#FF4949'
  }
  return {
    color
  }
}

//获取血糖列表
const getPeroidLast = async (_this) => {
  try {
    const {list} = await getPeroidLastApi({userId: _this.userId, pageSize: _this.pageSize, startTime: new Date(moment().subtract(29,'days').format('YYYY/MM/DD 00:00:00')).getTime(), endTime: new Date(moment().format('YYYY/MM/DD 23:59:59')).getTime()})

    _this.bsTabList = list && _this.fles(list, 'measurementDate') || []
    _this.isDone = ++_this.isDone
  }catch(res) {
    console.log(res)
  }
}

export default mapActions({
  init,
  download,
  initChart,
  addressFilter,
  markAbnormalRows,
})