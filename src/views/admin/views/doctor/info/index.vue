<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<template>
  <div class="admin-doctor-detail">
    <div class="admin-title">
      <h2>账号信息</h2>
      <!--<span class="item" @click="goOrder">服务订单</span>-->
    </div>

    <div class="layout" v-loading.body="infoLoading">
      <div class="imgs">
        <div class="head-img" :class="{'head-img2':infos.headimgurl != ''}">
          <img :src="infos.headimgurl" alt="" class="" width="100" height="100" v-if="infos.headimgurl != ''">
          <img src="" alt="" width="100" height="100" v-if="infos.headimgurl == '' || !infos.headimgurl" style="opacity:0">
        </div>
        <div class="code" id="doctorCode"></div>
      </div>
      <div class="detail">
        <div class="item">
          <div class="left">
            <span class="label">医生姓名：</span><span class="word">{{infos.name}}</span>
          </div>
          <div class="right">
            <span class="label">所属机构：</span><span class="word word2">{{infos.hospitalName}}</span>
          </div>
        </div>

        <div class="item">
          <div class="left">
            <span class="label">所属科室：</span><span class="word">{{infos.departmentName}}</span>
          </div>
          <div class="right">
            <span class="label">医生职称：</span><span
                  class="word word2">{{infos.title}}</span>
          </div>
        </div>

        <div class="item">
          <div class="left">
            <span class="label">手机号码：</span><span class="word">{{infos.mobile}}</span>
          </div>
          <div class="right">
            <span class="label">认证状态：</span><span class="word word2">{{infos.certificationStatus | certificationStatusFilter}}</span>
          </div>
        </div>

      </div>


      <div class="detail">
        <div class="item">
          <div class="left">
            <span class="label">用户总数：</span><span class="word">{{infos.userCount}}</span>
          </div>
          <div class="right">
            <span class="label">随访次数：</span><span class="word word2">{{infos.followCount}}</span>
          </div>
        </div>

        <div class="item">
          <div class="left">
            <span class="label">助手总数：</span><span class="word">{{infos.assistantCount}}</span>
          </div>
          <div class="right">
            <span class="label">协作医生：</span><span class="word word2">{{infos.doctorCount}}</span>
          </div>
        </div>

      </div>



      <div class="blank"></div>
      <ul class="list list2">
        <li class="item" @click="viewDevice(item.id,index,$event)" v-for="(item, index) in deviceList"
        :ref="'li'+item.id">
        <img :src="item.picture" :alt="item.name"
        width="68" height="68">
        <p class="name">{{item.name}}</p>
        </li>
        <li class="clear"></li>

      </ul>
      <div class="blank"></div>

    </div>
    <div class="device_dialog" :class="{'device-dialog-show':isShowDevice}"
         :style="{left:offsetLeft + 'px',top:offsetTop + 110 + 'px'}">
      <span class="arrow"></span>
      <a href="javascript:;" class="close" @click="isShowDevice = false"></a>
      <h2 class="title">设备详情</h2>
      <div class="line"></div>
      <div class="detail">
        <div class="detail_l">
          <img class="head" width="80" height="80" :src="deviceDetail.picture">
          <div id="qrcode" class="code"></div>
        </div>
        <div class="detail_r">
          <ul class="info_list">
            <li class="info_item"><span class="label">设备名称：</span> <span>{{deviceDetail.name}}（{{deviceDetail.salesModel}}）</span></li>
            <li class="info_item"><span class="label">型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
              <span>{{deviceDetail.model}}</span></li>
            <li class="info_item"><span class="label">SN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</span>
              <span>{{deviceDetail.sn}}</span></li>
            <li class="info_item" v-if="deviceDetail.userNo" style="opacity: 0"><span class="label">当前绑定按键：</span>
              <el-radio class="radio" v-model="deviceDetail.userNo" value="1">1号按键</el-radio>
              <el-radio class="radio" v-model="deviceDetail.userNo" value="2">2号按键</el-radio>
            </li>
            <li class="info_item" v-if="!deviceDetail.userNo" style="opacity: 0"><span class="label">当前绑定按键：</span>
              <el-radio class="radio"  value="1" disabled>1号按键</el-radio>
              <el-radio class="radio"  value="2" disabled>2号按键</el-radio>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import actions from './actions'
  import getters from './getters'
  import router from '../../../../../router'
  export default {
    data () {
      return {
        infoLoading: false,
        doctorId: "",
        offsetLeft: 0,
        offsetTop: 0,
        isShowDevice: false,
        radio: '1',
        qrCode:{},
      }
    },
    computed: {
      ...getters,
    },
    methods: {
      ...actions,
    },
    created () {
      this.init(router.currentRoute.params)
    },
    filters: {
      departmentsFilter (val) {
        if (val) {
          if (val[0]) {
            return val[0].name
          } else {
            return "暂无"
          }
        }
      },
      certificationStatusFilter (val) {
        switch (val) {
          case 0:
            return "未认证"
            break
          case 1:
            return "认证中"
            break
          case  2:
            return "已认证"
            break
          case 3:
            return "认证失败"
            break
        }
      }
    },
    watch:{
      'infos.headimgurl' (val) {
        const _this = this
        _this.infos.headimgurl = val.indexOf('icon_user_no_man.png') == -1 ? val : ""
      },
    },
  }
</script>
