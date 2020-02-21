export const weightOptions = {
    title:{
      left: 'center',
      top:'200px',
      textStyle: {
        color: '#999',
        text: "暂无测量数据",
        fontSize: 14,
        fontWeight:'normal'
      }
    },
    grid: {
      left: '40',
      right: '20',
      bottom: '52',
      containLabel: false
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
      },
      extraCssText: 'border-radius: 8px;',
    },
    xAxis: [{
      name:'',
      data: [],
      nameTextStyle: {
        fontSize: 14,
        color: '#000',
      },
      nameGap: 18,
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
        name: "kg",
        min: 0,
        max: 120,
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
      },
      {
        show: false,
      }
    ],
    series:[
      {
        symbolSize: 6,
        type:'line',
        itemStyle:{
          normal:{
            borderColor:'#019BA5',
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(1, 155, 165, 0.5)',
          }
        },
        lineStyle:{
          normal:{
            width: 3,
            color:'#019BA5'
          }
        }
      },
      {
        type:'line',
        itemStyle:{
          normal:{
            borderColor:'#73D8D6',
            opacity:0,
          }
        },
        lineStyle: {
          normal:{
            color:'#73D8D6',
            opacity:0,
          }
        },
        areaStyle: {
          normal:{
            color: '#73D8D6'
          }
        }
      },
      {
        type:'line',
      }
    ]
}