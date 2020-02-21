<style lang="stylus">
  @import './index.styl';
</style>
<template>
  <span>
    &nbsp;
    <el-button @click="showGroupWin" style="padding:7px 10px;width:88px">发送消息</el-button>
    <el-dialog class="messageDialog" size="tiny" title="发送信息" v-model="groupMessageShow" :modal=false>

      <div class="tab_cons">
        <div class="cons_item form_detail" v-loading.body="sendindLoading">
          <div class="form_item">
            <span class="label">发送对象：</span>
            <div class="detail send_users">
              <div class="item" v-for="(item,index) in sendMessageUsers">
                {{item.receiverName}}
                <span class="close" @click="deleteUser(item,index)"></span>
              </div>
            </div>
          </div>
          <div class="form_item">
            <span class="label">发送内容：</span>
            <div class="detail">
              <el-input v-model="groupMessageContent" type="textarea" class="textarea" :rows=9 :maxlength="50"
                        :class="{textarea_error:content_error}"></el-input>
            </div>
            <span class="textarea_error_tips" v-show="content_error">请输入发送内容</span>
            <div class="tips">{{groupMessageContent.length}}/50</div>
          </div>
          <div class="form_item">
            <span class="label">详情链接：</span>
            <div class="detail">
              <el-input v-model="groupMessageUrl" class="textarea" :class="{textarea_error:url_error}"></el-input>
            </div>
            <span class="textarea_error_tips" v-show="url_error">请输入正确的链接</span>
          </div>
          <div class="form_footer">
            <el-button @click="groupMessageShow = false">取 消</el-button>
            <el-button type="primary" v-if="sendMessageUsers.length > 0" @click="sendGroupMessage">发 送</el-button>
            <el-button @click="goMessageLog">历史消息</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </span>
</template>
<script type="text/babel">
  import actions from './actions'
  import {dateTimeFilter} from '../../../../../filters/index'
  export default {
    data () {
      return {
        errorUsers: [],
        content_error: false,
        url_error: false,
        groupMessageShow: false,
        getUserLoading: false,
        sendUserTotal: 1,
        sendUserCurrentPage: 1,
        sendindLoading: false,
        sendLogLoading: false,
        groupMessageContent: '',
        groupMessageUrl: '',
        ShowForm: false,
        ShowLog: true,
        keyWord: "",
        send_time: "",
        sendMessageUsers: [],
        sendUserTabeleData: [],
        groupSendMessageRecordId: '',
        startTime: '',
        endTime: '',
        groupMessageId: '',
        showDetail: false,
        showDetailLoading: false,
        messageDetailInfos: {},
        isCheckIds: false,
      }
    },
    props: {
      ids: {
        type: Array
      }
    },
    methods: {
      ...actions,
    },
    mounted () {
      this.init()
    },
    watch: {
      groupMessageShow (val){
        const _this = this,
              dom = document.getElementsByTagName('body')[0]
        if (val == false) {
          dom.style.overflow = 'initial'
          _this.showDetail = false
          _this.keyWord = ""
          _this.send_time = ""
        }else {
          dom.style.overflow = 'hidden'
          if(_this.isCheckIds) {
            this.checkIds(this)
          }
        }
        _this.groupMessageContent = ''
        _this.content_error = false
        setTimeout(function() {
          if(_this.ShowLog) {
            _this.getGroupMessageLogs(_this)
          }
        },500)
      },
      groupMessageContent (val) {
        const _this = this
        if (val == "") {
          _this.content_error = true
        } else {
          _this.content_error = false
        }
      },
      groupMessageUrl (val) {
          let urlVal = val.toLowerCase()
        const strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN（域名）
            + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // 端口- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$",
        re = new RegExp(strRegex),
              _this = this
        if(re.test(urlVal) || urlVal == "") {
          if(val.indexOf('.') != -1 ) {
            _this.url_error = false
          } else {
            _this.url_error = true
          }
        } else {
          _this.url_error = true
        }
      },
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
            newArray2 = []
        if (newArray.length > 5) {
          for (var i = 0; i < newArray.length; i++) {
            if (i < 5) {
              newArray2.push(newArray[i])
            }
          }
          return newArray2.join("，") + '...'
        } else {
          return newArray.join("，")
        }
      },
      receiverNameFilter2 (val) {
        return val.split(',').join("， ")
      },
      contentFilter (val) {
        if (val.length > 10) {
          return val.substring(0, 10) + '...'
        } else {
          return val + '...'
        }
      }
    }
  }
</script>
