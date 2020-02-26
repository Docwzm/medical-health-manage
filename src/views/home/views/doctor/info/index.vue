<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<template>
  <div>
    <div class="admin_bg" v-if="!isAdmin">
      <div class="admin-title">
        <h2>账号信息</h2>
      </div>
      <div class="layout">
        <div class="imgs">
          <div class="head-img head-img3" :class="{'head-img2':doctorInfo.infos.headimgurl}">
            <img :src="doctorInfo.infos.headimgurl" alt="" width="100" height="100" v-if="doctorInfo.infos.headimgurl">
          </div>
          <div id="doctorQrcode">
            <img :src="qrCode" v-if="qrCode != ''"
                 alt="" class="code" width="100" height="100">
          </div>
        </div>

        <div class="detail">
          <div class="item">
            <div class="left">
              <span class="label">医生姓名：</span><span class="word">{{doctorInfo.infos.name | adminInfoFilter}}</span>
            </div>

            <div class="right">
              <span class="label">所属机构：</span><span class="word word2">{{doctorInfo.infos.hospitalName | adminInfoFilter}}</span>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <span class="label">所属科室：</span><span class="word">{{doctorInfo.infos.departments | doctorInfoFilter}}</span>
            </div>
            <div class="right">
              <span class="label">医生职称：</span><span class="word word2">{{doctorInfo.infos.title | adminInfoFilter}}</span>
            </div>
          </div>

          <div class="item">
            <div class="left">
              <span class="label">手机号码：</span><span class="word">{{doctorInfo.infos.mobile | adminInfoFilter}}</span>
            </div>
            <div class="right">
              <span class="label">认证状态：</span><span
                    class="word word2">已认证</span>
            </div>
          </div>
          <div class="item">
            <div class="left" style="width:100%">
              <span class="label">注册时间：</span><span class="word word3">{{doctorInfo.infos.created | dateTimeFilter}}</span>
            </div>
          </div>
          <div class="item">
            <div class="left" style="width:100%">
              <span class="label">认证时间：</span><span class="word word3">{{doctorInfo.infos.centificationed | dateTimeFilter}}</span>
            </div>
          </div>

        </div>

        <div class="detail">
          <div class="item">
            <div class="left">
              <span class="label">用户总数：</span><span class="word">{{patientCount}}</span>
            </div>

          </div>

          <div class="item">
            <div class="left">
              <span class="label">助手总数：</span><span class="word">{{doctorAssistant}}</span>
            </div>
            <div class="right">
              <span class="label">协作医生：</span><span class="word">0</span>
            </div>
          </div>
        </div>

        <div class="blank"></div>
        <ul class="list list2" v-if="deviceList.length > 0">
          <li class="item" @click="viewDevice(item.id,index,$event)" v-for="(item, index) in deviceList"
              :key="index" :ref="'li'+item.id">
            <img :src="item.picture" :alt="item.name"
                 width="68" height="68">
            <p class="name" :title="item.name">{{item.name}}</p>
          </li>
          <li class="clear"></li>

        </ul>
        <div class="tips">您可以在乐心医生app修改执业信息，修改后需要经过乐心再次认证，才能正常登录健康管理平台。</div>
      </div>



      <div class="device_dialog" :class="{'device-dialog-show':isShowDevice}"
           :style="{left:offsetLeft + 'px',top:offsetTop + 110 + 'px'}">
        <span class="arrow"></span>
        <a href="javascript:;" class="close" @click="isShowDevice = false"></a>
        <h2 class="detail-title">设备详情</h2>
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

    <div class="admin_bg" v-if="isAdmin">
      <div class="admin-title">
        <h2>账号信息</h2>
      </div>
        <div class="layout">
          <div class="el-loading-mask common-loading" v-show="doctorLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
          <div class="imgs">
            <div class="head-img" :class="{'head-img2':adminInfo.infos.avatar}">
              <img :src="adminInfo.infos.avatar" alt="" width="100" height="100" v-if="adminInfo.infos.avatar">
            </div>
              <img  :src="qrCode" alt="二维码" class="code" width="100" height="100">
          </div>

          <div class="detail">
            <div class="item">
              <div class="left">
                <span class="label"><span style="opacity:0">联</span>联系人：</span><span class="word">{{adminInfo.infos.linkman | adminInfoFilter}}</span>
              </div>

              <div class="right">
                <span class="label">联系电话：</span><span class="word word2">{{adminInfo.infos.linkmanMobile | adminInfoFilter}}</span>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <span class="label">机构类别：</span><span class="word">{{adminInfo.infos.typeKey | adminInfoFilter}}</span>
              </div>
              <div class="right">
                <span class="label">机构名称：</span><span class="word word2">{{adminInfo.infos.name | adminInfoFilter}}</span>
              </div>
            </div>

            <div class="item">
              <div class="left">
                <span class="label">机构等级：</span><span class="word">{{adminInfo.infos.level | adminInfoFilter}}</span>
              </div>
              <div class="right">
                <span class="label">上级机构：</span><span
                      class="word word2">{{adminInfo.infos.parentName | adminInfoFilter}}</span>
              </div>
            </div>

          </div>

          <div class="detail">
            <div class="item">
              <div class="left" style="width:100%">
                <span class="label">所属地区：</span><span class="word word3">{{prov_city}}{{adminInfo.infos.dist | addressFilter}}</span>
              </div>
            </div>

            <div class="item">
              <div class="left" style="width:100%">
                <span class="label">详细地址：</span><span class="word word3">{{adminInfo.infos.address | adminInfoFilter}}</span>
              </div>
            </div>


          </div>
          <div class="tips">如需更改管理员账户信息，请联系乐心客服。</div>
          <div class="blank"></div>
        </div>
  </div>
  </div>
</template>
<script type="text/babel">
  import Page from '../../../../../components/common/page/Page'
  import {dateTimeFilter} from '../../../../../filters/index'
  import actions from './actions'

  export default {
    data () {
      return {
        isAdmin: false,
        adminInfo: {
          infos: {}
        },
        isShowDevice: false,
        deviceDetail: {},
        deviceId: '',
        deviceList: [],
        radio: '1',
        offsetLeft: 0,
        offsetTop: 0,
        doctorInfo: {
          infos: {}
        },
        departmentsName: '',
        doctorAssistant: '',
        qrCode: '',
        followCount: '',
        patientCount: '',
        doctorLoading: false,
        prov_city: '',
      }
    },
    mounted () {
      this.init()
    },
    watch: {
      'adminInfo.infos' (val) {
        if(val.name) {
          this.doctorLoading = false
          this.infosHandle(val)
        }
      },
      'doctorInfo.infos' (val) {
        const _this = this
        if(val.name) {
          _this.doctorLoading = false
          if(_this.doctorInfo.infos.headimgurl.indexOf('icon_user_no_man') > -1) {
            _this.doctorInfo.infos.headimgurl = ''
          }
        }
        if(val.accid) {
          _this.getDeviceList(val.accid)
        }
      },
    },
    components: {
      Page,
    },
    methods: {
      ...actions,
    },
    filters: {
      dateTimeFilter,
      adminInfoFilter (val) {
        if(val == "" || !val) {
          return "暂无"
        } else {
          return val
        }
      },
      doctorInfoFilter (val) {
        if(val == "" || !val) {
          return "暂无"
        } else {
          return val[0].name
        }
      },
      addressFilter (val) {
        if(val) {
         return val.name
        }
      },
      departmentsFilter (val) {
        if(val) {
          if(val[0]) {
            return val[0].name
          } else {
            return "暂无"
          }
        }
      }
    }
  }
</script>
