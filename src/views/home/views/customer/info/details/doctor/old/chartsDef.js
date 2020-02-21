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
  }
}

// 默认线的设置
export const defSeries1 = {
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
export const defSeries2 = {
  diastolicPressure: {
    name: '舒张压',
    type: 'bar',
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
    type: 'bar',
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
  min: 40,
  interval: 40,
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

// 默认 数据 series
export const defData = [{
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
  data: ['--', '--', '--', '--', '--', '--', '--']
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
  data: ['--', '--', '--', '--', '--', '--', '--']
}]

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
    left: '30',
    right: '0',
    bottom: '7%',
    containLabel: true
  },
  legend: {
    x: 'left',
    y: 'bottom',
    align: 'left',
    left: 56,
    textStyle: {
      align: 'right',
      baseline: 'middle',
    },
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
  series: defData
}

