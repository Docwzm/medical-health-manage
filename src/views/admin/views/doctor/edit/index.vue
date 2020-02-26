<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "./index2.styl";
</style>
<template>
  <div class="admin-content-box admin-editor-doctor">
    <div class="admin-title">
      <h2 v-if="isCreate">新增医生</h2>
      <h2 v-if="!isCreate">编辑医生信息</h2>
    </div>

    <div class="loading-box">
      <div class="el-loading-mask common-loading" v-show="formLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
      <div class="con">
        <div class="head-tool">
          <div class="el-loading-mask common-loading" v-show="imgLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
          <div class="img" :class="{'img-has':headimgurl!=''}">
            <img :src="headimgurl" alt="" v-if="headimgurl !=''" width="100" height="100">
          </div>
          <div class="upload">
            <form id="J_from">
              <input type="file" class="upload-file" @change="getFile" accept="image/png">
            </form>
            <el-button class="upload-btn">上传头像</el-button>
          </div>

          <p class="tips">格式必须为PNG<br>大小不超过2M</p>

        </div>

        <div class="form-list">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <div class="item">
              <span class="label">姓名</span>
              <div class="detail">
                <el-form-item prop="name">
                  <el-input
                          class="form_input"
                          placeholder="请输入真实姓名"
                          :maxlength=10
                          v-model="ruleForm.name">
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="item">
              <span class="label">所属机构</span>
              <div class="detail">
                <el-form-item prop="hospitalId">
                  <el-select class="form_select" v-model="ruleForm.hospitalId" placeholder="请选择">
                    <el-option
                            v-for="(item,index) in hospitalList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="item">
              <span class="label">科室</span>
              <div class="detail">
                <el-form-item prop="departmentId" >
                  <el-select class="form_select" v-model="ruleForm.departmentId" placeholder="请选择科室">
                    <el-option
                            v-for="(item,index) in departmentList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="item">
              <span class="label">职称</span>
              <div class="detail">
                <el-form-item prop="titleId" >
                  <el-select class="form_select" v-model="ruleForm.titleId" placeholder="请选择职称">
                    <el-option
                            v-for="(item,index) in titleList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

              </div>
            </div>
            <div class="item">
              <span class="label">手机号码</span>
              <div class="detail">
                <el-form-item prop="mobile" >
                  <el-input
                          class="form_input"
                          placeholder="请输入11位手机号码"
                          :maxlength=11
                          :disabled="!isCreate"
                          v-model="ruleForm.mobile">
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="item">
              <span class="label">密码</span>
              <div class="detail">
                <el-form-item prop="password" v-if="isCreate">
                  <el-input
                          class="form_input"
                          placeholder="请输入6-12位密码"
                          :maxlength=12
                          type="password"
                          v-model="ruleForm.password">
                  </el-input>
                </el-form-item>

                <el-button v-if="!isCreate" type="primary" class="reset-password-btn" @click="resetPassword">重置密码</el-button>
              </div>
            </div>
          </el-form>


        </div>
      </div>

      <div class="form-btns">
        <el-button type="danger" class="btn" v-if="!isCreate" @click="deleteDoctor" v-show="ruleForm.userCount == 0">删&nbsp;&nbsp;除</el-button><el-button type="primary" :disabled="true" class="btn btn2"  v-if="!isCreate" v-show="ruleForm.userCount > 0">删&nbsp;&nbsp;除</el-button><el-button type="primary" class="btn" @click="submitForm('ruleForm')">保&nbsp;&nbsp;存</el-button><el-button class="btn" @click="goList">取&nbsp;&nbsp;消</el-button>

        <div class="tips" v-show="ruleForm.userCount > 0">
          <p>该医生已和用户建立医患关系，暂无法删除该医生。</p>
          <p>若需要删除该医生，需要先解除所有相关的医患关系</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script type="text/babel">
  import actions from './actions'
  import router from '../../../../../router'
  import Page from '../../../../../components/common/page/Page'
  export default {
    data () {
      var checkMobile = (rule, value, callback) => {
        if(isNaN(value)) {
          callback(new Error('请输入11位纯数字'))
        } else {
          callback()
        }
      }
      var checkName = (rule, value, callback) => {
        var nameRule = /[^\u4e00-\u9fa5]/
        if(nameRule.test(value)) {
          callback(new Error('请输入中文'))
        } else {
          callback()
        }
      }
      var checkPassword = (rule, value, callback) => {
        var nameRule = /[\u4e00-\u9fa5]/
        if(nameRule.test(value)) {
          callback(new Error('请输入6-12位密码'))
        } else {
          callback()
        }
      }
      return {
        id:"",
        formLoading: false,
        isCreate: true,
        headimgurl: "",
        imgLoading: false,
        fileFormDate: null,
        hospitalList: [],
        departmentList: [],
        titleList: [],
        ruleForm: {
          name: '',
          hospitalId: '',
          departmentId: '',
          titleId: '',
          mobile: '',
          password: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            {validator: checkName, trigger: 'blur' }
          ],
          hospitalId: [
            { required: true, message: '请选择所属机构', trigger: 'change' }
          ],
          departmentId: [
            { required: true, message: '请选择科室', trigger: 'change' }
          ],
          titleId: [
            { required: true, message: '请选择职称', trigger: 'change' }
          ],
          mobile: [
            { required: true, message: '请输入11位手机号码', trigger: 'blur' },
            {  min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入6-12位密码', trigger: 'blur' },
            {  min:6,max: 12, message: '请输入6-12位密码', trigger: 'blur' },
            { validator: checkPassword, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      ...actions,
    },
    components: {
      Page,
    },
    created () {
      this.init(router.currentRoute.params)
    },
  }
</script>
