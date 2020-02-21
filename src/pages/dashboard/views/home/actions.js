import echarts from 'echarts'
function init() {
    console.log(this)
    initLineChart.call(this)
    initPieChart.call(this, 'divece-pie-chart', 'device_pie_chart', this.deviceChartData)
    initPieChart.call(this, 'warn-pie-chart', 'warn_pie_chart', this.warnChartData)
    toCanvas.call(this, 'guage-chart-1', 48, 'guage_chart_1');
    toCanvas.call(this, 'guage-chart-2', 90, 'guage_chart_2');
    toCanvas.call(this, 'guage-chart-3', 48, 'guage_chart_3');
    toCanvas.call(this, 'guage-chart-4', 48, 'guage_chart_4');

    window.addEventListener('resize', () => {
        this.chart.resize()
        this.device_pie_chart.resize()
        this.warn_pie_chart.resize()
    }, false);
};
function handlefullscreen() {
    var docElm = document.documentElement;
    //W3C 
    if (docElm.requestFullscreen) {
        if (!document.fullscreen) {
            docElm.requestFullscreen();
        } else {
            document.exitFullscreen();
        }

    }
    //FireFox 
    else if (docElm.mozRequestFullScreen) {
        if (!document.mozFullScreen) {
            docElm.mozRequestFullScreen();
        } else {
            document.mozCancelFullScreen();
        }
    }
    //Chrome等 
    else if (docElm.webkitRequestFullScreen) {
        if (!document.webkitIsFullScreen) {
            docElm.webkitRequestFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }
    }
    //IE11 
    else if (elem.msRequestFullscreen) {
        if (!document.msFullscreenElement) {
            docElm.msRequestFullscreen();
        } else {
            document.msExitFullscreen();
        }
    }
}

function changeYear(value) {
    this.selectYear = value
}

function changeTrendTimeRange(value) {
    this.currentTrendTimeRange = value
}

function renderHeader(h, { column, $index }) {
    console.log(column)
    let color = '#fff'
    let paddingLeft = 0;
    switch (column.property) {
        case 'col1':
            color = '#fff';
            paddingLeft = '0.11rem'
            break;
        case 'col2':
            color = '#E4C04A';
            break;
        case 'col3':
        case 'col4':
            color = '#A19BFF';
            break;
        case 'col5':
        case 'col6':
        case 'col7':
            color = '#57D0FF';
            break;
        case 'col8':
            color = '#5C8CE3';
            break;
    }
    return <span style={{ paddingLeft, color }}>{column.label}</span>
}

function initLineChart() {
    this.chart = echarts.init(document.getElementById('line-chart'))
    let options = {
        tooltip: {
            trigger: 'axis'
        },
        // legend: {
        //     data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        // },
        grid: {
            top: 10,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: true
        },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        xAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: '#fff',
                padding: [5, 0, 0, 0]
            },

            type: 'category',
            // boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: '#fff',
                padding: [0, 10, 0, 0],
                // interval:49
            },
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                    // color: ['#fff'],
                    opacity: 0.1
                }
            },
            type: 'value'
        },
        series: [
            {
                name: '管理率',
                type: 'line',
                symbol: 'circle',
                itemStyle: {
                    normal: {
                        color: '#F75F59',
                        lineStyle: {
                            color: '#F75F59'
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderWidth: 2,
                        shadowColor: '#F75F59',
                        shadowBlur: 5,
                        borderColor: '#F75F59'
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210, 320, 332, 301, 334, 399]
            },
            {
                name: '规范率',
                type: 'line',
                symbol: 'circle',
                itemStyle: {
                    normal: {
                        color: '#32C5FF', //改变折线点的颜色
                        lineStyle: {
                            color: '#32C5FF'
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderWidth: 2,
                        shadowColor: '#32C5FF',
                        shadowBlur: 5,
                        borderColor: '#32C5FF'
                    }
                },
                data: [320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390]
            },
            {
                name: '控制率',
                type: 'line',
                symbol: 'circle',
                itemStyle: {
                    normal: {
                        color: '#6DD400', //改变折线点的颜色
                        lineStyle: {
                            color: '#6DD400'
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderWidth: 2,
                        shadowColor: '#6DD400',
                        shadowBlur: 5,
                        borderColor: '#6DD400'
                    }
                },
                data: [820, 932, 901, 934, 1290, 1330, 1320, 320, 332, 301, 334, 390]
            }
        ]
    };
    this.chart.setOption(options)
}

function initPieChart(dom, name, data) {
    data = data.map(item => {
        item.itemStyle = {
            normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        { offset: 0, color: item.color[0] },
                        // {offset: 0.5, color: '#048CE4'},
                        { offset: 1, color: item.color[1] }
                    ]
                )
            }
        }
        return item
    })
    this[name] = echarts.init(document.getElementById(dom))
    let option = {
        // backgroundColor:'#fff',
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
            position: 'right'
        },
        series: [
            {
                // name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 5,
                    }
                },

                //         // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
                //         // color: {
                //         //     type: 'radial',
                //         //     x: 0.5,
                //         //     y: 0.5,
                //         //     r: 0.5,
                //         //     colorStops: [{
                //         //         offset: 0, color: 'red' // 0% 处的颜色
                //         //     }, {
                //         //         offset: 1, color: 'blue' // 100% 处的颜色
                //         //     }],
                //         //     global: false // 缺省为 false
                //         // }
                //         // opacity:0.1,
                //     // borderWidth:6, //设置border的宽度有多大
                //     // borderColor:'rgba(255, 255, 255, 0)',
                //     }
                // },
                data
            }
        ]
    };

    this[name].setOption(option)
}


function toCanvas(id, progress, name) {
    //canvas进度条
    this[name] = document.getElementById(id)
    let ctx = this[name].getContext("2d"),
        percent = progress, //最终百分比
        circleX = this[name].width / 2, //中心x坐标
        circleY = this[name].height / 2, //中心y坐标
        radius = 100, //圆环半径
        lineWidth = 30, //圆形线条的宽度
        fontSize = 20; //字体大小
    //两端圆点
    // function smallcircle1(cx, cy, r) {
    //     ctx.beginPath();
    //     //ctx.moveTo(cx + r, cy);
    //     ctx.lineWidth = 1;
    //     ctx.fillStyle = '#06a8f3';
    //     ctx.arc(cx, cy, r, 0, Math.PI * 2);
    //     ctx.fill();
    // }
    // function smallcircle2(cx, cy, r) {
    //     ctx.beginPath();
    //     //ctx.moveTo(cx + r, cy);
    //     ctx.lineWidth = 1;
    //     ctx.fillStyle = '#00f8bb';
    //     ctx.arc(cx, cy, r, 0, Math.PI * 2);
    //     ctx.fill();
    // }

    //画圆
    function circle(cx, cy, r) {
        ctx.beginPath();
        //ctx.moveTo(cx + r, cy);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.arc(cx, cy, r, Math.PI * 2 / 3, Math.PI * 1 / 3);
        ctx.stroke();
    }

    // 画弧线
    function sector(cx, cy, r, startAngle, endAngle, anti) {
        ctx.beginPath();
        //ctx.moveTo(cx, cy + r); // 从圆形底部开始画
        ctx.lineWidth = lineWidth;

        // 渐变色 - 可自定义
        var linGrad = ctx.createLinearGradient(
            circleX - radius - lineWidth, circleY, circleX + radius + lineWidth, circleY
        );
        linGrad.addColorStop(0.0, '#0488E3');
        //linGrad.addColorStop(0.5, '#9bc4eb');
        linGrad.addColorStop(1.0, '#00CDEE');
        ctx.strokeStyle = linGrad;

        //圆弧两端的样式
        // ctx.lineCap = 'round';

        //圆弧
        ctx.arc(
            cx, cy, r,
            (Math.PI * 2 / 3),
            (Math.PI * 2 / 3) + endAngle / 100 * (Math.PI * 5 / 3),
            false
        );
        ctx.stroke();
    }

    //刷新
    function loading() {
        if (process >= percent) {
            clearInterval(circleLoading);
        }

        //清除canvas内容
        ctx.clearRect(0, 0, circleX * 2, circleY * 2);

        //中间的字
        // ctx.font = fontSize + 'px April';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillStyle = '#999';
        // ctx.fillText(parseFloat(process).toFixed(0) + '%', circleX, circleY);

        // 圆形
        circle(circleX, circleY, radius);

        //圆弧
        sector(circleX, circleY, radius, Math.PI * 2 / 3, process);
        //两端圆点
        // smallcircle1(150 + Math.cos(2 * Math.PI / 360 * 120) * 100, 150 + Math.sin(2 * Math.PI / 360 * 120) * 100, 5);
        // smallcircle2(150 + Math.cos(2 * Math.PI / 360 * (120 + process * 3)) * 100, 150 + Math.sin(2 * Math.PI / 360 * (120 + process * 3)) * 100, 5);
        //控制结束时动画的速度
        if (process / percent > 0.90) {
            process += 0.30;
        } else if (process / percent > 0.80) {
            process += 0.55;
        } else if (process / percent > 0.70) {
            process += 0.75;
        } else {
            process += 1.0;
        }
    }

    var process = 0.0; //进度
    var circleLoading = window.setInterval(function () {
        loading();
    }, 20);
}


export default {
    init,
    handlefullscreen,
    changeYear, renderHeader,
    changeTrendTimeRange
}