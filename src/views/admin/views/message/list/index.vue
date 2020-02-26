<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<style lang="stylus">
  @import "./index2.styl";
</style>
<template>
  <div class="admin-content-box admin-list admin-message">
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
      <div class="admin-title">
        <h2>消息发送</h2>
      </div>
      <div class="search">
        <el-date-picker
                class="date-input"
                v-model="message_time"
                type="daterange"
                placeholder="选择日期范围">
        </el-date-picker>
        <el-select class="search-select" v-model="message_type" placeholder="请选择发送状态" clearable>
          <el-option
                  v-for="(item,index) in typeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
        <span class="search-btn" @click="search"></span>
      </div>

      <el-table
          :data="list"
          stripe
          @row-click="showDetail"
      >
        <el-table-column
                inline-template
                width="350"
                label="发送对象">
          <div>
            <span>{{row.receiverName | receiverNameFilter}}</span>
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                width="200"
                label="发送内容">
          <div>

            <div v-if="row.content.length > 10">
                <span>{{ row.content | contentFilter}}</span>
            </div>

            <div v-if="row.content.length <= 10">
              {{ row.content}}
            </div>

          </div>
        </el-table-column>
        <el-table-column
                inline-template
                label="发送状态"
                width="200"
        >
          <div>
            {{row.sendStatus | sendStatusFilter}}
          </div>
        </el-table-column>
        <el-table-column
                inline-template
                label="发送时间">
          <div>{{row.sendTime | dateTimeFilter}}</div>
        </el-table-column>
      </el-table>
    <div class="page-space"></div>
    <div class="page-con" :class="{'page-con-bottom':!isPosition}">
      <el-pagination
              @current-change="sendUserHandleCurrentChange"
              :current-page="sendUserCurrentPage"
              :page-size="20"
              layout="prev, pager, next, jumper"
              :total="total">
      </el-pagination>

    </div>

    <el-dialog title="消息记录" v-model="dialogVisible" size="tiny" class="message-detail-dialog" :modal=false>
      <div style="position: relative">
        <div class="el-loading-mask common-loading" v-show="dialogLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
        <div class="list">
            <div class="item">
              <span class="label">发送时间：</span>
              <div class="detail">{{messageDetailInfos.sendTime | dateTimeFilter}}</div>
            </div>
            <div class="item" v-if="messageDetailInfos.sendingReceivers != ''">
              <span class="label">发送中：</span>
              <div class="detail">
                <span><span v-for="(item,index) in messageDetailInfos.sendingReceivers" :key="index">{{item.receiverName}}，</span></span>
              </div>
            </div>
          <div class="item" v-if="messageDetailInfos.succcessReceivers != ''">
            <span class="label">发送成功：</span>
            <div class="detail">
              <span ><span v-for="(item,index) in messageDetailInfos.succcessReceivers" :key="index">{{item.receiverName}}，</span></span>
            </div>
          </div>
          <div class="item" v-if="messageDetailInfos.failReceivers != ''">
            <span class="label">发送失败：</span>
            <div class="detail">
              <span ><span v-for="(item,index) in messageDetailInfos.failReceivers" :key="index">{{item.receiverName}}，</span></span>
            </div>
          </div>
            <div class="item">
              <span class="label">发送内容：</span>
              <div class="detail">
                {{messageDetailInfos.conent}}
              </div>
            </div>
            <div class="item" v-if="messageDetailInfos.link && messageDetailInfos.link != ''">
              <span class="label">详情链接：</span>
              <div class="detail">
                <a :href="messageDetailInfos.link | urlFilter" target="_blank" style="color:#000">{{messageDetailInfos.link}}</a>
              </div>
            </div>
        </div>
        <div class="dialog-footer2">
          <el-button @click="dialogVisible = false">&nbsp;&nbsp;&nbsp;返 回&nbsp;&nbsp;&nbsp;</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script type="text/babel">
  import {dateTimeFilter} from '../../../../../filters/index'
  import actions from './actions'
  import getters from './getters'
  export default {
    data () {
      return {
        isPosition: false,
        sendUserCurrentPage: 1,
        message_time: {},
        startTime: '',
        endTime: '',
        loading: false,
        dialogLoading: false,
        dialogVisible: false,
        message_type: "",
        messageDetailInfos: {},
        typeList: [
          {
            label:"全部",
            value:-1,
          },
          {
            label:"发送中",
            value:0,
          },
          {
            label:"发送成功",
            value:1,
          },
          {
            label:"部分发送失败",
            value:2,
          },
          {
            label:"发送失败",
            value:3,
          }
        ]
      }
    },
    computed: {
      ...getters,
    },
    methods: {
      ...actions,
    },
    created () {
      this.init()
    },
    watch: {
      send_time (val) {
        const _this = this
        _this.startTime = new Date(val[0]).getTime()
        _this.endTime = new Date(val[1]).getTime()
        if (_this.startTime > 100) {
          _this.endTime += 86400000
        }
      }
    },
    filters: {
      dateTimeFilter,
      sendStatusFilter (val) {
        switch (val) {
          case 0 :
            return "发送中"
            break
          case 1 :
            return "发送成功"
            break
          case 2 :
            return "部分发送失败"
            break
          case 3 :
            return "发送失败"
            break
        }
      },
      receiverNameFilter (val) {
        var newArray = val.split(','),
            st = newArray.join("， ")
        if(st.length > 23) {
          return st.substring(0,23) + "..."
        } else {
          return st
        }
      },
      receiverNameFilter2 (val) {
        return val.split(',').join("， ")
      },
      contentFilter (val) {
        if (val.length > 10) {
          return val.substring(0, 10) + '...'
        } else {
          return val
        }
      },
      urlFilter (val) {
        if(val.indexOf('://') == -1){
          return `//${val}`
        } else {
          return val
        }
      }
    }
  }
</script>