<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "../../../../../styles/table.styl";
  @import "./index2.styl";
</style>
<template>
  <div class="admin-content-box admin-list admin-list2 admin-group-box">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
    <div class="admin-title">
      <h2>用户分组列表</h2>
      <div class="tool">
        <el-button @click="editorGroup('','',true)" style="padding:7px 1px;width:88px">新增组</el-button>
        <el-button @click="batchDeleteGroup" style="padding:7px 1px;width:88px">删除组</el-button>
      </div>
    </div>


        <div class="search">
          <el-input
                  class="serach-input"
                  placeholder="请输入关键字"
                  v-model="keyword">
          </el-input><el-date-picker
                  class="date-input"
                  v-model="create_time"
                  type="daterange"
                  placeholder="请选择创建时间">
          </el-date-picker><el-date-picker
                  class="date-input"
                  v-model="editor_time"
                  type="daterange"
                  placeholder="请选择最新编辑时间">
          </el-date-picker><a href="javascript:;" class="search-btn" @click="searchList"></a>
        </div>

        <el-table
                :data="tableData"
                @selection-change="tableSelect"
                @sort-change="tableSort"
                @cell-click="cellClick"
                stripe
        >
          <el-table-column
                  type="selection"
                  width="50">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="分组名称"
                  width="150"
          >
          </el-table-column>
          <el-table-column
                  prop="patientNum"
                  label="组人数"
                  width="80">
          </el-table-column>
          <el-table-column
                  inline-template
                  label="创建时间"
                  prop="created"
                  sortable="custom"
                  width="175"
          >
            <div>{{row.created | dateTimeFilter}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  label="最新编辑时间"
                  prop="edited"
                  sortable="custom"
                  width="175"
          >
            <div>{{row.edited | dateTimeFilter}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  prop="remark"
                  label="备注"
                  width="170"
          >
            <div>
              <div v-if="row.remark.length > 10">
                <span style="color:#000" @mouseenter="toggleDom($event,row.remark,true)" @mouseleave="toggleDom($event,row.remark,false)">
                {{row.remark | remarkFilter}}
                </span>
              </div>
              <div v-if="row.remark.length <= 10">
                {{row.remark}}
              </div>
            </div>
          </el-table-column>
          <el-table-column
                  inline-template
                  :context="_self"
                  label="操作">
        <span>
          <span class="row-click" @click="groupDetail($index, row)">详情</span><span class="row-click" @click="editorGroup($index, row, false)">编辑</span><span class="row-click operation_delete" @click="aloneDeleeGroup(row)" style="color:#FF6464">删除</span>
        </span>
          </el-table-column>
        </el-table>
        <div class="page-space"></div>
        <div class="page-con" v-show="total>20">
          <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="prev, pager, next, jumper"
                  :total="total">
          </el-pagination>
        </div>

    <div class="row-tips-con" v-show="rowTipsShow">{{rowTipsVal}}<span class="arrow"></span><span class="arrow arrow2"></span></div>

      <el-dialog v-model="dialogVisible" size="tiny" class="editor-group-dialog" :modal=false>
        <div class="el-loading-mask common-loading" v-show="dialogLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <span slot="title">{{title}}</span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="分组名称：" prop="name">
            <el-input v-model="ruleForm.name" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="分组描述：" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark" :maxlength="20" :rows="2"></el-input>
          </el-form-item>
          <div class="dialog-footer2">
            <el-button @click="dialogVisible = false">&nbsp;&nbsp;&nbsp;取 消&nbsp;&nbsp;&nbsp;</el-button>
            <el-button type="primary" @click="saveGroup('ruleForm',true)" v-if="isCreate">&nbsp;&nbsp;&nbsp;创 建&nbsp;&nbsp;&nbsp;</el-button>
            <el-button type="primary" @click="saveGroup('ruleForm',false)" v-if="!isCreate">&nbsp;&nbsp;&nbsp;保 存&nbsp;&nbsp;&nbsp;</el-button>
          </div>
        </el-form>
      </el-dialog>

  </div>
</template>

<script>
  import router from '../../../../../router'
  import actions from './actions'
  import {dateTimeFilter} from '../../../../../filters/index'
  import {toggleDom} from '../../../../../components/admin/actions'
  export default{
    data () {
      return {
        title:"创建分组",
        ruleForm: {
          name: "",
          remark: "",
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
          remark: [

          ]
        },
        isCreate: true,
        loading: false,
        groupNameError: false,
        dialogLoading: false,
        dialogVisible: false,
        currentPage: 1,
        groupNameLength: 0,
        groupRemarkLength: 0,
        groupName: "",
        groupRemark: "",
        groupId: "",
        orderBy: "",
        total: 0,
        keyword: '',
        create_time: '',
        createTimeStr: '',
        createTimeEnd: '',
        editor_time: '',
        editorTimeStr: '',
        editorTimeEnd: '',
        tableData: [],
        groupSelect: [],
        rowTipsVal: "",
        rowTipsShow: false,
      }
    },
    mounted () {
      this.init()
    },
    components: {
    },
    methods: {
      ...actions,
      toggleDom,
    },
    watch: {
      'create_time' (val) {
        this.watchCreateTime(this, val)
      },
      'editor_time' (val) {
        this.watchEditorTime(this, val)
      },
      'dialogVisible' (val) {
        const _this = this
      if (!val) {
          _this.ruleForm = {
            name: "",
            remark: "",
          }
          _this.$refs['ruleForm'].resetFields();
        }
      }
    },
    filters: {
      dateTimeFilter,
      remarkFilter (val) {
        if(val.length > 10) {
          return val.substring(0,10) + "..."
        } else {
          return val
        }
      }
    }
  }
</script>
