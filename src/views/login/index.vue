<style lang="stylus" scoped>
  @import "styl/login.styl";
</style>
<style lang="stylus">
  @import "styl/login2.styl";
</style>
<template>
  <div class="login-layout">
    <div class="login-top">
        <div class="layout">
          <div class="logo">乐心健康管理平台</div>
          <div class="code" @mouseenter="loginCode=true" @mouseleave="loginCode=false">
              <div class="icon">移动端下载</div>
              <div class="hide" v-if="loginCode"></div>
          </div>
        </div>
    </div>
    <div class="login-banner">
      <div class="layout">
          <div class="login-form">
            <div class="el-loading-mask common-loading" v-show="loginLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
            <div class="tabs">
              <div class="item" @click="roleType=0" :class="{'item-active':roleType == 0}">
                医生
              </div>
              <div class="item" @click="roleType=1" :class="{'item-active':roleType == 1}">
                管理员
              </div>
            </div>

            <div class="form">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="200px" class="login-rule-form">
                <el-form-item label="登录账号" prop="username">
                  <el-input v-model="ruleForm.username" type="text" placeholder="请输入11位手机号码" @keyup.enter.native="logining('ruleForm')" :maxlength=11></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" :class="{'is-error':password_error}">
                  <el-input v-model="ruleForm.password" type="password" placeholder="请输入6-12位密码" @keyup.enter.native="logining('ruleForm')" :maxlength=12></el-input>
                </el-form-item>
                <el-checkbox v-model="auto_checked">&nbsp;&nbsp;记住密码（7天有效）</el-checkbox>
                <el-button type="primary" class="login-btn" @click="logining('ruleForm')">登 录</el-button>
                <div class="forget">
                  <router-link to="forget" class="fright">忘记密码？</router-link>
                </div>
                <div class="form-error-tips" v-show="password_error">{{error_tips}}</div>
              </el-form>
            </div>
          </div>
      </div>
    </div>

    <div class="login-mod">
      <div class="layout">
        <div class="left">
          <h2 class="title">OTC药店营销管理系统</h2>
          <p class="tips">通过智能设备，帮助药店快速积累会员。药店使用健康管理平台，可以对会员进行多维度分析、个性化分组、消息群发，提供用药提示，购药指导等增值服务，增强会员忠诚度，为线下药店引流。</p>
          <p class="item">智能硬件支持</p>
          <p class="item">快速积累会员</p>
          <p class="item">会员属性分析</p>
          <p class="item">微信群发消息</p>
        </div>
        <div class="right login-mod-img1"></div>
      </div>
    </div>

    <div class="login-mod2">
      <div class="layout">
        <div class="right login-mod-img2">
        </div>
        <div class="left">
          <h2 class="title">医院/社区患者管理系统</h2>
          <p class="tips">借助智能手环，智能血压计，智能血糖仪等硬件，医院能够远程监控患者血压，血糖，心率，睡眠等身体数据，帮助患者快速建档，对患者进行健康指导，医嘱确认，定时随访。</p>
          <p class="item">智能硬件支持</p>
          <p class="item">患者快速建档</p>
          <p class="item">远程数据监控</p>
          <p class="item">远程查房随访</p>
        </div>
      </div>
    </div>

    <div class="login-mod">
      <div class="layout">
        <div class="left">
          <h2 class="title">专业机构健康管理系统</h2>
          <p class="tips">机构管理者可以通过智能硬件（血压计、血糖仪、体脂秤、运动手环）与用户建立互动关系，查看用户个人健康数据，进行在线沟通，快速发展机构会员，提高品牌曝光度。</p>
          <p class="item">对接多种智能硬件</p>
          <p class="item">快速积累机构会员</p>
          <p class="item">会员体征数据管理</p>
          <p class="item">线上线下互动沟通</p>
        </div>
        <div class="right login-mod-img3"></div>
      </div>
    </div>

    <div class="login-mod3">
      <div class="layout">
        <h2 class="title">机构接入流程</h2>
        <div class="icons">
          <div class="line"></div>
          <div class="item item1">1</div>
          <div class="item item2">2</div>
          <div class="item item3">3</div>
          <div class="item item4"></div>
        </div>

        <div class="tips">
          <div class="item">
            <p class="name">提交资料</p>
            <p class="detail">机构提交机构类型、机构名称、联系人、联系方式等给乐心健康</p>
          </div>
          <div class="item">
            <p class="name">资料审核</p>
            <p class="detail">乐心健康将审核机构提交的机构信息，
              <br>并通知机构审核的结果</p>
          </div>
          <div class="item">
            <p class="name">账号开通</p>
            <p class="detail">审核通过后，乐心将账户通过邮件发送给机构，
              机构使用账户登录健康管理平台</p>
          </div>
        </div>
      </div>
    </div>

    <div class="login-mod3">
      <div class="layout">
        <h2 class="title">医生接入流程</h2>
        <div class="icons">
          <div class="line"></div>
          <div class="item item1">1</div>
          <div class="item item2">2</div>
          <div class="item item3">3</div>
          <div class="item item4"></div>
        </div>
        <div class="tips">
          <div class="item">
            <p class="name">注册账户</p>
            <p class="detail">医生下载乐心医生APP，使用手机号注册账户，并填写执业信息</p>
          </div>
          <div class="item">
            <p class="name">账户认证</p>
            <p class="detail">乐心健康将审核医生提交的执业信息，
              <br>并通知医生审核的结果</p>
          </div>
          <div class="item">
            <p class="name">账户开通</p>
            <p class="detail">审核通过后，医生使用注册的手机号码即可
              直接登录乐心健康管理平台</p>
          </div>
        </div>

      </div>
    </div>

    <div class="login-footer">
      <div class="layout">
        <div class="left">
          <div class="item item1">
            <a href="http://www.lifesense.com/about/introduce/" class="icon"></a>
          </div>
          <div class="item">
            <a href="http://www.lifesense.com/about/introduce/" class="link">关于乐心</a><span class="space">|</span><a href="" class="link">服务条款</a><span class="space">|</span><a href="" class="link">使用帮助</a>
          </div>
          <div class="item">
            Copyright @copy 2010 - 2016 Lifesense 粤ICP备11060463号-1
          </div>
          <div class="item">
            互联网药品信息服务资格证（粤） - 非经营性 - 2016 - 0260
          </div>
        </div>

        <div class="right">
          <h3>合作伙伴</h3>
          <div class="item">
            <a href="">中山小榄社区医院</a><span>|</span><a href="">中山板芙社区医院</a><span>|</span><a href="">深圳罗湖社康中心</a><span>|</span><a href="">西安强森社区医院</a><span>|</span><a href="">石家庄第一人民医院</a><span>|</span><a href="">湘潭市第六人民医院</a><span>|</span><a href="">宝芝林大药房</a><span>|</span><a href="">康泽药业</a><span>|</span><a href="">一德堂大药房</a><span>|</span><a href="">湖南雅馨大药房</a><span>|</span><a href="">栖奈健康管理</a>
          </div>
        </div>
      </div>
    </div>

  </div>


</template>

<script type="text/babel">
  import actions from '../../store/actions/login'
  import getters from './index/getters'
  export default {
    data () {
      var validatePhone = (rule, value, callback) => {
        var phoneRule = /^\d{11}$/
        if(phoneRule.test(value)) {
          callback()
        } else {
          callback(new Error('请输入11位手机号码'))
        }
      }
      return {
        ruleForm: {
          username: "",
          password: "",
        },
        rules: {
          username: [
            { required: true, message: '请输入11位手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入6-12位密码', trigger: 'blur' },
            { min: 6, max: 12, message: '请输入6-12位密码', trigger: 'blur' },
          ]
        },
        auto_checked: false,
        phone_error: false,
        password_error: false,
        error_tips: '',
        phone: '',
        password: '',
        rememberPassword: '',
        passwordIsChange: false,
        loginLoading: false,
        loginCode: false,
        roleType: 0,
      }
    },
    computed: {
      ...getters,
    },
    watch: {
      'ruleForm.password' (val) {
        this.passwordIsChange = true
      },
    },
    methods: {
      ...actions,
    },
    created () {
      this.init()
    },
    mounted () {
      if(navigator.userAgent.indexOf('Mac') > 0) {
        document.getElementsByClassName('login-layout')[0].className = 'login-layout login-layout-mac'
      }
    }
  }
</script>


