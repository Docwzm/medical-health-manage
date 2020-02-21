<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "index.styl";
</style>
<template>
  <div class="admin-content-box admin-data-attribute">
    <div class="admin-title">
      <h2>统计概览</h2>
      <div class="time">
        统计时间范围：  截止{{baseData.year}}-{{baseData.month}}-{{baseData.day}}
      </div>
    </div>

    <div class="top-datas">
      <div class="item">
        <h3 class="title">平台用户总数</h3>
        <b>{{baseData.total}}</b>
      </div>
      <div class="item">
        <h3 class="title">关联微信用户总数</h3>
        <b>{{baseData.bindWechat}}</b>
      </div>
      <div class="item">
        <h3 class="title">绑定设备的人数</h3>
        <b>{{bindDeviceData.bindDevice}}</b>
      </div>
      <div class="item">
        <h3 class="title">已上传数据的用户数</h3>
        <b>{{updateDate.uploadData}}</b>
      </div>
      <div class="item">
        <h3 class="title">未上传数据的用户数</h3>
        <b>{{updateDate.unUploadData}}</b>
      </div>
    </div>

    <div class="statistics-list">
      <div class="statistics-item" id="add-statistics">
        <div class="title">
          <span class="left" @mouseenter="titleTipsShow(1,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>新增用户</span>
          <div class="right">
            <a href="javascript:;" class="item add-user-item item-active" @click="chartTab(1,0)">日</a>
            <a href="javascript:;" class="item add-user-item" @click="chartTab(1,1)">月</a>
            <a href="javascript:;" class="item add-user-item" @click="chartTab(1,2)">年</a>
          </div>
        </div>

        <div class="info">
          <div class="left">
            <div class="item">
              <span class="label">{{addName}}新增用户:</span>
              <span class="detail">{{newUserVal.newAddUser}}</span>
            </div>
            <div class="item">
              <span class="label">APP渠道:</span>
              <span class="detail">{{newUserVal.patientSource}}</span>
            </div>
            <div class="item">
              <span class="label">微信渠道:</span>
              <span class="detail">{{newUserVal.patientSource2}}</span>
            </div>
            <div class="item">
              <span class="label">健康管理平台:</span>
              <span class="detail">{{newUserVal.patientSource1}}</span>
            </div>
          </div>

          <div class="right">
            <h3 class="name">环比增长</h3>
            <div class="wrap">
              <div class="circle age-cricle">
                <div class="percent percent-left age-percent-left"></div>
                <div class="percent percent-right wth0 age-percent-right"></div>
              </div>
              <div class="num cricle-num age-cricle-num"><span>{{newUserVal.rate*100 | rateFilter}}</span>%</div>
            </div>

          </div>

        </div>
      </div>
      <div class="statistics-item" id="active-statistics">
        <div class="title">
          <span class="left" @mouseenter="titleTipsShow(2,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>活跃用户</span>
          <div class="right">
            <a href="javascript:;" class="item active-user-item item-active" @click="chartTab(2,0)">日</a>
            <a href="javascript:;" class="item active-user-item" @click="chartTab(2,1)">月</a>
            <a href="javascript:;" class="item active-user-item" @click="chartTab(2,2)">年</a>
          </div>
        </div>

        <div class="info">
          <div class="left">
            <div class="item">
              <span class="label">{{activeName}}活跃用户:</span>
              <span class="detail">{{activeUserVal.activeUser}}</span>
            </div>
            <div class="item">
              <span class="label">APP渠道:</span>
              <span class="detail">{{activeUserVal.patientSource}}</span>
            </div>
            <div class="item">
              <span class="label">微信渠道:</span>
              <span class="detail">{{activeUserVal.patientSource2}}</span>
            </div>
            <div class="item">
              <span class="label">健康管理平台:</span>
              <span class="detail">{{activeUserVal.patientSource1}}</span>
            </div>
          </div>

          <div class="right">
            <h3 class="name">环比增长</h3>
            <div class="wrap">
              <div class="circle active-cricle">
                <div class="percent percent-left active-percent-left"></div>
                <div class="percent percent-right wth0 active-percent-right"></div>
              </div>
              <div class="num cricle-num active-cricle-num"><span>{{activeUserVal.rate*100 | rateFilter}}</span>%</div>
            </div>

          </div>

        </div>
      </div>
    </div>

    <div class="statistics-mod">
      <div class="title">
        <span class="left" @mouseenter="titleTipsShow(3,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>用户年龄构成</span>
        <span class="right">用户总数：{{userTotal}}人</span>
      </div>

      <div class="chart-con" id="attribute-age-chart"></div>
      <div class="chart-con-none" id="attribute-age-chart-none">
        <div class="round">暂无测量数据</div>
      </div>
    </div>


    <div class="statistics-mod">
      <div class="title">
        <span class="left" @mouseenter="titleTipsShow(4,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>用户来源构成</span>
        <span class="right">用户总数：{{userTotal}}人</span>
      </div>

      <div class="chart-con" id="attribute-from-chart"></div>
      <div class="chart-con-none" id="attribute-from-chart-none">
        <div class="round">暂无测量数据</div>
      </div>
    </div>

    <div class="statistics-mod">
      <div class="title">
        <span class="left" @mouseenter="titleTipsShow(5,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>用户性别比例</span>
        <span class="right">用户总数：{{userTotal}}人</span>
      </div>

      <div class="chart-con" id="attribute-sex-chart"></div>
      <div class="chart-con-none" id="attribute-sex-chart-none">
        <div class="round">暂无测量数据</div>
      </div>
    </div>


    <div class="statistics-mod">
      <div class="title">
        <span class="left" @mouseenter="titleTipsShow(6,$event)" @mouseleave="titleToggle=false"><span class="icon"></span>用户绑定设备比例</span>
        <span class="right">用户总数：{{userTotal}}人</span>
      </div>

      <div class="chart-con" id="attribute-bind-chart"></div>
      <div class="chart-con-none" id="attribute-bind-chart-none">
        <div class="round">暂无测量数据</div>
      </div>
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
        activeName: '日',
        addName: '日',
        doctorInfos: {
          infos:{},
        },
        baseData: {
          total: 0,
          bindWechat: 0,
        },
        bindDeviceData: {
          total: 0,
          bindDevice: 0,
        },
        updateDate: {
          uploadData: 0,
          unUploadData: 0,
        },
        newUser: {
          dimNewAddUserAnalysisDayDto: {},
          dimNewAddUserAnalysisMonthDto: {},
          dimNewAddUserAnalysisYearDto: {},
        },
        newUserVal: {
          newAddUser: 0,
          patientSource: 0,
          patientSource1: 0,
          patientSource2: 0,
          rate: 0,
        },
        activeUser: {
          dimActiveUserAnalysisDayDto : {},
          dimActiveUserAnalysisMonthDto : {},
          dimActiveUserAnalysisYearDto: {},
        },
        activeUserVal: {
          activeUser: 0,
          patientSource: 0,
          patientSource1: 0,
          patientSource2: 0,
          rate: 0,
        },
        userTotal: 0,
        circleNum2: 0,
        ageChart: [],
        fromChart: [],
        sexChart: [],
        bindChart: [],
        titleToggle: false,
        titleTipsTxt: ""
      }
    },
    watch: {
      'newUserVal.rate' (val) {
        this.addUsers('age-cricle', 'age-percent-right', 'age-percent-left', 'age-cricle-num', val)
      },
      'activeUserVal.rate' (val) {
        this.activeUsers('active-cricle', 'active-percent-right', 'active-percent-left', 'active-cricle-num', val)
      },
      'doctorInfos.infos' ({accid}) {
        const _this = this
        if(accid) {
          _this.getOrganBase(accid)
          _this.getActiveUser(accid)
          _this.getNewUser(accid)
          _this.getBindDevice(accid)
          _this.getUploadData(accid)
        }

      }

    },
    methods: {
      ...actions,
    },
    created() {
      this.init()
    },
    filters: {
      rateFilter (val) {
        if(val < 0) {
          return '+0'
        } else if(val > 999) {
          return '999+'
        } else {
          return '+'+val.toFixed(0)
        }
      }
    }
  }
</script>