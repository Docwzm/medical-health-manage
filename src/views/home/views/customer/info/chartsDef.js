import moment from 'moment'

// 默认数据点 经过设置
export const defEmphasis = {
  dip: {
    color: '#fff',
    borderColor: '#35bf32',
    borderWidth: 2,
    borderType: 'solid',
    shadowColor: 'rgba(53, 191, 50, 0.3)',
    shadowBlur: 10
  },
  sys: {
    color: '#fff',
    borderColor: '#20a0ff',
    borderWidth: 2,
    borderType: 'solid',
    shadowColor: 'rgba(48, 241, 44, 0.3)',
    shadowBlur: 10
  },
  bs: {
    color: '#fff',
    borderColor: '#6282d5',
    borderWidth: 2,
    borderType: 'solid',
    shadowColor: 'rgba(98, 130, 213, 0.3)',
    shadowBlur: 10
  }
}

// 默认线的设置
export const defSeries1 = {
  heartRate: {
    name: '心率',
    type: 'line',
    hoverAnimation: false,
    // symbolSize: 8,
    lineStyle: {
      normal: {
        // color: '#6282d5',
        width: 4
      }
    },
    itemStyle: {
      normal: {
        // color: '#6282d5',
        opacity: 0
      },
    },
    // connectNulls: true,
  },
  bloodSugar: {
    name: '血糖',
    type: 'line',
    symbolSize: 8,
    lineStyle: {
      normal: {
        color: '#6282d5',
      }
    },
    itemStyle: {
      normal: {
        color: '#6282d5',
      },
    },
    connectNulls: true,
  },
  diastolicPressure: {
    name: '舒张压',
    type: 'line',
    symbolSize: 8,
    lineStyle: {
      normal: {
        color: '#35bf32',
      }
    },
    itemStyle: {
      normal: {
        color: '#35bf32',
      },
    },
    connectNulls: true,
  },
  systolicPressure: {
    name: '舒张压',
    type: 'line',
    symbolSize: 8,
    lineStyle: {
      normal: {
        color: '#20a0ff'
      }
    },
    itemStyle: {
      normal: {
        color: '#20a0ff',
      },
    },
    connectNulls: true,
  },
}

// 默认Y轴的设置
export const defYaxis1 = [{
  name: 'mmHg',
  nameGap: 10,
  max: 200,
  // min: 40,
  // interval: 40,
  // splitNumber: 5,
  // minInterval: 2,
  nameTextStyle: {
    fontSize: 14,
    color: '#000',
  },
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
    formatter: '{value}',
    textStyle: {
      color: '#000',
    }
  },
  splitLine: {
    lineStyle: {
      color: '#e8e8e8',
      width: 2
    }
  },
}, {
  position: 'right',
  axisLine: {
    lineStyle: {
      color: '#ededed',
      width: 2
    }
  },
}]

export const defYaxis2 = [{
  name: '次',
  nameGap: 10,
  max: 20,
  min: 0,
  interval: 5,
  nameTextStyle: {
    fontSize: 14,
    color: '#000',
  },
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
    formatter: '{value}',
    textStyle: {
      color: '#000',
    }
  },
  splitLine: {
    lineStyle: {
      color: '#e8e8e8',
      width: 2
    }
  },
}, {
  position: 'right',
  axisLine: {
    lineStyle: {
      color: '#ededed',
      width: 2
    }
  },
}]

const getLs = (key) => {
  return {
    'day': [...new Array(24)].map((t, index) => '--'),
    'week': [...new Array(7)].map((t, index) => '--'),
    'month': [...new Array(30)].map((t, index) => '--'),
    'year': [...new Array(12)].map((t, index) => '--'),
  }[key]
}

// 默认 血压 数据 series
export const defBpData = ({timeRange}) => {
  return [
    {
      name: '收缩压',
      type: 'line',
      symbolSize: 8,
      lineStyle: {normal: {color: '#20a0ff', type: 'solid'}},
      itemStyle: {
        normal: {color: '#20a0ff'},
        emphasis: {
          color: '#fff',
          borderColor: '#20a0ff',
          borderWidth: 2,
          borderType: 'solid',
          shadowColor: 'rgba(48, 241, 44, 0.3)',
          shadowBlur: 10
        }
      },
      connectNulls: true,
      symbol: 'circle',
      data: getLs(timeRange)
    }, {
      name: '舒张压',
      type: 'line',
      symbolSize: 8,
      lineStyle: {normal: {color: '#35bf32', type: 'solid'}},
      itemStyle: {
        normal: {color: '#35bf32'},
        emphasis: {
          color: '#fff',
          borderColor: '#35bf32',
          borderWidth: 2,
          borderType: 'solid',
          shadowColor: 'rgba(53, 191, 50, 0.3)',
          shadowBlur: 10
        }
      },
      connectNulls: true,
      symbol: 'circle',
      data: getLs(timeRange)
    }]
}

// 默认 血糖 数据 series
export const defBsData = ({timeRange}) => {
  return [{
    name: '血糖',
    type: 'line',
    symbolSize: 8,
    lineStyle: {normal: {color: '#20a0ff', type: 'solid'}},
    itemStyle: {
      normal: {color: '#20a0ff'},
      emphasis: {
        color: '#fff',
        borderColor: '#20a0ff',
        borderWidth: 2,
        borderType: 'solid',
        shadowColor: 'rgba(48, 241, 44, 0.3)',
        shadowBlur: 10
      }
    },
    connectNulls: true,
    symbol: 'circle',
    data: getLs(timeRange)
  }]
}

const flet = () => {
  let les = []
  const lsTime = new Date(moment().format('YYYY/MM/DD 24:00')).getTime()
  const fsTime = new Date(moment().format('YYYY/MM/DD 00:00')).getTime()
  const t = 5 * 60 * 1000
  for (let i = 0; i < 288; i++) {
    les.push({value: [fsTime + (i * t)]})
  }
  les.push({value: [lsTime]})
  return les
}

// 默认 心率 数据 series
export const defHeartRateData = () => {
  return [{
    name: '心率',
    type: 'line',
    hoverAnimation: false,
    // symbolSize: 8,
    lineStyle: {
      normal: {
        // color: '#6282d5',
        width: 4
      }
    },
    itemStyle: {
      normal: {
        // color: '#6282d5',
        opacity: 0
      },
    },
    // connectNulls: true,
    data: flet()
  }]
}

export const polar = {
  backgroundColor: '#fff',
  title: {
    x: 'center',
    textStyle: {
      color: '#000',
      fontWeight: 100,
      fontSize: 18,
      fontFamily: 'simsun'
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#404c5a',
    padding: 10,
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
  },
  grid: {
    left: '70',
    right: '0',
    bottom: '7%',
    containLabel: true
  },
  legend: {
    x: 'left',
    y: 'bottom',
    align: 'left',
    left: 70,
    textStyle: {
      align: 'right',
      baseline: 'middle',
    },
    itemGap: 20,
    // data: []
    data: ['收缩压', '舒张压']
  },
  xAxis: [{
    nameLocation: 'start',
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
    data: []
  }],
  series: []
}
