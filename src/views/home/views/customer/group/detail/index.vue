<style lang="stylus" scoped>
  @import "../../../../../../styles/layout.styl";
  @import './index.styl';
</style>
<style lang="stylus">
  @import "../../../../../../styles/table.styl";
  @import './index2.styl';
</style>
<template>
  <div class="admin-content-box admin-list admin-list2">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <div class="admin-title">
          <h2>{{groupInfo.name}}&nbsp;&nbsp;共{{groupInfo.patientNum}}人</h2>
          <span class="time">创建时间： {{groupInfo.created | dateTimeFilter}}</span>
          <span class="time">最新编辑时间： {{groupInfo.edited | dateTimeFilter}}</span>
          <div class="tool">
            <message-dialog :ids="patientIds"></message-dialog>
          </div>
        </div>

      <div class="admin-tool">
        <el-button @click="dialogVisible = true">添加用户</el-button><el-button @click="batchDeletePeople" style="margin-left:20px">移除用户</el-button>
      </div>

        <el-table
                :data="tableData"
                @selection-change="tableSelect"
                @sort-change="tableSort"
                @cell-click="cellClick"
                stripe>
          <el-table-column
                  type="selection"
                  width="55">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="姓名"
                  sortable="custom"
                  width="120"
          >
          </el-table-column>
          <el-table-column
                  inline-template
                  label="性别"
                  width="60">
            <div>{{row.sex | sexFilter}}</div>
          </el-table-column>
          <el-table-column
                  prop="age"
                  label="年龄"
                  sortable="custom"
                  width="80">
          </el-table-column>
          <el-table-column
                  inline-template
                  label="区域"
                  width="120">
            <div>{{row.province}}{{row.city}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  label="疾病"
                  width="130">
            <div>{{sickType | sickTypeFilter}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  label="所属组"
                  width="150">
            <div>
              <div v-if="row.groups">
                <div v-if="row.groups.length > 1">
                    <div style="color:#000" @mouseenter="toggleDom($event,row.groups,true)" @mouseleave="toggleDom($event,row.groups,false)">
                      <div class="group-icon">{{row.groups | groupFilter}}</div>
                    </div>
                </div>
                <div v-if="row.groups.length == 1">
                  {{row.groups  | groupFilter}}
                </div>
              </div>
              <div v-if="!row.groups" class="group_select_icon" @click="selectGroup(row,$event)"
              >
                暂无分组
              </div>
            </div>
          </el-table-column>
          <el-table-column
                  inline-template
                  label="来源渠道"
                  width="120">
            <div>{{row.patientSource | patientSourceFilter}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  :context="_self"
                  label="操作">
        <div>
          <span class="row-click" @click="groupDetail($index, row)">详情</span>
          <span class="row-click" @click="aloneDeleePeople($index, row)" style="color:#FF6464">移除</span>
        </div>
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

      <el-dialog title="请选择需要添加到该组的用户" v-model="dialogVisible" size="tiny" class="join-group-dialog" :modal=false>
        <div class="el-loading-mask common-loading" v-show="dialogLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <div>
          <div class="search">
            <el-input
                    class="serach-input"
                    placeholder="请输入姓名"
                    v-model="keyword">
            </el-input><el-input
                    class="age-input"
                    placeholder=""
                    @blur="AgeCheck"
                    v-model="minAge">
            </el-input><span class="age-label">~</span><el-input
                    class="age-input age-input2"
                    placeholder=""
                    @blur="AgeCheck"
                    v-model="maxAge">
            </el-input><el-select class="search-select" v-model="sex_val" placeholder="性别" clearable>
              <el-option
                      v-for="(item,index) in sex"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select><el-select class="search-select search-select2" v-model="group_val" placeholder="请选择组" clearable>
              <el-option v-for="(item,index) in allGroup" :key="index" :label="item.label" :value="item.value"></el-option>
              <el-option
                      v-for="(item,index) in group.list"
                      :key="index"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select><el-select class="search-select search-select3" v-model="source_val" placeholder="来源渠道" clearable>
              <el-option
                      v-for="(item,index) in source"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
            <span class="search-btn" @click="userDialogSearch"></span>
          </div>
          <el-table
                  :data="userTabeleData"
                  v-loading.body="userLoading"
                  @selection-change="userTableSelect"
                  @sort-change="userTableSort"
                  stripe
                >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    sortable="custom"
                    width="160"
            >
            </el-table-column>
            <el-table-column
                    inline-template
                    label="性别"
                    width="100">
              <div>{{row.sex | sexFilter}}</div>
            </el-table-column>
            <el-table-column
                    prop="age"
                    label="年龄"
                    sortable="custom"
                    width="100">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="所属组"
                    width="250"
            >
              <div>
                <div v-if="row.groups">
                  <div v-if="row.groups.length > 1">
                    <div style="color:#000" @mouseenter="toggleDom($event,row.groups,true)" @mouseleave="toggleDom($event,row.groups,false)">
                      <div class="group-icon">{{row.groups | groupFilter}}</div>
                    </div>
                  </div>
                  <div v-if="row.groups.length == 1">
                    {{row.groups  | groupFilter}}
                  </div>
                </div>
                <div v-if="!row.groups" class="group_select_icon" @click="selectGroup(row,$event)"
                >
                  暂无分组
                </div>
              </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="来源渠道"
            >
              <div>{{row.patientSource | patientSourceFilter}}</div>
            </el-table-column>
          </el-table>
          <div class="page-space"></div>
          <div class="page-con" v-show="userTotal>20">
            <el-pagination
                    @current-change="userHandleCurrentChange"
                    :current-page="userCurrentPage"
                    :page-size="20"
                    layout="prev, pager, next, jumper"
                    :total="userTotal">
            </el-pagination>
          </div>
          <div class="dialog-footer2">
            <el-button @click="dialogVisible = false">&nbsp;&nbsp;&nbsp;取 消&nbsp;&nbsp;&nbsp;</el-button>
            <el-button type="primary" @click="addUsersInGroup">&nbsp;&nbsp;&nbsp;添 加&nbsp;&nbsp;&nbsp;</el-button>
          </div>
        </div>
      </el-dialog>

    <div class="level_select" v-show="isShowLevel" :style="{left: level_x + 'px',top: level_y + 'px'}"
         @mouseleave="hideLevel">
      <div class="top" @click="hideLevel"></div>
      <div class="list">
        <span class="item" @click="selectLevelClick($event,3)">高</span>
        <span class="item" @click="selectLevelClick($event,2)">中</span>
        <span class="item" @click="selectLevelClick($event,1)">低</span>
      </div>
    </div>

    <div class="row-tips-con" v-show="rowTipsShow">{{rowTipsVal}}<span class="arrow"></span><span class="arrow arrow2"></span></div>
  </div>


</template>
<script type="text/babel">
  import router from '../../../../../../router'
  import MessageDialog from '../../groupMessage/index.vue'
  import {
    dateTimeFilter,
    sexFilter,
    sickTypeFilter,
    patientSourceFilter,
    levelFilter
  } from '../../../../../../filters/index'
  import actions from './actions'
  import {toggleDom} from '../../../../../../components/admin/actions'
  export default {
    data () {
      return {
        rowTipsVal: "",
        rowTipsShow: false,
        loading: false,
        isShowForm: false,
        isShowLog: true,
        groupMessageShow: false,
        dialogLoading: false,
        userLoading: false,
        isShowLevel: false,
        dialogVisible: false,
        userTabeleData: [],
        level_x: 0,
        level_y: 0,
        groupId: "",
        tableData: [],
        patientIds: [],
        patientId: [],
        patientIndex: 0,
        groupInfo: "",
        orderBy: -1,
        userOrderBy: -1,
        currentPage: 1,
        userCurrentPage: 1,
        total: 0,
        userTotal: 0,
        keyword: "",
        minAge: "",
        maxAge: "",
        sex_val: -1,
        has_border: false,
        sex: [
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
        source_val: -1,
        source: [
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
        group_val: -1,
        allGroup: [
          {
            label: '全部',
            value: -1
          }
        ],
        group: [],
        addGroupUserIds: [],
      }
    },
    mounted () {
      this.init()
    },
    components: {
      MessageDialog,
    },
    watch: {
      'dialogVisible' (val) {
        const _this = this
        if (val == true) {
          console.log("4444")
          _this.keyword = ""
          _this.minAge = ""
          _this.maxAge = ""
          _this.sex_val = ""
          _this.group_val = ""
          _this.source_val = ""
          _this.searchAddGroupPatients({}, _this)
        }
      }
    },
    methods: {
      ...actions,
      toggleDom,
    },
    filters: {
      dateTimeFilter,
      sexFilter,
      sickTypeFilter,
      patientSourceFilter,
      levelFilter,
      groupFilter (val) {
        if(val) {
          return val[0].name
        }
      }
    }
  }
</script>