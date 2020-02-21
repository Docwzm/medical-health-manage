<style lang="stylus" scoped>
  @import "../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<template>
  <div class="admin-content-box welcome">
    <div class="mod1">
      <div class="info">
        <div class="img-con" :class="{'img-con2':adminInfo.infos.avatar}">
          <img class="img" :src="adminInfo.infos.avatar" width="80" height="80" v-if="adminInfo.infos.avatar">
        </div>
        <div class="detail">
          <p class="s1">管理员: {{adminInfo.infos.linkman}}</p>
          <p class="s2">管理机构: {{adminInfo.infos.name}}</p>
          <p class="s2">上次登录时间: {{lastLoginTime}}</p>
        </div>
      </div>
      <div class="info">
        <div class="img-con img-con2">
          <img :src="code" width="80" height="80">
        </div>
        <div class="detail">
          <p class="s1">机构二维码</p>
          <p class="s2">您的用户扫描后，在乐心健康服务号</p>
          <p class="s2">接收到机构图文消息推送</p>
        </div>
      </div>
    </div>

    <div class="mod mod2">
      <div class="admin-title">
        <h2>数据概览</h2>
      </div>
      <ul class="list">
        <li class="item item1" @click="goDoctorList">
          <span class="icon"></span>
          <div class="detail">
            <p><span>医生总数</span>{{info.doctorCount}}人</p>
            <p><span>新增医生数</span>{{info.incrementDoctorDaily}}人</p>
          </div>
        </li>
        <li class="item item2" @click="goUserList">
          <span class="icon"></span>
          <div class="detail">
            <p><span>用户总数</span>{{info.patientCount}}人</p>
            <p><span>新增用户数</span>{{info.incrementPatientDaily}}人</p>
          </div>
        </li>
        <!--<li class="item item3">-->
          <!--<span class="icon"></span>-->
          <!--<div class="detail">-->
            <!--<p>服务收益金</p>-->
            <!--<p>&yen;{{info.totalAmount}}</p>-->
          <!--</div>-->
        <!--</li>-->
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
  import actions from './actions'
  import getters from './getters'
  export default {
    data () {
      return {
        adminInfo: {
          infos: {}
        },
        lastLoginTime: '',
        code: '',
      }
    },
    watch: {
      "adminInfo.infos" ({qrcodeTicket}) {
        if(qrcodeTicket) {
          this.code = `//mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${qrcodeTicket}`
        }
      }
    },
    computed: {
      ...getters,
    },
    methods: {
      ...actions,
    },
    created () {
      this.init()
    },
  }
</script>