<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "../../../../admin/views/user/list/index.styl";
</style>
<style lang="stylus">
  @import "../../../../../styles/table.styl";
  @import "../../../../../styles/user.styl";
  @import "./index.styl";
</style>
<template>
  <div class="admin-content-box admin-list admin-user-box">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
    <div class="admin-title">
      <h2>用户列表</h2>
      <div class="tool">
        <el-button @click="createUser" style="padding:7px 10px;width:88px;">创建用户</el-button>
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
    </el-input><el-select class="search_select search_select2" v-model="sex" placeholder="性别" clearable style="width:120px;">
      <el-option
              v-for="item in sexList"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select><el-select class="search_select" v-model="sickType" placeholder="疾病" clearable style="width:180px;">
      <el-option
              v-for="item in sickTypeList"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select><el-select class="search_select" v-model="bp" placeholder="血压等级" clearable style="width:196px;">
      <el-option
              v-for="item in bpList"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select><span class="search-btn" @click="search">&nbsp;</span>
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
                width="60"
        >
          <div>
            {{row.sex | sexFilter}}
          </div>
        </el-table-column>
        <el-table-column
                prop="age"
                sortable="custom"
                label="年龄"
                width="80"
        >
        </el-table-column>
        <el-table-column
                inline-template
                label="疾病"
                width="120"
        >
          <div>{{row.sickType | sickTypeFilter}}</div>
        </el-table-column>
        <el-table-column
                inline-template
                prop="bp"
                sortable="custom"
                label="血压"
                width="80"
        >
          <div>
            <div v-if="row.bloodpressureDto">{{row.bloodpressureDto.sp}}/{{row.bloodpressureDto.dp}}</div>
            <div v-if="!row.bloodpressureDto">--/--</div>
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                prop="bloodsugar"
                sortable="custom"
                label="血糖"
                width="80"

        >
          <div>
            <div v-if="row.bloodsugarDto">{{row.bloodsugarDto.bloodsugar}}</div>
            <div v-if="!row.bloodsugarDto">--</div>
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                prop="weight"
                sortable="custom"
                label="体重"
                width="80"

        >
          <div>
            <div v-if="row.weightDto">{{row.weightDto.weight}}</div>
            <div v-if="!row.weightDto">--</div>
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                prop="heartRate"
                sortable="custom"
                label="心率"
                width="80"

        >
          <div>
            <div v-if="row.heartRateDto">{{row.heartRateDto.heartRate}}</div>
            <div v-if="!row.heartRateDto">--</div>
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                prop="sleep"
                sortable="custom"
                label="睡眠"
                width="80"

        >
          <div>
            <div v-if="row.sleepDto">{{(row.sleepDto.sleep/60).toFixed(1) | sleepFilter}}h</div>
            <div v-if="!row.sleepDto">--</div>
          </div>
        </el-table-column>
        <!--<el-table-column-->
                <!--inline-template-->
                <!--prop="pulse"-->
                <!--sortable="custom"-->
                <!--label="脉搏"-->
                <!--width="100"-->
        <!--&gt;-->
          <!--<div>-->
            <!--<div v-if="row.bloodpressureDto">{{row.bloodpressureDto.hr}}</div>-->
            <!--<div v-if="!row.bloodpressureDto">&#45;&#45;</div>-->
          <!--</div>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--inline-template-->
                <!--label="来源渠道"-->
                <!--width="130"-->
        <!--&gt;-->
          <!--<div>-->
            <!--{{row.patientSource | patientSourceFilter}}-->
          <!--</div>-->
        <!--</el-table-column>-->
        <el-table-column
                inline-template
                label="操作"
                width="100"
        >
          <div><span @click="editorUser(row)" class="row-click">编辑</span><span class="row-click" @click="loadGroup(row)">分组</span></div>
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

    <el-dialog title="添加到以下分组" v-model="dialogVisible" size="tiny" class="add-group-dialog" :modal=false>
        <div class="check-list">
          <div class="el-loading-mask common-loading" v-show="loading2"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
          <div v-show="hasGroup">
            <el-checkbox-group v-model="groupIds" @change="handleCheckedGroupChange">
              <el-checkbox v-for="item in groupList" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>

            <p class="tips">添加后，您可以在用户分组中查看该用户的所属分组。</p>
            <div slot="footer" class="dialog-footer2">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addGroup">确 定</el-button>
            </div>
          </div>

          <div v-show="!hasGroup">
            <p class="tips tips2">暂无分组</p>
            <p class="tips tips3">您可以在<a href="javascript:;" @click="goGroup">用户分组</a>中创建分组后，对用户进行分组</p>
            <div slot="footer" class="dialog-footer2">
              <el-button @click="dialogVisible = false">确 定</el-button>
            </div>
          </div>
        </div>
    </el-dialog>
  </div>
</template>

<script  type="text/babel">
  import router from '../../../../../router'
  import MessageDialog from '../groupMessage/index.vue'
  import actions from './actions'
  import getters from './getters'
  import {sexFilter, sickTypeFilter, patientSourceFilter, levelFilter} from '../../../../../filters/index'
  import {toggleDom} from '../../../../../components/admin/actions'
  export default {
    data () {
      return {
        dialogVisible: false,
        loading2: true,
        hasGroup: false,
        groupList: [],
        doctorInfo: {
          infos: {}
        },
        doctorId: "",
        patientId: "",
        selectAll: false,
        loading: false,
        currentPage: 1,
        isShowGroup: false,
        isShowLevel: false,
        chooseLevelRow: '',
        chooseGroupRow: '',
        groupIds: [],
        orderBy: '',
        tableData: [],
        userList: [],
        total: 0,
        multipleSelection: [],
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
      }
    },
    mounted () {
      this.init()
    },
    computed: {
      ...getters,
    },
    components: {
      MessageDialog,
    },
    methods: {
      ...actions,
      toggleDom,
    },
    watch: {
      'doctorInfo.infos' ({accid}) {
        const _this = this
        _this.doctorId = accid
        if(accid) {
          _this.search({doctorId:this.doctorId}, _this)
        }
      },
      'dialogVisible' (val) {
        var dom = document.getElementsByTagName('body')[0]
        if(val) {
          dom.style.overflow = 'hidden'
        } else {
          dom.style.overflow = 'initial'
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
      sleepFilter (val) {
        var newVal = val.split('.')
        if(newVal[1] == 0) {
          return newVal[0]
        } else {
          return val
        }
      }
    }
  }
</script>
