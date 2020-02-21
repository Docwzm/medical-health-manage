<style lang="stylus" scoped>
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "./index2.styl";
  @import "../../../../../../styles/table.styl";
</style>
<template>
  <div>
    <my-tabs class="flex" @tab-click="tabLinks" :activeName="activeName">
      <my-tab-pane label="健康数据" name="patient_doctor_info"></my-tab-pane>
      <my-tab-pane label="对话" :style="{margin: 0}" name="chat_reply"></my-tab-pane>
    </my-tabs>
    <div class="infoBox">
      <div class="left" ref="left">
        <left type="doctor"></left>
      </div>
      <div class="right">
        <div class="editor-reply">
          <div class="row-tips-con" v-show="rowTipsShow">{{rowTipsVal}}<span class="arrow"></span><span class="arrow arrow2"></span></div>
          <div class="tool">
            <div class="back" @click="goChat">
              <b>&lt;</b>&nbsp;&nbsp;返回对话
            </div>
            <div class="right">
              <el-button @click="addReply(false)">添加</el-button><el-button @click="deleteReply(false)">删除</el-button>
            </div>
          </div>
          <div class="admin-list">
            <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
            <el-table
                    :data="showList"
                    stripe
                    @selection-change="handleSelectionChange"
            >
              <el-table-column
                      type="selection"
                      width="50">
              </el-table-column>
              <el-table-column
                      inline-template
                      label="快捷语"
                        >
                <div>
                  <div v-if="row.word.length > 30" :title="row.word" >{{row.word | wordFilter}}</div>
                  <div v-if="row.word.length <= 30">{{row.word}}</div>
                </div>
              </el-table-column>
              <el-table-column
                      inline-template
                      label="操作"
                      width="100"
              >
                <div>
                  <div><span class="row-click" @click="addReply(true, row)">编辑</span><span class="row-click" @click="deleteReply(true, row)">删除</span></div>
                </div>
              </el-table-column>
            </el-table>
            <div class="page-con">
              <div class="tips">
                最多添加50条快捷语
              </div>
              <div v-show="replyLength>num" class="right">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="num"
                        layout="prev, pager, next, jumper"
                        :total="replyLength">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <el-dialog v-model="show" class="fast-reply-dialog">
      <div class="el-loading-mask common-loading" v-show="dialogLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
      <h2 class="title">
        {{title}}
      </h2>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
      <div class="content">
          <el-form-item class="-form-item" label="" prop="textarea">
            <el-input
                    type="textarea"
                    :rows="7"
                    :maxlength=200
                    placeholder="请输入内容"
                    v-model="ruleForm.textarea">
            </el-input>
          </el-form-item>
        <div class="tips">{{ruleForm.textarea.length}}/200</div>
      </div>
      <div class="dialog-footer2">
        <el-button @click="show = false">取 消</el-button><el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </div>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import MyTabs from '../../../../../../components/common/tabs/MyTabs'
  import MyTabPane from '../../../../../../components/common/tabs/MyTabPane'
  import left from '../../../customer/info/public/left'
  import actions2 from './../../actions'
  import actions from './actions'
  import {toggleDom} from '../../../../../../components/admin/actions'
  export default{
    data(){
      return{
        activeName: 'chat_reply',
        replyId: '',
        id:'',
        num: 20,
        maxLength: 50,
        list: [],
        showList: [],
        show: false,
        doctorInfos: {},
        multipleSelection: [],
        loading: false,
        dialogLoading: false,
        textarea: '',
        isEditor: false,
        title: '添加快捷语',
        currentPage: 1,
        ruleForm: {
          textarea: '',
        },
        rules: {
          textarea: [
            { required: true, message: '请输入快捷语', trigger: 'blur' },
          ]
        },
        replyLength: 0,
        rowTipsShow: false,
        rowTipsVal: "",
      }
    },
    mounted () {
      this.init()
    },
    components: {
      MyTabs,
      MyTabPane,
      left,
    },
    methods: {
      ...actions2,
      ...actions,
      toggleDom,
    },
    watch: {
      'doctorInfos.infos' ({id}) {
        const _this = this
        if(id) {
          _this.id = id
          _this.search(_this)
        }
      },
      show (val) {
        if(!val) {
          this.$refs['ruleForm'].resetFields();
        }
      }
    },
    filters: {
      wordFilter (val) {
        return val.substring(0, 30) + '...'
      }
    }

  }
</script>