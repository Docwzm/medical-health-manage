<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "../../../../../styles/table.styl";
  @import "./index2.styl";
</style>
<template>
  <div class="admin-content-box admin-list admin-user-box">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
    <div class="admin-title">
      <h2>用户列表</h2>
      <div class="tool">
        <message-dialog :ids="multipleSelection"></message-dialog>
      </div>
    </div>

    <div class="search">
      <span class="age-label">岁</span>
      <el-input
              class="serach_input"
              placeholder="请输入姓名"
              v-model="name">
      </el-input><el-input
              class="serach_input serach_input2 serach_input3"
              :maxlength="3"
              v-model="ageStart">
      </el-input><span class="label">~</span><el-input
              class="serach_input serach_input2"
              :maxlength="3"
              v-model="ageEnd">
      </el-input><el-select class="search_select" v-model="sex" placeholder="性别" clearable>
        <el-option
                v-for="(item,index) in sexList"
                :key="index"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select><el-date-picker
            class="date-input"
            v-model="create_time"
            type="daterange"
            placeholder="创建时间">
    </el-date-picker><span class="search-more-btn" @click="searchShow = !searchShow" :class="{'search-more-btn-toggle':searchShow}">更多搜索</span><span class="search-btn" @click="search">&nbsp;</span>
    </div>
    <div class="search-hidden" :class="{'search-hidden-show':searchShow}">
      <el-select class="search_select" v-model="sickType" placeholder="疾病" clearable>
        <el-option
                v-for="(item,index) in sickTypeList"
                :key="index"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select><el-select class="search_select" v-model="doctorId" placeholder="所属医生" clearable>
        <el-option label="全部" value="0"></el-option>
        <el-option
                v-for="(item,index) in doctorList"
                :key="index"
                :label="item.name"
                :value="item.id">
        </el-option>
      </el-select><el-select class="search_select" v-model="patientSource" placeholder="来源渠道" clearable>
        <el-option
                v-for="(item,index) in sourceList"
                :key="index"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select><el-select class="search-select search-select2" v-model="selectOrganId" placeholder="请选择所属机构" clearable>
      <el-option label="全部" value="0"></el-option>
      <el-option
              v-for="(item,index) in organList"
              :key="index"
              :label="item.name"
              :value="item.id">
      </el-option>
    </el-select>
    </div>
    <div class="admin-list-select-con">
      <span class="admin-table-select-all" @click="selectionALl()"></span>
      <el-table
              :data="userList"
              ref="table"
              @sort-change="tableSort"
              stripe
              @cell-click="cellClick"
              @selection-change="handleSelectionChange"
              empty-text="暂无用户"
      >

        <el-table-column
                type="selection"
                width="50">
        </el-table-column>
        <el-table-column
                inline-template
                prop="name"
                label="姓名"
                sortable="custom"
                width="140"
        >
          <div>
            <div v-if="row.name">
              <div v-if="row.name.length > 4">
                <span style="color:#000" @mouseenter="toggleDom($event,row.name,true)" @mouseleave="toggleDom($event,row.name,false)">
                 <span class="icon" :class="{'has-icon':row.bindWechat}">{{row.name | nameFilter}}</span>
                </span>
              </div>

              <div v-if="row.name.length <= 4">
                <span class="icon" :class="{'has-icon':row.bindWechat}">{{row.name}}</span>
              </div>
            </div>

            <div v-if="!row.name"><span class="icon">--</span></div>
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                label="性别"
                width="80"
        >
          <div>
            {{row.sex | sexFilter}}
          </div>
        </el-table-column>
        <el-table-column
                prop="age"
                sortable="custom"
                label="年龄"
                width="100"
        >
        </el-table-column>
        <el-table-column
                inline-template
                label="疾病"
                width="140"
        >
          <div>{{row.sickType | sickTypeFilter}}</div>
        </el-table-column>
        <el-table-column
                prop="created"
                inline-template
                label="创建时间"
                sortable="custom"
                width="150"
        >
          <div>{{row | dateTimeFilter}}</div>
        </el-table-column>
        <el-table-column
                inline-template
                label="来源渠道"
                width="120"
        >
          <div>
            {{row.patientSource | patientSourceFilter}}
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                label="操作"
        >
          <div>
            <span class="go-download" @click="chooseDownload(row)" style="color: #40aaff;">下载报告</span> | <span class="go-allocation" style="color: #40aaff;" @click="goAllocation(row)">分配</span>
          </div>
        </el-table-column>
      </el-table>
    </div>

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

    <el-dialog title="下载报告" v-model="downDialog" size="tiny" class="download-dialog">
      <p class="tips">
        暂时只提供最近30天测量数据下载
      </p>
      <div class="choose-con">
        <div class="top">
          <el-radio class="radio" v-model="isDownloadAll" label="1">所有数据</el-radio>
          <el-radio class="radio" v-model="isDownloadAll" label="0" style="display:none">非所有数据</el-radio>
        </div>
        <div class="bottom">
          <el-checkbox-group v-model="chooseList">
            <el-checkbox label="血压"></el-checkbox>
            <el-checkbox label="血糖"></el-checkbox>
            <el-checkbox label="体重"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer2">
        <el-button @click="downDialog = false">取 消</el-button>
        <el-button type="primary" @click="goDownload()">下 载</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请选择需要和当前用户建立关系的医生" size="tiny" v-model="allocationDialog" class="allocation-dialog">
      <div style="position:relative">
        <div class="el-loading-mask common-loading" v-show="allocationLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <el-table
                :data="allowDoctorList"
                ref="table"
                stripe
                empty-text="暂无用户"
                @selection-change="handleSelectionChange2"
        >
          <el-table-column
                  type="selection"
                  width="50">
          </el-table-column>
          <el-table-column
                  inline-template
                  prop="name"
                  label="医生姓名"
                  width="140"
          >
            <div>{{row.name}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  prop="name"
                  label="所属机构"
                  width="140"
          >
            <div>{{organList[0].name}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  prop="departmentName"
                  label="所在科室"
                  width="140"
          >
            <div>{{row.departmentName}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  prop="title"
                  label="职称"
          >
            <div>{{row.title}}</div>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer2">
          <el-button @click="allocationDialog = false">取 消</el-button>
          <el-button type="primary" @click="allocationSubmit()">确 定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script type="text/babel">
  import actions from './actions'
  import getters from './getters'
  import MessageDialog from '../../../../home/views/customer/groupMessage/index.vue'
  import {
    sexFilter,
    sickTypeFilter,
    patientSourceFilter,
  } from '../../../../../filters/index'
  import {toggleDom} from '../../../../../components/admin/actions'
  import {
    savelocalStorage,
    getlocalStorage,
  } from '../../../../../api/common'
  import moment from 'moment'
  export default {
    data () {
      return {
        create_time: {},
        selectAll: false,
        adminInfo:{
          infos: {

          }
        },
        selectOrganId: "",
        organList: [],
        organId:'',
        organIds:[],
        orderBy: "",
        loading: false,
        searchShow: false,
        multipleSelection: [],
        currentPage: 1,
        name: "",
        sex: "",
        ageStart: "",
        ageEnd: "",
        doctorId: "",
        sickType: "",
        bp: "",
        patientSource: "",
        sexList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 0,
            label: '未知'
          },
          {
            value: 1,
            label: '男'
          },
          {
            value: 2,
            label: '女'
          }
        ],
        sickTypeList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 0,
            label: '无'
          },
          {
            value: 1,
            label: '其他',
          },
          {
            value: 2,
            label: '高血压',
          },
          {
            value: 3,
            label: '糖尿病',
          },
          {
            value: 4,
            label: '高血压及糖尿病',
          },
        ],
        bpList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 1,
            label: "低血压"
          },
          {
            value: 2,
            label: "正常血压"
          },
          {
            value: 3,
            label: "正常偏高"
          },
          {
            value: 4,
            label: "高血压病I级"
          },
          {
            value: 5,
            label: "高血压病II级"
          },
          {
            value: 6,
            label: "高血压病III级"
          },
        ],
        sourceList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 0,
            label: '医生app'
          },
          {
            value: 1,
            label: '健康管理平台'
          },
          {
            value: 2,
            label: '公众号'
          }
        ],
        rowTipsShow: false,
        rowTipsVal: "",
        downDialog: false,
        downloadInfo: {},
        isDownloadAll: '1',
        chooseList: [],
        allocationDialog: false,
        allowDoctorList: [],
        doctorIds: [],
        SelectPatientId: '',
        allocationLoading: false,
      }
    },
    methods: {
      ...actions,
      toggleDom,
    },
    created () {
      this.init()
    },
    computed: {
      ...getters,
    },
    components: {
      MessageDialog,
    },
    watch: {
      'adminInfo.infos' ({id}) {
        const _this = this
        if(id) {
          _this.organId = id
          savelocalStorage('admin-orginId',id)
         _this.search({organId: id}, _this)
        }
      },
      'isDownloadAll' (val) {
        if(val == '1') {
          this.chooseList = []
        }
      },
      'chooseList' (val){
        console.log(val)
        const _this = this
        if(val.length > 0) {
          _this.isDownloadAll = '0'
        } else {
          _this.isDownloadAll = '1'
        }
      }
    },
    filters: {
      sexFilter,
      sickTypeFilter,
      patientSourceFilter,
      nameFilter (val) {
        if(val.length > 4) {
          return val.substring(0,4) + "..."
        } else {
          return val
        }
      },
      dateTimeFilter ({organList}) {
        const id = getlocalStorage('admin-orginId')
        if(organList) {
          return moment(organList.find(({organId}) => organId == id).created).format('YYYY-MM-DD HH:mm')
        } else {
          return "--"
        }
      }
    },
  }
</script>