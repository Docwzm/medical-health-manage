<style  lang="stylus" scoped>
  @import "../chart/temperature/list.styl";
</style>
<style lang="stylus">
  @import "./../chart/temperature/list2.styl";
</style>
<template>
  <div class="temperature-list">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
    <div class="search">
      <el-date-picker
              class="date-input"
              v-model="search_time"
              type="daterange"
              placeholder="请选择日期">
      </el-date-picker><el-select class="search-select" v-model="source" placeholder="请选择数据来源" clearable>
      <el-option
              v-for="item in sourceList"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select><a href="javascript:;" class="search-btn" @click="searchList"></a><el-button type="primary" class="add-btn" v-if="!isAdmin" @click="addTemperature">添加数据</el-button>
    </div>

    <div class="table-con admin-list">
      <el-table
          :data="tableData"
          stripe
      >
        <el-table-column
                label="测量时间"
                width="210"
                inline-template
                v-if="!isAdmin"
        >
          <div>{{row.measurementDate | dateTimeFilter2}}</div>
        </el-table-column>
        <el-table-column
                label="测量时间"
                width="230"
                inline-template
                v-if="isAdmin"
        >
          <div>{{row.measurementDate | dateTimeFilter2}}</div>
        </el-table-column>
        <el-table-column
                label="测量结果"
                width="180"
                inline-template
                v-if="!isAdmin"
        >
          <div>
            {{row.degree}}&deg;C
          </div>
        </el-table-column>
        <el-table-column
                label="测量结果"
                width="200"
                inline-template
                v-if="isAdmin"
        >
          <div>
            {{row.degree}}&deg;C
          </div>
        </el-table-column>
        <el-table-column
                label="数据来源"
                width="160"
                inline-template
                v-if="!isAdmin"
        >
          <div>
            {{row.source | dataSource}}
          </div>
        </el-table-column>
        <el-table-column
                label="数据来源"
                width="180"
                inline-template
                v-if="isAdmin"
        >
          <div>
            {{row.source | dataSource}}
          </div>
        </el-table-column>
        <el-table-column
                label="备注"
                inline-template
                v-if="isAdmin"
        >
          <div>
            <div v-if="row.remark">
              {{row.remark}}
            </div>
            <div v-if="!row.remark">

            </div>
          </div>
        </el-table-column>
        <el-table-column
                label="备注"
                inline-template
                v-if="!isAdmin"
        >
          <div>
            <div v-if="row.remark">
              {{row.remark}}
            </div>
            <div v-if="!row.remark">

            </div>
          </div>
        </el-table-column>
        <el-table-column
                label="操作"
                inline-template
                v-if="!isAdmin"
        >
          <div>
            <remarks :item="row" :patientId="Def.userId" :isbp="false" @input="set"></remarks>&nbsp;&nbsp;<span class="row-click" @click="deleteTemperature(row)" style="color:#FF6464">删除</span>
          </div>
        </el-table-column>
      </el-table>
      <div class="page-space"></div>
      <div class="page-con" v-show="total>5">
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="5"
                layout="prev, pager, next, jumper"
                :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="添加体温数据" v-model="showDialog" class="add-temperature-dialog">
      <div class="el-loading-mask common-loading" v-show="dialogLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
          <el-form-item class="-form-item" label="测量时间：" prop="time">
            <el-date-picker
                    v-model="ruleForm.time"
                    type="datetime"
                    class="el-form-time"
                    placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="-form-item" label="测量结果：" prop="degree">
            <el-input v-model="ruleForm.degree" class="el-from-input" :maxlength=4></el-input>
            <div class="tips">
              &deg;C
            </div>
          </el-form-item>
          <el-form-item class="-form-item" label="备注：" prop="remark">
            <el-input v-model="ruleForm.remark" class="el-from-input2" :maxlength=40></el-input>
          </el-form-item>
          <div class="dialog-footer2">
            <el-button @click="showDialog = false">取 消</el-button><el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
          </div>
        </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import actions from '../chart/temperature/temperature_actions'
  import remarks from '../../../../../../../components/common/popover/remarks.vue'
  import {MUTATION_NAME} from '../../mutations'
  import {
    dateTimeFilter2,
    dataSource,
  } from '../../../../../../../filters/index'
  export default{
    data () {
      var validateTime = (rule, value, callback) => {
       if(!value) {
         return callback(new Error('请选择测量时间'))
       } else {
         callback()
       }
      }
      var validateDegree = (rule, value, callback) => {
        if(isNaN(value) || parseFloat(value) < 34 || parseFloat(value) > 41.9 ) {
          return callback(new Error('请输入34.0-41.9范围的数字'))
        } else {
          if(value.indexOf('.') > -1) {
            if(value.split('.')[1].length == 0) {
              return callback(new Error('请输入34.0-41.9范围的数字'))
            }
          }
          callback()
        }
      }
      return {
        loading: false,
        total: 0,
        currentPage: 1,
        source: "",
        tableData:[],
        userId: "",
        search_time: [],
        sourceList: [
          {
            label:"全部",
            value: '-1'
          },
          {
            value: '0',
            label: '设备采集'
          },
          {
            value: '1',
            label: '手工添加'
          },
        ],
        isAdmin: true,
        showDialog: false,
        dialogLoading: false,
        ruleForm: {
          time: '',
          degree: '',
          remark: '',
        },
        rules: {
          time: [
            { validator: validateTime, trigger: 'blur' },
          ],
          degree: [
            { required: true, message: '请输入34.0-41.9范围的数字', trigger: 'blur' },
            { min: 2, max: 4, message: '请输入34.0-41.9范围的数字', trigger: 'blur' },
            { validator: validateDegree, trigger: 'blur' },
          ]
        }
      }
    },
    components: {
      remarks,
    },
    computed: {
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
    },
    watch: {
      Def ({userId}) {
        const _this  = this
        if(userId) {
          _this.userId = userId
          _this.searchList()
        }
      },
      showDialog (val) {
        if(!val) {
          this.$refs['ruleForm'].resetFields();
        }
      }
    },
    mounted(){
      const _this = this,
          {userId} = _this.Def
      if(userId) {
        _this.userId = userId
        _this.searchList()
      }
      _this.isAdminFn()
    },
    methods: {
      ...actions,
      set (v) {
        if (v) {
          this.searchList()
        }
      },
    },
    filters: {
      dateTimeFilter2,
      dataSource,
    }
  }
</script>