<style lang="less" scoped>
  @import "../style.less";
</style>

<template>
  <div style="height: 800px;overflow-y: hidden">
    <my-tabs class="flex" @tab-click="tabLink" :activeName="activeName">
      <my-tab-pane label="健康数据" name="patient_doctor_info"></my-tab-pane>
      <my-tab-pane label="对话记录" name="customer_record"></my-tab-pane>
    </my-tabs>
    <div class="reBox" ref="recordBox">
        <div class="dataPicker" ref="recordLeft">
          <div class="title">
            <span class="left">对话历史</span>
            <span @click="tabLink({name: 'customer_chat'})" class="right">返回</span>
          </div>
          <div class="msgRecordTi">
            <span @click="last('year')">&lt;&lt;</span>
            <span @click="last('month')">&lt;</span>
            <span class="isChang">{{dateFilter(time,'YYYY年 MM月')}}</span>
            <span @click="next('month')">&gt;</span>
            <span @click="next('year')">&gt;&gt;</span>
          </div>
          <div class="dateBox">
            <div class="daTi">
              <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
            </div>
            <div class="dateDate">
              <span v-for="(day, index) in dayList" :key="index" :class="{ 'in': day.count > 0 ,'active':index === idx}"
                    @click="getDayMsg(day.date, day.count, index)">{{day.text}}</span>
            </div>
          </div>
        </div>
        <div class="chatBox record" ref="recordRight">
          <div class="chatBoxBody" ref="chatBoxBody">
            <div v-if="msgLoad" class="loading"><span>加载中...</span></div>
            <div v-if="noData" class="noData">暂无聊天记录</div>
            <div class="msgBarBox" v-for="(msg,idx) in record" :key="idx" :class="[msg.From_Account == doctor.id?'right':'left']">
              <div class="cbDate" v-if="!!getDate(idx,msg)"><span>{{getDate(idx,msg)}}</span></div>
              <img class="headImg" v-if="msg.From_Account != doctor.id" :src="getPatientImg()">
              <span v-html="img.error" v-if="msg.error" @click="send(msg)">!</span>
              <span class="msgBox"><Message :msg="msg"/></span>
              <img class="headImg" v-if="msg.From_Account == doctor.id" :src="getDoctorImg()">
            </div>
          </div>
          <div class="more" @click="getMore"><span>更多消息</span></div>
        </div>
      </div>
  </div>
</template>

<script>
  import MyNav from '../../../../../components/common/nav/MyNav.vue'
  import MyTabs from '../../../../../components/common/tabs/MyTabs'
  import MyTabPane from '../../../../../components/common/tabs/MyTabPane'
  import MyButton from '../../../../../components/common/button/MyButton'
  import MyInput from '../../../../../components/common/input/MyInput'
  import Message from '../../../../../components/chat/Message.vue'
  // actions
  import actions from './actions'
  // getters
  import getters from './getters'
  import moment from 'moment'
  // filter
  import {dateFilter} from '../../../../../filters'

  export default{
    name: 'customer-chat-view',
    data () {
      return {
        doctor: {},
        msgLoad: false,
        dayList: [],
        time: new Date(),
        idx: null,
        noData: false
      }
    },
    computed: {
      ...getters,
    },
    methods: {
      ...actions,
      dateFilter,
      getDate (idx, msg) {
        if (!this.record || !this.record.length) {
          return
        } else if (this.record.length === 1 || !idx || (moment(msg.CreateTime).diff(this.record[idx - 1].CreateTime, 'minutes') > 30)) {
          return moment(msg.CreateTime).format('YYYY年MM月DD日 HH:mm')
        }
      },
      getPatientImg () {
        return this.patient.headimgurl || require('../../../../../../static/icon_user_no_man.png')
      },
      getDoctorImg () {
        return this.doctor.headimgurl || require('../../../../../../static/icon_user_no_man.png')
      },
    },
    components: {
      MyNav,
      MyTabs,
      MyTabPane,
      MyButton,
      MyInput,
      Message,
    },
    watch: {
      record() {
        this.$nextTick(() => {
          if (this.$refs.recordBox && this.$refs.recordLeft) {
            const contentRect = this.$refs.recordBox.getBoundingClientRect()
            const leftRect = this.$refs.recordLeft.getBoundingClientRect()
            const $right = this.$refs.recordRight
            const recordRight = $right.getBoundingClientRect()

            $right.style.setProperty('width', (contentRect.width - leftRect.width - 60) + 'px')
            this.$refs.chatBoxBody.style.setProperty('height', (recordRight.height - 60) + 'px')
          }
        })
      }
    },
    mounted () {
      this.init()
    },
    destroyed () {
      this.clear()
    }
  }
</script>
