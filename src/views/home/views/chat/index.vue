<style lang="less">
  @import "./style.less";
  @import "../customer/info/style.less";
</style>

<template>
  <div>
    <my-tabs class="flex" @tab-click="tabLinks" :activeName="activeName">
      <my-tab-pane label="健康数据" name="patient_doctor_info"></my-tab-pane>
      <my-tab-pane label="对话" :style="{margin: 0}" name="customer_chat"></my-tab-pane>
    </my-tabs>
    <div class="infoBox">
      <div class="left" ref="left">
        <left type="doctor"></left>
      </div>
      <div class="right">
        <div class="chatBox" ref="rightBox" style="height: 800px">
          <div class="chatBoxBody" ref="chatBoxBody">
            <div v-if="!chat.session" class="loading"><span>加载中...</span></div>
            <div class="msgBarBox" v-for="(msg,idx) in chat.messageList"
                 :class="[msg.From_Account == doctor.id || msg.fromAccount == doctor.id?'right':'left']">
              <div class="cbDate" v-if="!!getDate(idx,msg)"><span>{{getDate(idx,msg)}}</span></div>
              <img class="headImg" v-if="msg.From_Account != doctor.id && msg.fromAccount != doctor.id"
                   :src="getPatientImg()">
              <span v-html="img.error" v-if="msg.error" @click="send(msg, true)">!</span>
              <span class="msgBox"><Message :msg="msg"/></span>
              <img class="headImg" v-if="msg.From_Account == doctor.id || msg.fromAccount == doctor.id"
                   :src="getDoctorImg()">
            </div>
          </div>
          <div class="chatBoxFooter">
            <fast-reply :docotrInfos="doctor" @click="getReply"></fast-reply>
            <div class="title">
              <div><span v-html="img.img"></span><input type="file" alt="" accept="image/gif,image/jpeg,image/jpg,image/png"
                                                        @change="sendImg"/></div>
              <div @click="tabLinks({name: 'customer_record'})"><span v-html="img.his"></span></div>
            </div>
            <div class="send">
              <my-input @keypress.native="keyboardSend" type="textarea" :rows="5" v-model="message"></my-input>
              <!--<my-button type="primary" @click="sendMsg(message)">发送</my-button>-->

              <other-dropdown label="发送" class="otherDropdown"
                              :menu="[{key: '1', name: '按Enter键发送消息'}, {key: '2', name: '按Ctrl+Enter键发送消息'}]"
                              :value="keyboard" @check="getType"></other-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MyTabs from '../../../../components/common/tabs/MyTabs'
  import MyTabPane from '../../../../components/common/tabs/MyTabPane'
  import MyButton from '../../../../components/common/button/MyButton'
  import MyInput from '../../../../components/common/input/MyInput'
  import Message from '../../../../components/chat/Message.vue'
  import otherDropdown from '../../../../components/common/dropdown/otherDropdown.vue'

  import left from '../customer/info/public/left'
  import fastReply from './fastReply/index.vue'
  // actions
  import actions from './actions'
  // getters
  import getters from './getters'
  import {savelocalStorage, getlocalStorage} from '../../../../api/common'
  import {showAlert} from '../../../../store/actions/alert'
  import moment from 'moment'
  // mutations
  import {MUTATION_NAME} from '../customer/info/mutations'

  export default{
    name: 'customer-chat-view',
    data () {
      return {
        message: '',
        doctor: {},
        keyboard: '1',
        img: {
          img: require('!!raw!../../../../../static/msgImg.svg'),
          his: require('!!raw!../../../../../static/msgDate.svg'),
          error: require('!!raw!../../../../../static/msgError.svg'),
        },
        ele: [],
      }
    },
    computed: {
      ...getters,
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
    },
    watch: {
      'keyboard' (v) {
        savelocalStorage(`${this.doctor.mobile}_Keyboard`, v)
      },
      Def () {
        this.$nextTick(() => {
          if (this.$refs.left) {
            const leftRect = this.$refs.left.getBoundingClientRect()
            const $right = this.$refs.rightBox

            $right.style.setProperty('height', (leftRect.height) + 'px')
          }
        })
//        this.init()
      }
    },
    methods: {
      getType (v) {
        if (v === 'send') {
          this.sendMsg(this.message)
        } else {
          this.keyboard = v
          savelocalStorage(`${this.doctor.mobile}_Keyboard`, v)
        }
      },
      keyboardSend (event) {
        const isNone = this.message.replace(/\n|\s+/g, '')
        if (event) {
          if (this.keyboard === '1') {
            if (event.keyCode !== 13) {
              return
            }
            if (!event.ctrlKey) {
              event.preventDefault()
            } else {
              const {selectionEnd, selectionStart} = event.target
              const msg = this.message
              this.message = `${msg.substring(0, selectionStart)}\n${msg.substr(selectionEnd)}`
              console.log(this.message)
              this.$nextTick(() => {
                event.target.setSelectionRange(this.message.length, selectionStart + 1)
              })
              return
            }
            if (isNone) {
              this.sendMsg(this.message)
            } else {
              showAlert(`不能发送空白消息`, 'error')
              this.message = ''
              return
            }
          }
          if (this.keyboard === '2') {
            if (event.ctrlKey && (event.keyCode === 13 || event.keyCode === 10)) {
              if (isNone) {
                this.sendMsg(this.message)
              } else {
                showAlert(`不能发送空白消息`, 'error')
                this.message = ''
                return
              }
            } else {
              return
            }
          }
          if (!this.message) {
            showAlert(`不能发送空白消息`, 'error')
            this.message = ''
            return
          }
        }
      },
      ...actions,
      getDate(idx, msg){
        if (!this.chat.messageList || !this.chat.messageList.length) {
          return
        } else if (this.chat.messageList.length == 1 || !idx || (moment(msg.CreateTime).diff(this.chat.messageList[idx - 1].CreateTime, 'minutes') > 30)) {
          return moment(msg.CreateTime).format('YYYY年MM月DD日 HH:mm')
        }
      },
      getPatientImg(){
        return this.patient.headimgurl || require('../../../../../static/icon_user_no_man.png')
      },
      getDoctorImg(){
        return this.doctor.headimgurl || require('../../../../../static/icon_user_no_man.png')
      },
      getReply (val) {
        this.message = val
      }
    },
    components: {
      MyTabs,
      MyTabPane,
      MyButton,
      MyInput,
      Message,
      otherDropdown,
      fastReply,
      left,
    },
    created () {
      document.body.scrollTop = 0
      this.init()
    },
    mounted () {
      document.body.scrollTop = 0
    },
    destroyed () {
      this.upReadeTime()
    }
  }
</script>
