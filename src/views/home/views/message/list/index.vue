<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl"
  @import "index.styl"
</style>
<style lang="stylus">
  @import "whole.styl"
</style>

<template>
  <div class="doctor-message-list">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
      <el-tabs v-model="messageListType">
        <!--对话消息列表-->
        <el-tab-pane name="1">
          <!--标签名-->
          <div slot="label" class="doctor-message-tab">
            <el-badge :is-dot="talkNewCount > 0" class="item">
              <span>对话消息</span>
            </el-badge>
          </div>
          <!--主体-->
          <div class="doctor-message-pane-content">
            <div class="el-loading-mask common-loading" v-show="greneralMessage.loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
              <!--搜索-->
              <div class="search">
                <el-input v-model.trim="greneralMessage.searchWord" class="search-input" placeholder="请输入姓名" :maxlength="20"></el-input>
                <el-date-picker v-model="greneralMessage.searchDate" class="date-input" type="daterange" placeholder="请选择时间范围"></el-date-picker>
                <!--<el-button type="primary" icon="search" @click="searchGreneralMessage"></el-button>-->
                <a href="javascript:;" class="search-btn" @click="searchGreneralMessage"></a>
              </div>
              <!--操作-->
              <div class="search-handle">
                <div class="handle-left">
                  <span :class="{on: greneralMessage.sortType == 0 }" @click="greneralSortChange(0)">时间降序</span>
                  <span class="sep">|</span>
                  <span :class="{on: greneralMessage.sortType == 1 }" @click="greneralSortChange(1)">未读置顶</span>
                </div>
                <div class="handle-right">
                  <span class="on" @click="clickIgnoreAllGreneralMessage">全部忽略</span>
                </div>
              </div>
              <!--暂无数据层-->
              <div class="search-result-nodata-layer" v-if="!talkList || talkList.length < 1">
                <span>暂无数据</span>
              </div>
              <!--搜索结果列表-->
              <ul class="search-result" v-if="talkList && talkList.length > 0">
                  <li class="search-item" v-for="(item,index) in talkList" :key="index">
                    <img class="search-item-portrait" :class="{'click-span':item.unreadCount < 1}" :src="item.patientHeadImgUrl || '../../../../../../static/doctor/icon-messagebox-head.svg'" @click="showGreneralCustomerInfoDetail(item)">
                    <div class="search-item-message" :class="{'click-span':item.unreadCount < 1}" @click="showGreneralCustomerInfoDetail(item)">
                        <div>
                          <span>{{ item.patientName }}</span>
                        </div>
                        <div  :class="{'gray-span': item.unreadCount < 1}">
                          <span>{{ item | greneralMessageContent }}</span>
                        </div>
                    </div>
                    <div class="search-item-handle">
                        <div>
                          <span class="gray-span">{{ item | greneralDateFilter }}</span>
                        </div>
                        <div v-if="item.unreadCount < 1">
                          <span class="gray-span">{{ item.unRead == 1 ?'已忽略':'已回复'}}</span>
                          <!--<span class="gray-span">已处理</span>-->
                        </div>
                        <div v-else>
                          <span class="click-span" @click="ignoreGreneralMessage(item)">忽略</span>
                          <span class="on-span click-span" @click="replyGreneralMessage(item)">回复</span>
                        </div>
                    </div>
                  </li>
              </ul>
              <!--分页-->
              <el-pagination
                  v-if="talkTotal > 20"
                  class="doctor-message-pane-pagination"
                  @current-change="handleGreneralCurrentChange"
                  :current-page="greneralMessage.currentPage"
                  :page-size="20"
                  layout="prev, pager, next, jumper"
                  :total="talkTotal">
              </el-pagination>
          </div>
        </el-tab-pane>

        <!--数据异常消息列表-->
        <el-tab-pane name="2">
          <!--标签名-->
          <div slot="label" class="doctor-message-tab">
            <el-badge :is-dot="abnormalNewCount > 0"  class="item">
              <span>数据异常</span>
            </el-badge>
          </div>
          <!--主体-->
          <div class="doctor-message-pane-content">
              <div class="el-loading-mask common-loading" v-show="exceptionMessage.loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
              <!--搜索-->
              <div class="search">
                <el-input v-model.trim="exceptionMessage.searchWord" class="search-input" placeholder="请输入姓名" :maxlength="20"></el-input>
                <el-date-picker v-model="exceptionMessage.searchDate" class="date-input" type="daterange" placeholder="请选择时间范围"></el-date-picker>
                <!--<el-button type="primary" icon="search" @click="searchExceptionMessage"></el-button>-->
                <a href="javascript:;" class="search-btn" @click="searchExceptionMessage"></a>
              </div>
              <!--操作-->
              <div class="search-handle">
                <div class="handle-left">
                  <span :class="{on: exceptionMessage.sortType == 0 }" @click="exceptionSortChange(0)">时间降序</span>
                  <span class="sep">|</span>
                  <span :class="{on: exceptionMessage.sortType == 1 }" @click="exceptionSortChange(1)">未读置顶</span>
                </div>
                <div class="handle-right">
                  <span class="on" @click="clickIgnoreAllExceptionMessage">全部忽略</span>
                </div>
              </div>
              <!--暂无数据层-->
              <div class="search-result-nodata-layer" v-if="!abnormalList || abnormalList.length < 1">
                <span>暂无数据</span>
              </div>
              <!--搜索结果列表-->
              <ul class="search-result"  v-if="abnormalList && abnormalList.length > 0">
                <li class="search-item search-item-pointer" v-for="(item,index) in abnormalList" :key="index">
                  <img class="search-item-portrait click-span" :src="item.headImgUrl || '../../../../../../static/doctor/icon-messagebox-head.svg'"  @click="showExceptionCustomerInfoDetail($event,item)">
                  <div class="search-item-message click-span" @click="showExceptionCustomerInfoDetail($event,item)">
                    <div>
                      <span>{{ item.patientName }}</span>
                    </div>
                    <div :class="{'gray-span': item.handlerStatus != 1}">
                      <span>{{ item.detectionType | detectionTypeFilter }}数据异常</span>
                      <span>{{ detectionTypeValueFilter(item) }}</span>
                      <span v-if="item.unRead > 0">{{ item.unRead }}条新异常数据</span>
                      <span class="on-span" @click="showExceptionItemDetail($event,item)">查看更多详情</span>
                    </div>
                  </div>
                  <div class="search-item-handle">
                    <div>
                      <span class="gray-span">{{ item.measurementTime | dateTimeFilter }}</span>
                    </div>
                    <div v-if="item.handlerStatus != 1">
                      <span class="gray-span">{{ item.handlerStatus | exceptionItemStateFilter }}</span>
                    </div>
                    <div v-else>
                      <span class="click-span" @click="ignoreExceptionMessage(item)">忽略</span>
                      <span class="on-span click-span" @click="replayExceptionMessage(item)">对话</span>
                    </div>
                  </div>
                </li>
              </ul>
              <!--分页-->
              <el-pagination
                v-if="abnormalTotal > 20"
                class="doctor-message-pane-pagination"
                @current-change="handleExceptionCurrentChange"
                :current-page="exceptionMessage.currentPage"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="abnormalTotal">
              </el-pagination>
          </div>
        </el-tab-pane>

        <!--关联请求消息列表-->
        <el-tab-pane name="3">
          <!--标签名-->
          <div slot="label" class="doctor-message-tab">
            <el-badge :is-dot="applyNewCount > 0"  class="item">
              <span>关联请求</span>
            </el-badge>
          </div>
          <!--主体-->
          <div class="doctor-message-pane-content">
              <div class="el-loading-mask common-loading" v-show="applyMessage.loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
              <!--搜索-->
              <div class="search">
                <el-input v-model.trim="applyMessage.searchWord" class="search-input" placeholder="请输入姓名" :maxlength="20"></el-input>
                <el-date-picker v-model="applyMessage.searchDate" class="date-input" type="daterange" placeholder="请选择时间范围"></el-date-picker>
                <!--<el-button type="primary" icon="search" @click="searchApplyMessage"></el-button>-->
                <a href="javascript:;" class="search-btn" @click="searchApplyMessage"></a>
              </div>
              <!--操作-->
              <div class="search-handle">
                <div class="handle-left">
                  <span :class="{on: applyMessage.sortType == 0 }" @click="applySortChange(0)">时间降序</span>
                  <span class="sep">|</span>
                  <span :class="{on: applyMessage.sortType == 1 }" @click="applySortChange(1)">未读置顶</span>
                </div>
                <div class="handle-right">
                  <span class="on" @click="clickAgreeAllApplyMessage">全部同意</span>
                </div>
              </div>
              <!--暂无数据层-->
              <div class="search-result-nodata-layer" v-if="!applyList || applyList.length < 1">
                <span>暂无数据</span>
              </div>
              <!--搜索结果列表-->
              <ul class="search-result" v-if="applyList && applyList.length > 0">
                <li class="search-item" v-for="(item,index) in applyList" :key="index">
                  <img class="search-item-portrait" :class="{'click-span':item.agree > 0}" @click="showApplyCustomerInfoDetail(item)" :src="item.headImgurl || '../../../../../../static/doctor/icon-messagebox-head.svg'">
                  <div class="search-item-message" :class="{'click-span':item.agree > 0}" @click="showApplyCustomerInfoDetail(item)">
                    <div>
                      <span>{{ item.name }}</span>
                      <span>{{ item.sex | sexFilter }}</span>
                      <span>{{ item.birthday | dateFilter }}</span>
                      <span>{{ item.phone }}</span>
                    </div>
                    <div>
                      <!--<span :class="{'gray-span': item.state == 1 || item.state == 2}">{{ item.message }}</span>-->
                      <span :class="{'gray-span': item.agree > 0}">申请加入健康管理平台，成为您的患者，请审批</span>
                    </div>
                  </div>
                  <div class="search-item-handle">
                    <div>
                      <span class="gray-span">{{ item.updated | dateTimeFilter }}</span>
                    </div>
                    <div v-if="item.agree > 0">
                      <span class="gray-span">{{ item.agree == 1 ?'已同意':'已拒绝'}}</span>
                    </div>
                    <div v-else>
                      <span class="click-span" @click="refuseApplyMessage(item.id)">拒绝</span>
                      <span class="on-span click-span" @click="agreeApplyMessage(item.id)">同意</span>
                    </div>
                  </div>
                </li>
              </ul>
              <!--分页-->
              <el-pagination
                v-if="applyTotal > 20"
                class="doctor-message-pane-pagination"
                @current-change="handleApplyCurrentChange"
                :current-page="applyMessage.currentPage"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="applyTotal">
              </el-pagination>
          </div>
        </el-tab-pane>

        <!--消息发送列表-->
        <el-tab-pane name="0">
          <!--标签名-->
          <div slot="label" class="doctor-message-tab last-message-tab">
            <span>消息发送</span>
          </div>
          <!--主体-->
          <div class="doctor-message-pane-content">
            <div class="el-loading-mask common-loading" v-show="sendedMessage.loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
              <!--搜索-->
              <div class="search">
                <el-input v-model.trim="sendedMessage.searchWord" class="search-input" placeholder="请输入姓名" :maxlength="20"></el-input>
                <el-date-picker v-model="sendedMessage.searchDate" class="date-input" type="daterange" placeholder="请选择时间范围"></el-date-picker>
                <el-select v-model="sendedMessage.searchState" clearable class="search-select" placeholder="请选择发送状态">
                  <el-option v-for="(item,index) in sendedMessage.stateItems" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <!--<el-button type="primary" icon="search" @click="searchSendedMessage"></el-button>-->
                <a href="javascript:;" class="search-btn" @click="searchSendedMessage"></a>
              </div>
              <!--搜索结果列表-->
              <el-table
                :data="sendedList"
                stripe
                @sort-change="sendedSortChange"
                style="width:100%"
                @row-click="showSendedDetail"
                >
                <el-table-column
                  prop="receiverName"
                  label="发送对象"
                  width="350"
                  :formatter="sendedRowNameFormatter"
                >
                </el-table-column>
                <el-table-column
                  prop="content"
                  label="发送内容"
                  width="200"
                  :formatter="sendedRowContentFormatter"
                >
                </el-table-column>
                <el-table-column
                  prop="sendStatus"
                  label="发送状态"
                  width="200"
                  :formatter="sendedRowStatusFormatter"
                  >
                </el-table-column>
                <el-table-column
                  prop="sendTime"
                  label="发送时间"
                  sortable="custom"
                  :formatter="sendedRowDateFormatter"
                  >
                </el-table-column>
              </el-table>
              <!--分页-->
              <el-pagination
                v-if="sendedTotal > 20"
                class="doctor-message-pane-pagination"
                @current-change="handleSendedCurrentChange"
                :current-page="sendedMessage.currentPage"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="sendedTotal">
              </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

    <!--消息发送记录详情-->
    <el-dialog title="消息记录" v-model="sendedMessage.dialogVisible" size="tiny" class="message-detail-dialog" :modal=false>
      <div style="position: relative">
        <div class="el-loading-mask common-loading" v-show="sendedMessage.dialogLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <div class="list">
          <div class="item">
            <span class="label">发送时间：</span>
            <div class="detail">{{sendedMessage.messageDetailInfos.sendTime | dateTimeFilter}}</div>
          </div>
          <div class="item" v-if="sendedMessage.messageDetailInfos && sendedMessage.messageDetailInfos.sendingReceivers && sendedMessage.messageDetailInfos.sendingReceivers != ''">
            <span class="label">发送中：</span>
            <div class="detail">
              <span><span v-for="(item,index) in sendedMessage.messageDetailInfos.sendingReceivers" :key="index">{{item.receiverName}}，</span></span>
            </div>
          </div>
          <div class="item" v-if="sendedMessage.messageDetailInfos && sendedMessage.messageDetailInfos.succcessReceivers && sendedMessage.messageDetailInfos.succcessReceivers != ''">
            <span class="label">发送成功：</span>
            <div class="detail">
              <span ><span v-for="(item,index) in sendedMessage.messageDetailInfos.succcessReceivers" :key="index">{{item.receiverName}}，</span></span>
            </div>
          </div>
          <div class="item" v-if="sendedMessage.messageDetailInfos && sendedMessage.messageDetailInfos.failReceivers && sendedMessage.messageDetailInfos.failReceivers != ''">
            <span class="label">发送失败：</span>
            <div class="detail">
              <span ><span v-for="(item,index) in sendedMessage.messageDetailInfos.failReceivers" :key="index">{{item.receiverName}}，</span></span>
            </div>
          </div>
          <div class="item">
            <span class="label">发送内容：</span>
            <div class="detail">
              {{sendedMessage.messageDetailInfos.conent}}
            </div>
          </div>
        </div>
        <div class="dialog-footer2">
          <el-button @click="sendedMessage.dialogVisible = false">&nbsp;&nbsp;&nbsp;返 回&nbsp;&nbsp;&nbsp;</el-button>
        </div>
      </div>
    </el-dialog>

    <!--异常数据消息详情-->
    <el-dialog title="异常数据详情" class="message-exception-detail-dialog" v-model="exceptionMessage.itemDetails.hasItemDetails">
      <div style="position: relative">
        <div class="el-loading-mask common-loading" v-show="exceptionMessage.itemDetails.loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <el-table :data="exceptionMessage.itemDetails.data">
          <el-table-column
            inline-template
            align="center"
            header-align="center"
            label="异常类型"
            width="120">
            <span>{{ row.detectionType | detectionTypeFilter }}</span>
          </el-table-column>
          <el-table-column
            inline-template
            align="center"
            header-align="center"
            label="异常数据">
            <span>{{ detectionTypeValueFilter(row) }}</span>
          </el-table-column>
          <el-table-column
            inline-template
            align="center"
            header-align="center"
            label="日期"
            width="200"
            >
            <span>{{ row.measurementTime | dateTimeFilter }}</span>
          </el-table-column>
          <el-table-column
            inline-template
            align="center"
            header-align="center"
            label="状态"
            width="80">
            <span>{{ row.handlerStatus | exceptionItemStateFilter }}</span>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination v-if="exceptionMessage.itemDetails.total > 5"
          class="doctor-message-dialog-pagination"
          @current-change="handleExceptionItemCurrentChange"
          :current-page="exceptionMessage.itemDetails.currentPage"
          :page-size="5"
          layout="prev, pager, next, jumper"
          :total="exceptionMessage.itemDetails.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
  import moment from 'moment'

  import {dateTimeFilter,dateFilter,sexFilter} from '../../../../../filters/index'

  import getters from "./getters"

  import greneralActions from "./greneralActions"
  import exceptionActions from "./exceptionActions"
  import applyActions from "./applyActions"
  import sendedActions from "./sendedActions"

  export default {
    data() {
          return {
            loading: true,
            messageListType : null,
            doctorId:null,

//            对话消息
            greneralMessage : {
              searchWord : null,
              searchDate : null,
              currentPage : 1,
              sortType : 0,
              loading : false,
              queryParam: {
                startTime:null,
                endTime:null,
                searchKey:null
              },
              resData: []
            },
//            数据异常
            exceptionMessage : {
              searchWord : null,
              searchDate : null,
              currentPage : 1,
              sortType : 0,
              loading : false,
              itemDetails:{
                loading:false,
                currentPage: 1,
                hasItemDetails: false,
                data: [],
                total:1,
                patientId:null,
              },
              queryParam: {
                startTime:null,
                endTime:null,
                patientName:null,
              }
            },
//            关联请求
            applyMessage : {
              searchWord : null,
              searchDate : null,
              currentPage : 1,
              sortType : 0,
              loading : false,
              queryParam: {
                startTime:null,
                endTime:null,
                searchKey:null,
              }
            },
//            发送消息
            sendedMessage : {
              searchWord:null,
              searchDate : null,
              searchState : null,
              currentPage : 1,
              loading : false,
              dialogLoading: false,
              dialogVisible: false,
              messageDetailInfos: {},
              stateItems : [
                {
                    id:0,
                    name : "发送中"
                },
                {
                  id:1,
                  name : "发送成功"
                },
                {
                  id:3,
                  name : "发送失败"
                },
                {
                  id:2,
                  name : "部分发送失败"
                }
              ],
              queryParam: {
                startTime:null,
                endTime:null,
                receiverName:null,
                sendStatus:null
              }
            }
          }
      },
      watch: {
        "$route": function (to, from) {
            const _this = this
            _this.messageListType = to.params["type"]
        },
        "doctorInfo":function (val) {
          const _this = this
          _this.doctorId = val.accid
        },
        "doctorId": function (val) {
          const _this = this
          if(val) {
            _this.messageListType = _this.$route.params["type"]
            _this.loading = false
          }
        },
        "messageListType": function (val) {
            const _this = this
            if(val == "0") {//消息发送
              _this.sendedMessage.searchDate = null
              _this.sendedMessage.searchWord = null
              _this.sendedMessage.searchState = null
              _this.searchSendedMessage(_this.$store)
            } else if(val == "1") {//对话消息
//              _this.clearNewGreneralMessage(_this.$store)
              _this.greneralMessage.searchDate = null
              _this.greneralMessage.searchWord = null
              _this.searchGreneralMessage(_this.$store)
            } else if(val == "2") {//数据异常
//              _this.clearNewExceptionMessage(_this.$store)
              _this.exceptionMessage.searchDate = null
              _this.exceptionMessage.searchWord = null
              _this.searchExceptionMessage(_this.$store)
            } else if(val == "3") {//关联请求
//              _this.clearNewApplyMessage(_this.$store)
              _this.applyMessage.searchDate = null
              _this.applyMessage.searchWord = null
              _this.searchApplyMessage(_this.$store)
            }
        }
      },
      computed: {
        ...getters,
      },
      methods: {
        ...greneralActions,
        ...exceptionActions,
        ...applyActions,
        ...sendedActions,
      },
      mounted() {
        const _this = this
        _this.doctorId = _this.doctorInfo.accid
      },
      filters: {
        dateFilter,
        sexFilter,
        dateTimeFilter,
        detectionTypeFilter: (val) => {
          const dtTypes = {
            "1":"血压",
            "2":"体重",
            "3":"心率",
            "4":"睡眠",
            "5":"运动",
            "6":"血糖",
            "7":"体温"
          }
          return dtTypes[""+val]
        },
        exceptionItemStateFilter: (val) => {
          if(val == "1") {
            return "未处理"
          } else if(val == "2") {
            return "已处理"
          } else if(val == "3"){
            return "已忽略"
          }
          return "未知"
        },
        greneralDateFilter:(item) => {
            if(item && item.lastMsg && item.lastMsg.CreateTime) {
                return moment(item.lastMsg.CreateTime).format("YYYY年MM月DD日 HH:mm")
            }
            return ""
        },
        greneralMessageContent:(item) => {
            if(item && item.lastMsg && item.lastMsg.MsgBody) {
                let msgBody = item.lastMsg.MsgBody
                if(msgBody && msgBody.length > 0 && msgBody[0].MsgContent) {
                  let msgContent = msgBody[0].MsgContent
                  if(msgContent.Text) {
                      return msgContent.Text
                  }
                }
            }
            return ""
        }
      }
  }

</script>
