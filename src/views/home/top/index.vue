<style lang="stylus" scoped>
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "./index2.styl";
</style>
<style>

</style>
<template>
  <div class="index">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <div class="top-box" :class="{'top-box-show':menuShow}">
      <div class="top-content">


        <div v-if="!isAdmin">
          <h1 class="title" v-if="!doctorInfos.hospitalLogoUrl" @click="goHome">{{doctorInfos.hospitalName}}</h1>
          <h1 class="title title2" v-if="doctorInfos.hospitalLogoUrl" @click="goHome"><img :src="doctorInfos.hospitalLogoUrl">{{doctorInfos.hospitalName}}</h1>
          <div class="time"><span>|</span>{{day}}</div>


          <div class="tool" @mouseenter="adminToolShow = true" @mouseleave="adminToolShow = false">
            <div class="top top2" v-if="doctorInfos.headimgurl == '' || !doctorInfos.headimgurl"></div>
            <div class="top top2 top3" v-if="doctorInfos.headimgurl != '' && doctorInfos.headimgurl">
              <img :src="doctorInfos.headimgurl" alt="">
            </div>
            <div class="hide-select" :class="{'hide-select-show':adminToolShow}">
              <div class="list" v-loading.body="loginOutLoading">
                <div class="item" @click="adminUrl"><span class="icon" v-html="toolIcons.icon1"></span>账号信息</div>
                <div class="item" @click="resetForm('ruleForm')"><span class="icon" v-html="toolIcons.icon2"></span>修改密码</div>
                <div class="item" @click="loginOut"><span class="icon" v-html="toolIcons.icon3"></span>退出登录</div>
              </div>
            </div>
          </div>

        </div>

        <div v-if="isAdmin">
          <h1 class="title" v-if="!adminInfos.avatar" @click="goHome">{{adminInfos.name}}</h1>
          <h1 class="title title2" v-if="adminInfos.avatar" @click="goHome"><img :src="adminInfos.avatar">{{adminInfos.name}}</h1>
          <div class="time"><span>|</span>{{day}}</div>
          <div class="tool" @mouseenter="adminToolShow = true" @mouseleave="adminToolShow = false">
            <div class="top"></div>
            <div class="hide-select" :class="{'hide-select-show':adminToolShow}">
                <div class="list" v-loading.body="loginOutLoading">
                  <div class="item" @click="adminUrl"><span class="icon" v-html="toolIcons.icon1"></span>账号信息</div>
                  <div class="item" @click="resetForm('ruleForm')"><span class="icon" v-html="toolIcons.icon2"></span>修改密码</div>
                  <div class="item" @click="loginOut"><span class="icon" v-html="toolIcons.icon3"></span>退出登录</div>
                </div>
            </div>
          </div>
        </div>
          <div class="message" @mouseenter="adminMessageShow = true" @mouseleave="adminMessageShow = false">

            <div class="top">
              <el-badge :is-dot="talkNewCount > 0 || abnormalNewCount > 0 || applyNewCount > 0" class="item" v-if="!isAdmin">
                <div class="top_empty"></div>
              </el-badge>
            </div>

            <div class="hide-select" :class="{'hide-select-show':adminMessageShow}">
              <div class="list">
                <div class="item item1" v-if="!isAdmin" @click="goDoctorMessage('1')">
                  <span class="icon" v-html="messageIcons.icon1"></span>
                  <span class="name">对话消息</span>
                  <span class="nums" v-if="talkNewCount > 0">{{talkNewCount}}</span>
                  <!--<span class="time" v-if="talkNewCount > 0">{{taklNewDate | newTipDateFilter}}</span>-->
                </div>
                <div class="item item2" v-if="!isAdmin" @click="goDoctorMessage('2')">
                  <span class="icon" v-html="messageIcons.icon2"></span>
                  <span class="name">数据异常</span>
                  <span class="nums" v-if="abnormalNewCount > 0">{{abnormalNewCount}}</span>
                  <!--<span class="time" v-if="abnormalNewCount > 0">{{abnormalNewDate | newTipDateFilter}}</span>-->
                </div>
                <div class="item item3" v-if="!isAdmin" @click="goDoctorMessage('3')">
                  <span class="icon" v-html="messageIcons.icon3"></span>
                  <span class="name">关联请求</span>
                  <span class="nums" v-if="applyNewCount > 0">{{applyNewCount}}</span>
                  <!--<span class="time" v-if="applyNewCount > 0">{{applyNewDate | newTipDateFilter}}</span>-->
                </div>
                  <div class="item item4" @click="goMessage">
                    <span class="icon" v-html="messageIcons.icon4"></span>
                    <span class="name">消息发送</span>
                    <!--<span class="nums">24</span>-->
                    <!--<span class="time">16:34</span>-->
                  </div>
              </div>
            </div>
          </div>

      </div>

    </div>

    <el-dialog title="修改密码" v-model="resetPasswordWindowShow" size="tiny" class="reset_dialog" :modal=false>

        <ul class="list" v-loading.body="resetLoading">
          <li class="item">
            <div class="label_name">请输入原密码</div>
            <el-form-item prop="oldPassword">
              <el-input
                      type="password"
                      class="form_input"
                      placeholder=""
                      :maxlength=12
                      v-model="ruleForm.oldPassword">
              </el-input>
            </el-form-item>
          </li>
          <li class="item">
            <div class="label_name">请输入新密码</div>
            <el-form-item prop="newPassword">
              <el-input
                      type="password"
                      class="form_input"
                      placeholder=""
                      :maxlength=12
                      v-model="ruleForm.newPassword">
              </el-input>
            </el-form-item>
          </li>
          <li class="item">
            <div class="label_name">请确认新密码</div>
            <el-form-item prop="newPassword2">
              <el-input
                      type="password"
                      class="form_input"
                      placeholder=""
                      :maxlength=12
                      v-model="ruleForm.newPassword2">
              </el-input>
            </el-form-item>
          </li>
          <li class="item">
            <el-button @click="resetPasswordWindowShow = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          </li>
        </ul>
    </el-dialog>

    <el-dialog title="修改成功" v-model="successWindowShow" size="tiny" class="reset_dialog reset_dialog_success" :modal=false>
      <ul class="list">
        <li class="item">
          <el-button type="primary" @click="successWindowShow = false">确 定</el-button>
        </li>
        <div class="tips">
          <span class="con">请使用新密码登录</span>
        </div>
      </ul>
    </el-dialog>
    </el-form>
  </div>

</template>

<script type="text/babel">
  import moment from 'moment'
  import {shortcutMenus} from '../../../store/getters/menus'
  import actions from './actions'
  import getters from './getters'
  import router from './../../../router'
  import {getlocalStorage} from '../../../api/common'
  export default {
    name: 'home-top',
    mounted () {
      const _this = this
      //临时处理两种用户类型
      if(getlocalStorage('roleType') == 1) {
        _this.isAdmin = true
      }
      _this.init()

    },
    data () {
      var checkPassword = (rule, value, callback) => {
        if(isNaN(value)) {
          callback(new Error('请输入6-12位纯数字密码'))
        } else {
          callback()
        }
      }
      var checkNewPassword = (rule, value, callback) => {
        if(value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入的新密码不一致!'))
        } else {
          callback()
        }
      }
      var wrongPassword = (rule, value, callback) => {
        if(value == "") {
          callback(new Error('输入的原密码有误!'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          oldPassword: [
            { required: true, message: '请输入6-12位原密码', trigger: 'blur' },
            {  min:6,max: 12, message: '请输入6-12位原密码', trigger: 'blur' },
            { validator: checkPassword, trigger: 'blur'},
            { validator: wrongPassword},
          ],
          newPassword: [
            { required: true, message: '请输入6-12位纯数字新密码', trigger: 'blur' },
            {  min:6,max: 12, message: '请输入6-12位纯数字新密码', trigger: 'blur' },
            { validator: checkPassword, trigger: 'blur'}
          ],
          newPassword2: [
            { required: true, message: '请重复输入6-12位纯数字新密码', trigger: 'blur' },
            {  min:6,max: 12, message: '请重复输入6-12位纯数字新密码', trigger: 'blur' },
            {validator: checkNewPassword, trigger: 'blur'}
          ],
        },
        ruleForm: {
          oldPassword: "",
          newPassword: "",
          newPassword2: "",
        },
        isAdmin:false,
        menuShow: false,
        resetPasswordWindowShow: false,
        successWindowShow: false,
        day: '',
        resetLoading: false,
        loginOutLoading: false,
        messageIcons:{
          icon1:require('!!raw!../../../../static/admin/icon_message_dialogue.svg'),
          icon2:require('!!raw!../../../../static/admin/icon_message_datawarning.svg'),
          icon3:require('!!raw!../../../../static/admin/icon_message_link.svg'),
          icon4:require('!!raw!../../../../static/admin/icon_message_send.svg'),
        },
        toolIcons: {
          icon1:require('!!raw!../../../../static/admin/icon_head_personal.svg'),
          icon2:require('!!raw!../../../../static/admin/icon_head_password.svg'),
          icon3:require('!!raw!../../../../static/admin/icon_head_signout.svg'),
        },
        adminMessageShow: false,
        adminToolShow: false,
      }
    },
    computed: {
      ...getters,
    },
    methods: {
      ...actions,
    },
  }
</script>

