export const bpOptions = {
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
    left: '40',
    right: '0',
    bottom: '7%',
    containLabel: true
  },
  backgroundColor: '#fff',
  xAxis: [{
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
      name: "mmHg",
      min: 40,
      max: 200,
      splitNumber: 4,
      interval: 40,
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
      type:'line',
      itemStyle:{
        normal:{
          borderColor:'#20a0ff',
          opacity:0,
        }
      },
      lineStyle:{
        normal:{
          width: 2,
          type:'dashed',
          color:'#20a0ff'
        }
      },
      connectNulls: true,
      symbol: 'circle',
    },
    {
      name: '收缩压',
      symbolSize: 8,
      type:'line',
      itemStyle:{
        normal:{
          borderColor:'#20a0ff',
          color: '#20a0ff',
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(48, 241, 44, 0.3)',
        }
      },
      lineStyle:{
        normal:{
          width: 3,
          color:'#20a0ff'
        }
      },
      symbol: 'circle',
    },
    {
      type:'line',
      itemStyle:{
        normal:{
          borderColor:'#35bf32',
          opacity:0,
        }
      },
      lineStyle:{
        normal:{
          width: 2,
          type:'dashed',
          color:'#35bf32'
        }
      },
      connectNulls: true,
      symbol: 'circle',
    },
    {
      name: '舒张压',
      symbolSize: 8,
      type:'line',
      itemStyle:{
        normal:{
          borderColor:'#35bf32',
          color: '#35bf32'
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(53, 191, 50, 0.3)',
        }
      },
      lineStyle:{
        normal:{
          width: 3,
          color:'#35bf32'
        }
      },
      symbol: 'circle',
    },
  ],
  legend: {
    x: 'left',
    y: 'bottom',
    align: 'left',
    left: 56,
    textStyle: {
      align: 'right',
      baseline: 'middle',
    },
    data:['收缩压', '舒张压']
  }
}