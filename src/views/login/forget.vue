<style lang="stylus" scoped>
  @import "styl/forget.styl";
</style>
<template>
  <div class="forget_bg">
    <header class="header">
      <div class="layout">
        <div class="logo" @click="goLogin">乐心健康管理平台</div>
        <div class="code" @mouseenter="loginCode=true" @mouseleave="loginCode=false">
          <div class="icon">移动端下载</div>
          <div class="hide" v-if="loginCode"></div>
        </div>
      </div>
    </header>
    <div class="form">
      <div class="progress">
        <div class="steps" :class="{step1:step1,step2:step2,step3:step3}">
          <span class="item item1"><div class="con"></div></span>
          <span class="item item2 item_round"><div class="con"></div></span>
          <span class="item item3"><div class="con"></div></span>
          <span class="item item4 item_round"><div class="con"></div></span>
          <span class="item item5"><div class="con"></div></span>
        </div>
        <div class="steps_word" :class="{steps_word1:step1,steps_word2:step2}">
          <span class="s1">验证手机号码</span>
          <span class="s2">输入新的密码</span>
        </div>
      </div>

      <div class="form_list" :class="{form_list1:step1,form_list2:step2,form_list3:step3}">
        <div class="error_tips" v-show="error_tips_show">{{error_tips}}</div>
        <div class="form_item form_item1" v-loading.body="step1Loading">
          <ul class="con">
            <li class="item">
              <span class="label">账号</span>
              <div class="detail">
                <input type="tel" maxlength="11" class="input" placeholder="请输入11位手机号码" v-model="form_data1"
                       :class="{input_error:form_data1_error}">
              </div>
            </li>
            <li class="item">
              <span class="label">验证码</span>
              <div class="detail">
                <input type="text" class="input input2" placeholder="" v-model="form_data2"
                       :class="{input_error:form_data2_error}">
                <a href="javascript:;" class="code_btn" :class="{code_btn_disable:sendCodeDisable}" @click="sendCode">{{sendCodeTips}}</a>
              </div>
            </li>
            <li class="item">
              <router-link to="/" class="cancel">取 消</router-link><a href="javascript:;" class="submit" @click="checkForm1Submit">确 认</a>
            </li>
          </ul>
        </div>
        <div class="form_item form_item2" v-loading.body="step2Loading">
          <ul class="con">
            <li class="item">
              <span class="label">请输入新密码</span>
              <div class="detail">
                <input type="password" class="input" placeholder="" v-model="form_data3"  maxlength="12"
                       :class="{input_error:form_data3_error}">
              </div>
            </li>
            <li class="item">
              <span class="label">请验证新密码</span>
              <div class="detail">
                <input type="password" class="input" placeholder="" v-model="form_data4"  maxlength="12"
                       :class="{input_error:form_data4_error}">
              </div>
            </li>
            <li class="item">
              <router-link to="/" class="cancel">取 消</router-link><a href="javascript:;" class="submit" @click="resetPasswordSubmit">确 认</a>
            </li>
          </ul>
        </div>
        <div class="form_item form_item3">
          <p class="s1">密码修改成功，返回首页重新登录!</p>
          <p class="s2">如果浏览器没有自动跳转，请
            <router-link to="/">点击这里</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>

</template>
<script type="text/babel">
  import actions from './forget/actions'
  export default {
    data () {
      return {
        step: 1,
        step1: false,
        step2: false,
        step3: false,
        error_tips_show: false,
        form_data1: '',
        form_data2: '',
        form_data3: '',
        form_data4: '',
        error_tips: '',
        isRegister: false,
        form_data1_error: false,
        form_data2_error: false,
        form_data3_error: false,
        form_data4_error: false,
        sendCodeDisable: false,
        loginCode: false,
        sendCodeTips: '获取验证码',
        error_tips_list: ['请输入正确手机号', '请输入正确验证码', '账号未注册！请输入已注册账号', '验证码不正确', '请输入6-12位纯数字密码', '两次输入的密码不一致','请重复输入6-12位纯数字密码','账号未注册，请输入已注册账号'],
        step1Loading: false,
        step2Loading: false,
      }
    },
    mounted () {
      const _this = this
      setTimeout(function () {
        _this.step1 = true
      }, 10)
    },
    methods: {
      ...actions
    },
    watch: {
      'step' () {
        const _this = this
        switch (_this.step) {
          case 1:
            _this.step1 = true
            break
          case 2:
            _this.step2 = true
            break
          case 3:
            _this.step3 = true
            break
        }
      },
    }
  }
</script>
