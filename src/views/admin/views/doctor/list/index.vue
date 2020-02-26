<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "../../../../../styles/table.styl";
</style>
<template>
    <div class="admin-content-box admin-list">
      <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
      <div class="admin-title">
        <h2>医生列表</h2>
        <div class="tool">
          <el-button @click="create" class="create-btn">新建医生</el-button>
        </div>
      </div>
      <div class="search">
        <el-input
                class="serach-input"
                placeholder="请输入姓名"
                :maxlength=10
                v-model="name">
        </el-input><el-input
                class="serach-input"
                placeholder="请输入手机号码"
                :maxlength=11
                v-model="mobile">
        </el-input><el-select class="search-select" v-model="titleId" placeholder="请选择职称" clearable>
          <el-option label="全部" value="0"></el-option>
          <el-option
                  v-for="(item,index) in titleList"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select><el-select class="search-select" v-model="departmentId" placeholder="请选择科室" clearable>
          <el-option label="全部" value="0"></el-option>
          <el-option
                  v-for="(item,index) in departmentList"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select><el-select class="search-select search-select2" v-model="organId" placeholder="请选择所属机构" clearable>
          <el-option label="全部" value="0"></el-option>
          <el-option
                  v-for="(item,index) in organList"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select><span class="search-btn" @click="search">&nbsp;</span>
      </div>

      <el-table class="table"
          :data="doctorList"
          @sort-change="tableSort"
          @cell-click="cellClick"
          stripe
      >
        <el-table-column
                inline-template
                label="姓名"
                width="120"
                sortable="custom"
                prop="name"
        >
          <div>
            <div v-if="row.name.length > 5">
                <a @click="read(row)" href="javascript:;" style="color:#000" @mouseenter="toggleDom($event,row.name,true)" @mouseleave="toggleDom($event,row.name,false)">
                  {{ row.name | nameFilter}}
                </a>
            </div>

            <div v-if="row.name.length <= 5">
              {{ row.name}}
            </div>
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                width="120"
                label="职称"
        >
          <div>
            <div v-if="row.title.length > 6">
                <div @mouseenter="toggleDom($event,row.title,true)" @mouseleave="toggleDom($event,row.title,false)">
                  {{ row.title | titleFilter}}
                </div>
            </div>
            <div v-if="row.title.length <= 6">
              {{ row.title}}
            </div>

          </div>
        </el-table-column>
        <el-table-column
                inline-template
                width="120"
                label="科室">
            <div>
              <div v-if="row.departmentName.length > 5">
                  <div @mouseenter="toggleDom($event,row.departmentName,true)" @mouseleave="toggleDom($event,row.departmentName,false)">
                    {{ row.departmentName | nameFilter}}
                  </div>
              </div>

              <div v-if="row.departmentName.length <= 5">
                {{ row.departmentName}}
              </div>
            </div>
        </el-table-column>
        <el-table-column
                inline-template
                width="200"
                label="所属机构">
          <div>
            <div v-if="row.hospitalName">
              <div v-if="row.hospitalName.length > 12">
                <div  @mouseenter="toggleDom($event,row.hospitalName,true)" @mouseleave="toggleDom($event,row.hospitalName,false)">
                  {{ row.hospitalName | organFilter}}
                </div>
              </div>

              <div v-if="row.hospitalName.length <= 12">
                {{ row.hospitalName}}
              </div>
            </div>

            <div v-if="!row.hospitalName">暂无</div>
          </div>
        </el-table-column>
        <el-table-column
                prop="mobile"
                label="手机号码"
                width="140"
        >
        </el-table-column>
        <el-table-column
                prop="userCount"
                label="用户总数"
                width="120"
        >
        </el-table-column>
        <!--<el-table-column-->
                <!--prop="totalAmount"-->
                <!--label="收益总额"-->
                <!--sortable="custom"-->
                <!--width="120"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column
                inline-template
                :context="_self"
                label="操作">
          <div><span @click="read(row)" class="row-click">查看</span><span @click="editor(row)" class="row-click">编辑</span></div>
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
    </div>
</template>

<script type="text/babel">
  import actions from './actions'
  import getters from './getters'
  import filters from './filters'
  import {toggleDom} from '../../../../../components/admin/actions'
  export default {
    data () {
      return {
        loading: false,
        currentPage: 1,
        name: "",
        mobile: "",
        titleId: "",
        departmentId: "",
        organId: "",
        titleList: [],
        departmentList: [],
        organList: [],
        loading: false,
        sort: "",
        order: "",
        rowTipsShow: false,
        rowTipsVal: "",
      }
    },
    computed: {
      ...getters,
    },
    methods: {
        ...actions,
      toggleDom,
    },
    created () {
      this.init()
    },
    components: {
    },
    filters: {
        ...filters,
    }
  }
</script>