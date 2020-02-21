<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "../attribute/index.styl";
  @import "index.styl";
</style>
<template>
  <div class="admin-content-box admin-data-attribute admin-data-health">

    <div class="statistics-mod">
      <div class="title">
        <span class="left" @mouseenter="titleTipsShow(1,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>用户疾病类型分布</span>
        <span class="right">统计时间范围： 截止{{baseData.year}}-{{baseData.month}}-{{baseData.day}}</span>
      </div>
      <div class="none-tips" v-show="chart1Show">暂无测量数据</div>
      <div class="count-num">总计{{chart1Count}}人</div>
      <div class="chart-con" id="health-sickType-chart"></div>
    </div>


    <div class="statistics-mod">
      <div class="title">
        <span class="left" @mouseenter="titleTipsShow(2,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>用户血压类型分布</span>
        <span class="right">统计时间范围： 截止{{bpData.year}}-{{bpData.month}}-{{bpData.day}}</span>
      </div>
      <div class="none-tips" v-show="chart2Show">暂无测量数据</div>
      <div class="count-num">总计{{chart2Count}}笔</div>
      <div class="chart-con" id="health-bpType-chart"></div>
    </div>


    <div class="statistics-mod">
      <div class="title">
        <span class="left" @mouseenter="titleTipsShow(3,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>用户血压测量习惯</span>
        <span class="right">统计时间范围： 截止{{bpData.year}}-{{bpData.month}}-{{bpData.day}}</span>
      </div>
      <div class="none-tips" v-show="chart3Show">暂无测量数据</div>
      <div class="count-num">总计{{chart3Count}}笔</div>
      <div class="chart-con" id="health-bpCheck-chart"></div>
    </div>

    <div class="title-tips-win" v-show="titleToggle">
      <span class="arrow"></span>
      <span class="arrow arrow2"></span>
      <div v-html="titleTipsTxt"></div>
    </div>
  </div>
</template>
<script type="text/babel">
  import actions from './actions'
  export default {
    data () {
      return {
        doctorInfos: {
          infos:{},
        },
        baseData: {},
        bpData: {},
        titleToggle: false,
        titleTipsTxt: "",
        time3: "",
        sickType: [],
        bpType: [],
        bpCheck: [],
        chart1Show: false,
        chart2Show: false,
        chart3Show: false,
        chart1Count:0,
        chart2Count:0,
        chart3Count:0,
      }
    },
    methods: {
      ...actions,
    },
    created() {

    },
    mounted() {
      this.init()
    },
    watch: {
      'doctorInfos.infos' ({accid}) {
        const _this = this
        if(accid) {
          _this.getOrganBase(accid)
          _this.getUserBp(accid)
        }

      }
    }

  }
</script>