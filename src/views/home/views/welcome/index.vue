<style lang="stylus" scoped>
  @import "../../../../styles/layout.styl";
  @import "./index.styl";
</style>

<template>

  <div class="admin-content-box welcome">
    <div class="mod1">
      <div class="info">
        <div class="img-con img-con3 img-con2" v-if="doctorInfos.infos.headimgurl">
          <img class="img" :src="doctorInfos.infos.headimgurl" width="80" height="80">
        </div>
        <div class="img-con img-con3" v-if="!doctorInfos.infos.headimgurl"></div>
        <div class="detail">
          <p class="s1">{{doctorInfos.infos.title}}: {{doctorInfos.infos.name}}</p>
          <p class="s2">机构: {{doctorInfos.infos.hospitalName}}</p>
          <p class="s2">上次登录时间: {{doctorInfos.infos.lastLoginTime | timeFilter}}</p>
        </div>
      </div>
      <div class="info">
        <div class="img-con img-con2" id="doctorCode">
        </div>
        <div class="detail">
          <p class="s1">医生二维码</p>
          <p class="s2">扫描后，用户可在乐心健康服务号</p>
          <p class="s2">申请加入健康管理平台</p>
        </div>
      </div>
    </div>

    <div class="mod mod2">
      <div class="admin-title">
        <h2>消息通知</h2>
      </div>
      <ul class="list list2">
        <li class="item item1" @click="goMessage('2')">
          <span class="icon"></span>
          <div class="detail">
            <!--<p><span>数据异常</span>{{exception.exceptionCount}}</p>-->
            <p><span>数据异常</span>{{abnormalNewCount}}</p>
          </div>
        </li>
        <li class="item item2" @click="goMessage('1')">
          <span class="icon"></span>
          <div class="detail">
            <!--<p><span>未读对话</span>{{IM}}</p>-->
            <p><span>未读对话</span>{{talkNewCount}}</p>
          </div>
        </li>
        <li class="item item3" @click="goMessage('3')">
          <span class="icon"></span>
          <div class="detail">
            <!--<p><span>关联申请</span>{{patient}}</p>-->
            <p><span>关联请求</span>{{applyNewCount}}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="mod mod2">
      <div class="admin-title">
        <h2>数据概览</h2>
      </div>
      <ul class="list list3">
        <li class="item item1" @click="goList">
          <span class="icon"></span>
          <div class="detail">
            <p><span>用户总数</span>{{docotorData.patientCount}}</p>
            <p><span>新增用户数</span>{{docotorData.incrementPatientCount}}</p>
          </div>
        </li>
        <li class="item item2" @click="goGroup">
          <span class="icon"></span>
          <div class="detail">
            <p><span>用户分组</span>{{docotorData.groupingCount}}</p>
            <p><span>新增用户分组</span>{{docotorData.incrementGroupingCount}}</p>
          </div>
        </li>
      </ul>
    </div>



    <div class="mod mod3">
      <div class="admin-title">
        <h2>平台公告</h2>
      </div>
      <ul class="list">
        <li class="item">
          健康管理平台已经正式上线，欢迎使用
          <span class="time">2017年2月6日 09:00</span>
        </li>
        <!--<li class="item">-->
        <!--健康管理平台1.0版本将于2月份正式上线-->
        <!--<span class="time">2016-12-20 09:00</span>-->
        <!--</li>-->
        <!--<li class="item">-->
        <!--健康管理平台1.0版本将于2月份正式上线-->
        <!--</li>-->
        <!--<li class="item">-->
        <!--健康管理平台1.0版本将于2月份正式上线-->
        <!--</li>-->
        <!--<li class="item">-->
        <!--健康管理平台1.0版本将于2月份正式上线-->
        <!--</li>-->
      </ul>
    </div>
  </div>
</template>

<script type="text/babel">
  import getters from '../../top/getters'
  import actions from './actions'
  import moment from 'moment'
  export default {
    name: 'welcome',
    data () {
      return {
        doctorInfos: {
          infos:{
            headimgurl: "",
            title: "",
            hospitalName: "",
            lastLoginTime: "",
          },
        },
        exception: {
          exceptionCount:0
        },
        IM: 0,
        patient: 0,
        follow: 0,
        weekFollow: 0,
        today: 0,
        tomorrow: 0,
        lastLoginTime: "",
        code: "",
        docotorData: {
          patientCount:0,
          incrementPatientCount: 0,
          groupingCount: 0,
          incrementGroupingCount: 0,
        },
      }
    },
    mounted () {
      this.init()
    },
    computed: {
      ...getters,
    },
    methods: {
      ...actions
    },
    watch: {
      'doctorInfos.infos.headimgurl' (val) {
        const _this = this
        if(val) {
          if(val.indexOf('icon_user_no_man') > -1) {
            _this.doctorInfos.infos.headimgurl = false
          }
        } else {
          _this.doctorInfos.infos.headimgurl = false
        }
      },
      'doctorInfos.infos.accid' (val) {
        this.createCode(this.doctorInfos.infos.qrcodeUrl)
      }
    },
    filters: {
      timeFilter (val) {
        if(val) {
          return moment(val).format('YYYY.MM.DD') + '\t\n\r\t\n\r\t\n\r' + moment(val).format('HH:mm')
        }
      }
    }
  }
</script>

