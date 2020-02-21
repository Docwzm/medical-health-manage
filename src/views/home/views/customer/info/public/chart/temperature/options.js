export const options = {
  title:{
    left: 'center',
    top:'195px',
    textStyle: {
      color: '#999',
      text: "暂无测量数据",
      fontSize: 14,
      fontWeight:'normal'
    }
  },
  grid: {
    left: '70',
    right: '0',
    bottom: '7%',
    containLabel: true
  },
  backgroundColor: '#fff',
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#404c5a',
    padding: 15,
    textStyle: {
      fontSize: 12
    },
    axisPointer: {
      lineStyle: {
        color: '#99a9bf'
      },
      z: -1
    },
    extraCssText: 'border-radius: 8px;',
    formatter: "小时平均体温值<br>{c}&deg;C",
  },
  xAxis: [{
    name:'',
    data: [],
    nameTextStyle: {
      fontSize: 14,
      color: '#000',
    },
    nameGap: 10,
    axisLine: {
      lineStyle: {
        color: '#ededed',
        width: 2
      }
    },
    axisTick: {
      inside: true,
    },
    axisLabel: {
      textStyle: {
        color: '#000',
      }
    },
  }],
  yAxis: [
    {
      type: 'value',
      name: "摄氏度",
      min: 34,
      max: 42,
      splitNumber: 4,
      nameTextStyle: {
        fontSize: 14,
        color: '#000',
      },
      axisLine: {
        lineStyle: {
          color: '#EDEDED',
          width: 2,
        }
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#333',
          align: 'right'
        },
        inside: true,
        margin: -8
      },
      splitLine: {
        lineStyle: {
          color: '#EDEDED',
          width: 2,
        }
      }
    },
    {
      axisLine: {
        lineStyle: {
          color: '#EDEDED',
          width: 2,
        }
      },
    }
  ],
  series:[
    {
      symbolSize: 6,
      type:'line',
      itemStyle:{
        normal:{
          borderColor:'#FF9404'
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(255, 148, 4, 0.5)',
        }
      },
      lineStyle:{
        normal:{
          width: 3,
          color:'#FF9404'
        }
      }
    },
    {
      type:'line',
      itemStyle:{
        normal:{
          borderColor:'#FF9404',
          opacity:0,
        }
      },
      lineStyle:{
        normal:{
          width: 2,
          type:'dashed',
          color:'#FF9404'
        }
      },
      connectNulls: true,
    }
  ]
}
