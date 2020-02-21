<template>
  <div class="echarts"></div>
</template>

<style>
  .echarts {
    width: 935px;
    height: 460px;
  }
</style>

<script>
  import echarts from 'echarts/lib/echarts'
  import debounce from 'lodash.debounce'
  import {warn} from './util'
  const ACTION_EVENTS = [
    'legendselectchanged',
    'legendselected',
    'legendunselected',
    'datazoom',
    'datarangeselected',
    'timelinechanged',
    'timelineplaychanged',
    'restore',
    'dataviewchanged',
    'magictypechanged',
    'geoselectchanged',
    'geoselected',
    'geounselected',
    'pieselectchanged',
    'pieselected',
    'pieunselected',
    'mapselectchanged',
    'mapselected',
    'mapunselected',
    'axisareaselected',
    'brush',
    'brushselected'
  ]
  const MOUSE_EVENTS = [
    'click',
    'dblclick',
    'mouseover',
    'mouseout',
    'mousedown',
    'mouseup',
    'globalout'
  ]
  export default {
    props: {
      options: Object,
      theme: String,
      initOptions: Object,
      group: String,
      autoResize: Boolean
    },
    data() {
      return {
        chart: null
      }
    },
    computed: {
      width: {
        cache: false,
        get() {
          return this.chart.getWidth()
        }
      },
      height: {
        cache: false,
        get() {
          return this.chart.getHeight()
        }
      },
      isDisposed: {
        cache: false,
        get() {
          return this.chart.isDisposed()
        }
      }
    },
    watch: {
      options: {
        handler(options) {
          if (!this.chart && options) {
            this._init()
          } else {
            this.chart.setOption(this.options, true)
          }
        },
        deep: true
      },
      group: {
        handler(group) {
          this.chart.group = group
        }
      }
    },
    methods: {
      mergeOptions(options) {
        this._delegateMethod('setOption', options)
      },
      resize(options) {
        this._delegateMethod('resize', options)
      },
      dispatchAction(payload) {
        this._delegateMethod('dispatchAction', payload)
      },
      convertToPixel(finder, value) {
        return this._delegateMethod('convertToPixel', finder, value)
      },
      convertFromPixel(finder, value) {
        return this._delegateMethod('convertFromPixel', finder, value)
      },
      containPixel(finder, value) {
        return this._delegateMethod('containPixel', finder, value)
      },
      showLoading(type, options) {
        this._delegateMethod('showLoading', type, options)
      },
      hideLoading() {
        this._delegateMethod('hideLoading')
      },
      getDataURL(options) {
        return this._delegateMethod('getDataURL', options)
      },
      getConnectedDataURL(options) {
        return this._delegateMethod('getConnectedDataURL', options)
      },
      clear() {
        this._delegateMethod('clear')
      },
      dispose() {
        this._delegateMethod('dispose')
      },
      _delegateMethod(name, ...args) {
        if (!this.chart) {
          warn(`无法在图表初始化之前调用[${name}]. 请先设置[options].`, this)
          return
        }
        return this.chart[name](...args)
      },
      _init() {
        if (this.chart) {
          return
        }
        let chart = echarts.init(this.$el, this.theme, this.initOptions)
        if (this.group) {
          chart.group = this.group
        }
        chart.setOption(this.options, true)
        ACTION_EVENTS.forEach(event => {
          chart.on(event, params => {
            this.$emit(event, params)
          })
        })
        MOUSE_EVENTS.forEach(event => {
          chart.on(event, params => {
            this.$emit(event, params)
            this.$emit('chart' + event, params)
          })
        })
        if (this.autoResize) {
          this.__resizeHanlder = debounce(() => {
            chart.resize()
          }, 100, {leading: true})
          window.addEventListener('resize', this.__resizeHanlder)
        }
        this.chart = chart
      }
    },
    mounted() {
      if (this.options) {
        this._init()
      }
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }
      this.dispose()
    },
    connect(group) {
      if (typeof group !== 'string') {
        group = group.map(chart => chart.chart)
      }
      echarts.connect(group)
    },
    disconnect(group) {
      echarts.disConnect(group)
    },
    registerMap(...args) {
      echarts.registerMap(...args)
    },
    registerTheme(...args) {
      echarts.registerTheme(...args)
    }
  }
</script>
