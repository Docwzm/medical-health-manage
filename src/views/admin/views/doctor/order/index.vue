<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "./index2.styl";
</style>
<template>
  <div>
    <div class="admin-top-tab">
      <span class="item" @click="goDetail">账号信息</span>
      <span class="item item_active">服务订单</span>
    </div>

    <div class="admin-order-layout">
      <div class="order-tj">
        <div class="item item1">
          <b>{{gains.orderTotal}}</b>
          <p>订单总量</p>
        </div>
        <!--<div class="item item2">-->
          <!--<b>&yen;{{gains.orderTotalAmount}}</b>-->
          <!--<p>订单总额</p>-->
        <!--</div>-->
        <div class="item item3">
          <b>&yen;{{gains.orderTotalAmount}}</b>
          <p>结算总额</p>
        </div>
        <div class="item item4">
          <b>&yen;{{gains.avaibleAmount}}</b>
          <p>账户余额</p>
        </div>
      </div>

      <div class="search">
        <el-input
                class="serach-input"
                placeholder="请输入姓名"
                :maxlength=20
                v-model="name">
        </el-input><el-input
                class="serach-input"
                placeholder="请输入手机号码"
                :maxlength=11
                v-model="mobile">
        </el-input><el-date-picker
                class="date-input"
                v-model="message_time"
                type="daterange"
                placeholder="请选择服务期限">
        </el-date-picker><el-select class="search-select" v-model="orderStatus" placeholder="请选择订单状态" clearable>
          <el-option
                  v-for="item in orderTypeList"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select><span class="search-btn" @click="search"></span>
      </div>
      <div style="position:relative">
        <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <el-table
                :data="list"
                @sort-change="tableSort"
                empty-text="暂无订单"
                stripe
        >
          <el-table-column
                  fixed
                  label="订单号"
                  width="170"
                  inline-template

          >
            <div>
              <div v-if="row.orderId.length > 16">
                <a @click="read(row)" href="javascript:;" style="color:#000"  @mouseenter="toggleDom($event,row.orderId,true)" @mouseleave="toggleDom($event,row.orderId,false)">
                  {{ row.orderId | orderIdFilter}}
                </a>
              </div>
              <div v-if="row.orderId.length <= 16">{{row.orderId}}</div>
            </div>
          </el-table-column>
          <el-table-column
                  fixed
                  prop="patientName"
                  label="用户姓名"
                  sortable="custom"
                  width="110"
                  inline-template
          >
            <div>
              <div v-if="row.patientName.length > 5">
                <a @click="read(row)" href="javascript:;" style="color:#000"  @mouseenter="toggleDom($event,row.patientName,true)" @mouseleave="toggleDom($event,row.patientName,false)">
                  {{ row.patientName | nameFilter}}
                </a>
              </div>
              <div v-if="row.patientName.length <= 5">{{row.patientName}}</div>
            </div>
          </el-table-column>
          <el-table-column
                  prop="patientMobile"
                  label="手机号码"
                  width="120"
          >
          </el-table-column>
          <el-table-column
                  prop="serviceName"
                  label="服务名称"
                  width="120"
          >
          </el-table-column>
          <el-table-column
                  inline-template
                  label="服务开始时间"
                  width="130"
          >
            <div>{{row.payDate | timeFilter}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  label="服务结束时间"
                  width="180"
          >
            <div>{{row.endDate | timeFilter}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  prop="total"
                  label="结算金额"
                  sortable="custom"
                  width="110"
          >
            <div>
              {{row.total | totalFilter}}
            </div>
          </el-table-column>
          <!--<el-table-column-->
                  <!--inline-template-->
                  <!--label="收益分成"-->
                  <!--width="90"-->
          <!--&gt;-->
            <!--<div>{{row.amount}}</div>-->
          <!--</el-table-column>-->
          <el-table-column
                  inline-template
                  label="订单状态"
                  width="110"
          >
            <div>{{row.orderProcessStatus | paymentStatusFilter}}</div>
          </el-table-column>
          <el-table-column
                  inline-template
                  prop="doctorTeamName"
                  label="所属团队"
                  width="150"
          >
            <div>
              <div v-if="row.doctorTeamName">{{row.doctorTeamName}}</div>
              <div v-if="!row.doctorTeamName">--</div>
            </div>
          </el-table-column>
        </el-table>

        <div class="page-space"></div>
        <div class="page-con"  v-show="total>20">
          <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="prev, pager, next, jumper"
                  :total="total">
          </el-pagination>
        </div>
      </div>

    </div>
    <div class="row-tips-con" v-show="rowTipsShow">{{rowTipsVal}}<span class="arrow"></span><span class="arrow arrow2"></span></div>
  </div>
</template>
<script type="text/babel">
  import actions from './actions'
  import getters from './getters'
  import router from '../../../../../router'
  import filters from './filters'
  import {toggleDom} from '../../../../../components/admin/actions'
  import {
    dateTimeFilter2,
  } from '../../../../../filters/index'
  export default {
    data () {
      return {
        currentPage: 1,
        loading: true,
        doctorId: "",
        name: "",
        mobile: "",
        message_time: [],
        orderStatus: "",
        orderTypeList: [
          {
            label: "全部",
            value: 0
          },
          {
            label: "支付成功",
            value: 2
          },
          {
            label: "支付失败",
            value: 3
          },
          {
            label: "已退款",
            value: 5
          },
        ],
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
      this.init(router.currentRoute.params)
    },
    filters: {
        ...filters,
      dateTimeFilter2,
    }
  }
</script>
