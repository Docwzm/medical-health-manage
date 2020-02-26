<style lang="stylus" rel="stylesheet/stylus">
  shiftTick(timeRange, shift)
    .errCount.x-axis.{timeRange}
      .tick:not(:nth-child(2))
        text
          transform translateX(shift)

  .customer-bp-graph
    margin-top 40px
    .el-button
      width 74px
      height 36px
    h4
      font-weight 200
      margin-bottom 40px
    [m-class="active"]
      background #20A0FF
      color #fff
      border none
    .el-button
      &:focus
        background #20A0FF
        color #fff
    .x-axis, .y-axis
      path, line
        stroke #e0e6ed
        stroke-width 0.5px

    text
      font-family Microsoft YaHei, "Helvetica Neue", Helvetica, Arial, sans-serif
    .sys-line, .dia-line
      stroke-width 2px
    .sys-line
      fill none
      stroke #20a0ff
    .dia-line
      fill none
      stroke #35BF32
    .dashed
      stroke-dasharray 6, 6
    .point-inner
      fill #fff
    .dia-point-outer
      fill #35BF32
    .sys-point-outer
      fill #20a0ff
    .text-shift
      text
        transform translateX(15px)
    .sys-bar
      fill #20a0ff
    .dia-bar
      fill #35bf32
    .axis-text
      font-size 14px
    .x-axis text,.y-axis text
      font-size 14px
    .mark-line
      stroke #99a9bf
      stroke-width 2px
    .svg-wrapper
    //padding-top 20px
    //width 1240px
      height 370px
      margin auto
      position relative
      .bp-graph
        display block
        margin auto
    .graph-toggles
      margin-top 60px
      text-align center

    .mark-tip-box
      width 120px
      height 74px
      border-radius 8px
      background #1f2d3d
      opacity 0.85
      color #fff
      font-size 12px
      z-index 101
      position absolute
      padding-top 8px
      padding-left 8px
      line-height 20px
      transform translateX(-50%)

    .mark-sample
      margin-left 45px
    .err-count-mark-sample-
      &dia, &sys
        border-radius 2px
        display inline-block
        vertical-align middle
        height 20px
        width 20px
        background-color #20a0ff
        margin-right 10px
      &dia
        margin-left 80px
        background-color #35bf32
  //margin-left 80px
    .no-data-tip
      color #666666
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)

    .svg-scroller
      width 100%
      height 467px
      overflow-x scroll
      overflow-y visible
    .trend-dia-mark,.trend-sys-mark
      display inline-block
      height 12px
      width 30px
      vertical-align middle
    .trend-dia-mark
      margin-left 30px
      background url(./assets/icon-Explain-dia.svg)
    .trend-sys-mark
      background url(./assets/icon-Explain-sys.svg)

</style>
<template>
  <div class="customer-bp-graph" ref="container">
    <h4 v-text="graphTitle" style="text-align: center"></h4>

      <div
        class="svg-wrapper"
        ref="svgWrapper"
        v-loading="graphData==null"
        :style="svgWrapperStyle"
      >
        <p class="no-data-tip" v-show="graphData&&graphData.length==0">暂无数据，请继续测量</p>
        <div class="mark-tip-box"
             :style="tipStyle"
             v-show="tipVisible"
        >
          <p>{{tipName}}平均血压值</p>
          <p>收缩压：{{markSys}}mmhg</p>
          <p>舒张压：{{markDia}}mmhg</p>
        </div>

      </div>
      <div class="mark-sample">
        <template v-if="graphType=='trend'">
          <span><span class="trend-sys-mark"></span>收缩压</span>
          <span><span class="trend-dia-mark"></span>舒张压</span>
        </template>
        <template v-if="graphType=='errCount'">
          <span><span class="err-count-mark-sample-sys"></span>收缩压异常次数</span>
          <span><span class="err-count-mark-sample-dia"></span>舒张压异常次数</span>
        </template>

      </div>


    <div class="graph-toggles">
      <el-button-group>
        <el-button
          v-for="(tab,index) in dateRangeTabs"
          :key="index"
          @click="setQuery(tab,'timeRange')"
          :m-class="tab.name==timeRange?'active':''"
        >{{tab.label}}
        </el-button>
      </el-button-group>
      <el-button-group style="float:right;margin-left:-1000px">
        <el-button
          @click="setQuery(tab,'graphType')"
          v-for="(tab,index) in graphTypeTabs"
          :key="index"
          :m-class="tab.name==graphType?'active':''"
        >{{tab.label}}
        </el-button>
      </el-button-group>
    </div>
  </div>

</template>
<script type="text/babel">
  import * as d3 from 'd3'
  import moment from 'moment'
  import {
    STORE_NAME,
    QUERY_GRAPH_DATA,
    EVT_THRESHOLD_CHANGED, SAVE_STATE_PROP
  } from './constants'
  import {getElmAttr} from './utils'
  export default{
    data () {
      return {
        sysIcon: require('!raw-loader!!./assets/icon-Explain-sys.svg'),
        diaIcon: require('!raw-loader!!./assets/icon-Explain-dia.svg'),
        timeoutId:-1,
        marklineX: 0,
        markDia: 0,
        markSys: 0,
        //today:new Date(2016,11,7),
        today: new Date(),
        graphTypeTabs: [
          {label: '折线图', name: 'trend'},
          {label: '柱状图', name: 'errCount'},
        ],
        dateRangeTabs: [
          {label: '日', name: 'day'},
          {label: '周', name: 'week'},
          {label: '月', name: 'month'},
          {label: '年', name: 'year'}
        ],
        svgConfig: {
          height: 370,
          width: 960,
          leftPadding: 45,
          rightPadding: 30,
          topPadding: 30,
          botPadding: 30
        },
        tipVisible: false,
      }
    },
    computed: {

      tipName(){
        return {
          day: '小时',
          week: '日',
          month: '日',
          year: '月'
        }[this.timeRange]
      },
      tipStyle(){
        return {
          left: this.marklineX + 'px'
        }
      },
      timeRange(){
        return this.$route.query.timeRange || 'day'
      },
      graphType(){
        return this.$route.query.graphType || 'trend'
      },
      xDomain(){
        if (this.timeRange == 'year') {

          return [new Date(this.today.getFullYear(), this.today.getMonth() - 11, 1), moment(this.today).month(this.today.getMonth() + 1).date(1)]
        } else if (this.timeRange == 'month') {
          return [
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 30),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 1),
          ]
        } else if (this.timeRange == 'week') {
          let m1 = moment().hour(0).minute(0).second(0), m2 = moment().hour(0).minute(0).second(0)
          //console.log(m1.weekday(0).toDate(),m2.weekday(7).toDate())
          return [
            moment(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 6)).hour(0).minute(0).second(0).toDate(),
            moment(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 1)).hour(0).minute(0).second(0).toDate()
          ]

        } else if (this.timeRange == 'day') {
          return [
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1, 24, 0, 0),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 24, 0, 0)
          ]
        }
      },
      yDomain(){
        if (this.graphType == 'trend') {
          return [0, 240]
        } else if (this.graphType == 'errCount') {
          //todo test
          let maxCount = 0
          let counts = []
          this.graphData.forEach(e => counts.push(e.dia, e.sys))
          maxCount = Math.max(...counts)
          maxCount = maxCount ? maxCount : 1
          let t = Math.ceil(maxCount / 6) * 6

          t = Math.abs(t) == Infinity ? 6 : t
          return [0, t]
        }
      },
      xRange(){
        return [this.svgConfig.leftPadding, this.svgConfig.width - this.svgConfig.rightPadding]
      },
      yRange(){
        return [this.svgConfig.topPadding, this.svgConfig.height - (this.svgConfig.botPadding + this.svgConfig.topPadding) / 2]
      },
      graphTitle(){

        let rangeDesc = ''
        let graphDesc = ''
        let nowMoment = moment(this.today)
        if (this.timeRange == 'day') {
          rangeDesc = nowMoment.format('YYYY年MM月DD日')
        } else if (this.timeRange == 'week') {
          rangeDesc = '过去7天'
        } else if (this.timeRange == 'month') {
          rangeDesc = '过去30天'
        } else if (this.timeRange == 'year') {
          rangeDesc = '过去一年'
        }
        if (this.graphType == 'trend') {
          graphDesc = '血压数据变化趋势图'
        } else if (this.graphType == 'errCount') {
          graphDesc = '血压异常数据出现次数'
        }
        return `${rangeDesc}${graphDesc}`
      },
      graphData(){
        const data = this.$store.state[STORE_NAME].graphViewData
        if (data == null) {
          return null
        }
        let list
        if (this.graphType == 'trend') {
          list = data.map(e => {

            return {
              ...e,
              date: new Date(e.day)
            }
          })

        } else if (this.graphType == 'errCount') {
          list = data.map(e => {
            return {
              date: new Date(e.day),
              dia: e.diastolicPressureTimes,
              sys: e.systolicPressureTimes
            }
          })
        }
        return list
      },

      xTickSizeInner(){
        return -1 * (this.svgConfig.height - this.svgConfig.topPadding - this.svgConfig.botPadding)
      },
      yTickSizeInner(){
        return -1 * (this.svgConfig.width - this.svgConfig.leftPadding - this.svgConfig.rightPadding)
      },
      xAxisTransform(){
        return `translate(0,${this.svgConfig.height - (this.svgConfig.botPadding + this.svgConfig.topPadding) / 2})`
      },
      yAxisTransform(){
        return `translate(${this.svgConfig.leftPadding},0)`
      },
      xTickCount(){
        if (this.timeRange == 'year') {

          return 13
        } else if (this.timeRange == 'month') {

          return 29
        } else if (this.timeRange == 'week') {
          return 8
        } else if (this.timeRange == 'day') {
          return 25
        }
      },
      xTickWidth(){
        return (this.xRange[1] - this.xRange[0]) / (this.xTickCount - 1)
      },
      typeUnion(){
        return [this.graphType, this.timeRange].join('')
      },
      bpState () {
        return this.$store.state[STORE_NAME]
      },

      needInit(){
        //console.log(this.$store.state['views-customer-info-left'])
        return this.$store.getters.userId != -1 && this.bpState.listViewData == null
      },
    },
    watch: {
      needInit(v){
        if (v) {
          this.$store.dispatch(QUERY_GRAPH_DATA, {
            timeRange: this.timeRange,
            graphType: this.graphType,
            // todo
            day: this.today.getTime(),
            userId: this.$store.getters.userId
          })
        }
      },
      graphData(v){
        if (v) {
          this.drawGraph()
        }

      },
      typeUnion(){
        //todo query graphData
        this.clearGraph()
        this.queryData()
      }
    },
    methods: {
      clearGraph(){
        let s = this.$refs.svgWrapper.querySelector('.bp-graph')
        if (s) {
          s.parentNode.replaceChild(s.cloneNode(false), s);
        }
      },
      queryData(){
        this.$store.dispatch(QUERY_GRAPH_DATA, {
          timeRange: this.timeRange,
          graphType: this.graphType,
          // todo
          day: this.today.getTime(),
          userId: this.$store.getters.userId,
          doctorId:this.$store.state.doctor.accid,
          patientId:this.$route.params.id,

        })
      },
      hoverGraph($svg, xList){

        let mx = d3.mouse($svg.node())[0]
        let px = xList.filter(e => e > mx - 2 && e < mx + 2)[0]
        let points = d3.selectAll('.p' + px)
        d3.select('.mark-line').remove()
        if (points.node()) {
          //用x画一条线
          this.marklineX = px
          $svg.append('line')
            .attr('x1', px).attr('x2', px)
            .attr('y1', this.yRange[0]).attr('y2', this.yRange[1])
            .attr('class', 'mark-line')
          this.tipVisible = true
          let circles = document.querySelectorAll('.p' + px)

          for (let i = 0; i < circles.length; i++) {
            if (circles[i].dataset) {
              if (circles[i].dataset.dia) {
                this.markDia = circles[i].dataset.dia
              }
              if (circles[i].dataset.sys) {
                this.markSys = circles[i].dataset.sys
              }
            } else {
              // for ie
              if (circles[i].getAttribute('data-dia')) {
                this.markDia = circles[i].getAttribute('data-dia')
              }
              if (circles[i].getAttribute('data-sys')) {
                this.markSys = circles[i].getAttribute('data-sys')
              }
              //alert(this.markSys+':'+this.markDia)
            }

          }
        } else {
          this.tipVisible = false
        }
      },
      isNeighbourXTick(d, prevD){
        let offset = d - prevD
        if (this.timeRange == 'day') {
          return Math.round(offset / (60 * 60 * 1000)) == 1
        } else if (this.timeRange == 'week' || this.timeRange == 'month') {
          //return offset<2*60*60*1000*24
          return Math.round(offset / (60 * 60 * 1000 * 24)) == 1
        } else if (this.timeRange == 'year') {
          //return offset<2*60*60*1000*24*35
          return Math.round(offset / (60 * 60 * 1000 * 24 * 35)) == 1
        }

      },
      drawGraph(){
        console.log('111111')
        this.setGraphSize()
        //svg 400 * 1000
        this[{
          trend: 'lineChart',
          errCount: 'histogram'
        }[this.graphType]]()
        //this.lineChart()
      },
      xTickFmt(d){
        if (d.getTime() == this.xDomain[0].getTime()) {
          return {
            day: '时',
            week: '周',
            month: '日',
            year: '月'
          }[this.timeRange]
        }
        if (this.timeRange == 'year') {
          if (this.graphType == 'errCount') {
            return d.getMonth() || 12
          } else {
            return d.getMonth() + 1
          }

        } else if (this.timeRange == 'month') {
          if (this.graphType == 'errCount') {
            let d1 = new Date(d.getTime())
            d1.setDate(d1.getDate() - 1)
            return d1.getDate()
          } else {
            return d.getDate()
          }

        } else if (this.timeRange == 'week') {
          let n = 0
          if (this.graphType == 'errCount') {
            n = (7 + d.getDay() - 1) % 7
          } else {
            n = (7 + d.getDay()) % 7
          }
          const cnChars = {
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六',
            0: '日'
          }
          return cnChars[n]
          //return d.toISOString().substr(0,10)
        } else if (this.timeRange == 'day') {
          if (this.graphType == 'errCount') {
            let d1 = new Date(d.getTime())
            d1.setHours(d1.getHours() - 1)
            return d1.getHours()
          } else {
            return d.getHours()
          }


        }
      },
      genAxis(){
        let $svg
        if (d3.select('.bp-graph').node()) {
          $svg = d3.select('.bp-graph')
            .attr('class', 'bp-graph')
            .attr('width', this.svgConfig.width)
            .attr('height', this.svgConfig.height)
        } else {
          $svg = d3.select(this.$refs.svgWrapper)
            .append('svg')
            .attr('class', 'bp-graph')
            .attr('width', this.svgConfig.width)
            .attr('height', this.svgConfig.height)
        }
        $svg.on('mouseleave', () => {
          d3.select('.mark-line').remove()
          this.tipVisible = false
        })
        const fx = d3
          .scaleTime()
          .rangeRound(this.xRange)
          .domain(this.xDomain)

        const xAxis = d3.axisBottom(fx)
          .tickSizeInner(this.xTickSizeInner)
          .tickSizeOuter(0)
          .tickPadding(10)
          .ticks(this.xTickCount)
          .tickFormat(this.xTickFmt)
//        .tickValues([1,2,3,4,5,6,7])

        $svg.append('g')
          .attr('class', 'x-axis ' + this.graphType + ` ${this.timeRange}`)
          .attr('transform', this.xAxisTransform)
          .call(xAxis)
        const axisYScale = d3
          .scaleLinear()
          .domain([...this.yDomain])
          //趋势
          .range([...this.yRange].reverse())
        const fy = d3
          .scaleLinear()
          .domain(this.yDomain)
          //趋势
          .range([...this.yRange].reverse())
        if (this.graphType == 'errCount') {
          //特别注意这里
          fy.range([0, Math.abs(this.yRange[0] - this.yRange[1])])

        }
        const yAxis = d3.axisLeft(axisYScale)
          .tickSizeInner(this.yTickSizeInner)
          .tickSizeOuter(0)
          .tickPadding(10)
          .tickValues(
            [0, 1, 2, 3, 4, 5, 6].map(
              e =>
                (e * Math.max(...this.yDomain) / 6)
            )
          )
          .tickFormat(t => t == 0 ? '' : (t + ''))

        $svg.append('g')
          .attr('class', 'y-axis')
          .attr('transform', this.yAxisTransform)
          .call(yAxis)
        $svg
          .append('text')
          .text(this.graphType == 'trend' ? 'mmhg' : '次')
          .attr('font-size', '12')
          .attr('x', this.svgConfig.leftPadding)
          .attr('y', '20')
          .attr('fill','#000')
          .attr('class','axis-text')
          //.attr('stroke','#000')
        return {
          $svg, fx, fy, xAxis, yAxis
        }
      },
      lineChart(){

        const {$svg, fx, fy, xAxis} = this.genAxis()

        //todo pathData 若有缺失，需要用空数据填充，对于给定的组合(graphType,timeRange),
        // pathdata有固定的项数
        const pathData = this.graphData
        // console.log(this.dashPairs)

        const pointXList = pathData.map(e => fx(new Date(e.date)))
        $svg.on('mousemove', () => this.hoverGraph($svg, pointXList))
//line chart
//        const diaLineGen = d3.line()
//        diaLineGen.x(d => fx(new Date(d.date)))
//        diaLineGen.y(d => fy(d.diastolicPressure))
        const $line1G = $svg.append('g').attr('class', 'lines')

        for (let i = 1; i < pathData.length; i++) {
          let dashClz = ''
          //console.log('####',this.xTickFmt(pathData[i].date)-this.xTickFmt(pathData[i-1].date),'###')
          if (!this.isNeighbourXTick(pathData[i].date, pathData[i - 1].date)) {
            dashClz = ' dashed'
          }
          $line1G.append('line')
            .attr('class', 'sys-line' + dashClz)
            .attr('x1', fx(pathData[i].date))
            .attr('x2', fx(pathData[i - 1].date))
            .attr('y1', fy(pathData[i].systolicPressure))
            .attr('y2', fy(pathData[i - 1].systolicPressure))
          $line1G.append('line')
            .attr('class', 'dia-line' + dashClz)
            .attr('x1', fx(pathData[i].date))
            .attr('x2', fx(pathData[i - 1].date))
            .attr('y1', fy(pathData[i].diastolicPressure))
            .attr('y2', fy(pathData[i - 1].diastolicPressure))
        }

        const $line2G = $svg.append('g')

        const points1G = $line1G.append('g').selectAll('my-points')
          .data(pathData)
          .enter()
        points1G.append('circle')
          .attr('class', d => 'p' + fx(d.date) + ' dia-point-outer')
          .attr('cx', d => fx(new Date(d.date)))
          .attr('cy', d => fy(d.diastolicPressure))
          .attr('r', 4)

        points1G.append('circle')
          .attr('class', d => 'p' + fx(d.date) + ' point-inner')
          .attr('cx', d => fx(new Date(d.date)))
          .attr('cy', d => fy(d.diastolicPressure))
          .attr('r', 2)
          .attr('data-dia', d => d.diastolicPressure)

        const points2G = $line2G.append('g').selectAll('my-points')
          .data(pathData)
          .enter()
        points2G.append('circle')
          .attr('class', d => 'p' + fx(d.date) + ' sys-point-outer')
          .attr('cx', d => fx(new Date(d.date)))
          .attr('cy', d => fy(d.systolicPressure))
          .attr('r', 4)

        points2G.append('circle')
          .attr('class', d => 'p' + fx(d.date) + ' point-inner')
          .attr('cx', d => fx(new Date(d.date)))
          .attr('cy', d => fy(d.systolicPressure))
          .attr('r', 2)
          .attr('data-sys', d => d.systolicPressure)

        //console.log('making lineChart')
      },
      histogram(){
        const {$svg, fx, fy, xAxis, yAxis} = this.genAxis()

        //set the ticktext offset
        let $tickTexts = document.querySelectorAll('.customer-bp-graph .errCount.x-axis :not(:nth-child(2)).tick text')
        for(let i = 0;i<$tickTexts.length;i++){
          $tickTexts[i].setAttribute('transform',`translate(-${this.xTickWidth/2},0)`)
        }
        //console.log(yAxis.tickValues())
        // window.__ax = xAxis
        const barData = this.graphData

        const barG = $svg.append('g').attr('class', 'my-bars-' + this.timeRange).selectAll('.bar')
          .data(barData).enter()


        barG.append('rect')
          .attr('class', 'sys-bar')
          .attr('x', d => fx(d.date) +this.xTickWidth/8)
          .attr('y', 0)
          //.attr('width', this.xTickWidth / 3)
          .attr('height', d => fy(d.sys))
          .attr('transform', this.xAxisTransform + ' scale(1,-1)')
          .attr('width',this.xTickWidth/4)
        barG.append('rect')
          .attr('class', 'dia-bar')
          .attr('x', d => fx(d.date) + 5*this.xTickWidth/8)
          .attr('y', 0)
          //.attr('width', this.xTickWidth / 3)
          .attr('height', d => fy(d.dia))
          .attr('transform', this.xAxisTransform + ' scale(1,-1)')
          .attr('width',this.xTickWidth/4)
        // for ie

        //console.log('making histogram')
      },
      setQuery(tab, queryName){
        this.$router.replace({
          query: {
            ...this.$route.query,
            [queryName]: tab.name
          }
        })
      },
      setGraphSize(){
        let containerRect = this.$refs.container.getBoundingClientRect()
        this.svgConfig.width = containerRect.width
      },
      onThresholdChanged(){
      },
      onWinResize(){
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(a=>{
          this.clearGraph()
          this.drawGraph()
        },50)
      },
    },
    mounted(){
//      window.addEventListener('resize',this.onWinResize)
      window.__d3 = d3
      this.$root.$off(EVT_THRESHOLD_CHANGED)
      this.$root.$on(EVT_THRESHOLD_CHANGED, this.onThresholdChanged)
      if (this.$store.getters.userId != -1) {
        this.queryData()
      }

    }
  }
</script>
