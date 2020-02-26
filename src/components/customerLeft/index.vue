<!--<style lang="less" scoped>-->
  <!--@import "./style.less";-->
<!--</style>-->

<!--<template>-->
  <!--<pages :loading="!info.id" :class="!info.id && 'noBorder'">-->
    <!--<my-tabs @tab-click="tabLink" :activeName="activeName">-->
      <!--<my-tab-pane label="健康数据" name="patient_doctor_info"></my-tab-pane>-->
      <!--<my-tab-pane label="对话" name="customer_chat"></my-tab-pane>-->
    <!--</my-tabs>-->
    <!--<div class="content" ref="content">-->
      <!--<div class="customer-left" ref="left">-->
        <!--<my-form :model="info" class="myForm" label-position="left">-->
          <!--<div class="myTitle">-->
            <!--<span>基本资料</span>-->
            <!--<span class="right" @click="clickMore"> 更多资料 &gt;&gt;</span>-->
          <!--</div>-->
          <!--<div class="isBox">-->
            <!--<div class="imgBar">-->
              <!--<img class="info" v-if="info.headImgurl"-->
                   <!--:src="info.headImgurl || '../../../static/icon_user_no_man.png'">-->
              <!--<img v-if="info.qrcode" :src="info.qrcode.qrcodeUrl">-->
            <!--</div>-->
            <!--<my-item class="bold" slot="left" label="姓名: ">{{info.name || '无'}}</my-item>-->
            <!--<my-item class="bold" slot="right" label="性别: ">{{sexFilter(info.sex)}}</my-item>-->
            <!--<my-item class="bold" label="年龄: ">{{`${info.age}岁` || '无'}}</my-item>-->
            <!--<my-item class="bold" label="地区: ">{{info.province && info.city && pcaFilter(info.province, info.city,-->
              <!--common.pros) || info.address}}-->
            <!--</my-item>-->
            <!--<my-item class="bold" label="疾病类型: ">{{sickTypeFilter(info.sickType)}}</my-item>-->
            <!--<div class="tip">心血管病危险因素:</div>-->
            <!--<div class="bar">-->
              <!--<my-item class="inLeTe" slot="left" label="吸烟 ">-->
                <!--{{isSickFilter(info.cardiovascularRiskFactors.isSmoking)}}-->
              <!--</my-item>-->
              <!--<my-item class="inLeTe" slot="right" label="血脂异常 ">-->
                <!--{{isSickFilter(info.cardiovascularRiskFactors.dyslipidemia)}}-->
              <!--</my-item>-->
            <!--</div>-->
            <!--<div class="bar">-->
              <!--<my-item class="inLeTe" slot="left" label="肥胖 ">{{isSickFilter(info.cardiovascularRiskFactors.isFat)}}-->
              <!--</my-item>-->
              <!--<my-item class="inLeTe" slot="right" label="缺乏运动 ">-->
                <!--{{isSickFilter(info.cardiovascularRiskFactors.lackOfPhysical)}}-->
              <!--</my-item>-->
            <!--</div>-->
            <!--<my-item class="inLeTe" label="C反应异常 ">{{isSickFilter(info.cardiovascularRiskFactors.reactiveProteinC)}}-->
            <!--</my-item>-->
          <!--</div>-->
          <!--<div class="infoTitle">设备</div>-->
          <!--<div class="devices" v-if="device.length">-->
            <!--<ms-popover v-for="(d, i) in device" :device="d" :value="i"></ms-popover>-->
          <!--</div>-->
          <!--<div v-if="!device.length" class="dviIno">暂无设备</div>-->
          <!--<div class="infoTitle">-->
            <!--<span>备注</span>-->
            <!--<span class="right" @click="notesEdit">-->
              <!--<div v-show="isNotesEdit" class="text">保存</div>-->
              <!--<div v-show="!isNotesEdit" v-html="img.remarks"></div>-->
            <!--</span>-->
          <!--</div>-->
          <!--<div class="notes">-->
            <!--<div class="leftNotes" v-if="isNotesEdit">-->
              <!--<my-input class="my_textarea" type="textarea" :value="info.remark"-->
                        <!--placeholder="请输入内容" :maxlength="100" @input="changeValue('remark', $event)"></my-input>-->
              <!--<div v-if="isNotesEdit" class="length">{{`${info.remark && info.remark.length || '0'}/100`}}</div>-->
            <!--</div>-->
            <!--<my-item class="my_form_item no_white" v-if="!isNotesEdit">{{info.remark || '暂无备注'}}</my-item>-->
          <!--</div>-->
        <!--</my-form>-->
      <!--</div>-->
      <!--<div class="rightData" ref="right">-->
        <!--<slot></slot>-->
      <!--</div>-->
    <!--</div>-->
  <!--</pages>-->
<!--</template>-->

<!--<script type="text/babel">-->
  <!--import Page from '../common/pages/Page'-->
  <!--import MyButton from '../common/button/MyButton'-->
  <!--import MyItem from '../common/form/MyItem'-->
  <!--import MyForm from '../common/form/MyForm'-->
  <!--import MyInput from '../common/input/MyInput'-->
  <!--import MyPopover from '../common/popover/MyPopover'-->
  <!--import MyRadioGroup from '../common/radio/MyRadioGroup'-->
  <!--import MyRadio from '../common/radio/MyRadio'-->
  <!--import ControlBar from '../common/ControlBar/ControlBar.vue'-->
  <!--import MyDatePicker from '../common/date/MyDatePicker'-->
  <!--import MyTabs from '../common/tabs/MyTabs'-->
  <!--import MyTabPane from '../common/tabs/MyTabPane'-->
  <!--import MsPopover from '../common/popover/msPopover.vue'-->

  <!--// actions-->
  <!--import actions from './actions'-->
  <!--// actions-->
  <!--import getters from './getters'-->
  <!--import router from '../../router'-->
  <!--// filter-->
  <!--import {sexFilter, isSickFilter, sickTypeFilter, pcaFilter} from '../../filters'-->
  <!--import {paramsGetter} from '../../store/getters/route'-->

  <!--export default {-->
    <!--name: 'customer-left',-->
    <!--data () {-->
      <!--return {-->
        <!--showDvi: false,-->
        <!--isNotesEdit: false,-->
        <!--activeName: 'patient_doctor_info',-->
        <!--img: {-->
          <!--save: require('../../../static/icon-save.svg'),-->
          <!--remarks: require('../../../static/icon-remarks.svg'),-->
        <!--},-->
      <!--}-->
    <!--},-->
    <!--components: {-->
      <!--Page,-->
      <!--MyInput,-->
      <!--MyTabs,-->
      <!--MyTabPane,-->
      <!--MyButton,-->
      <!--MyItem,-->
      <!--MyForm,-->
      <!--ControlBar,-->
      <!--MyRadioGroup,-->
      <!--MyRadio,-->
      <!--MyPopover,-->
      <!--MyDatePicker,-->
      <!--MsPopover,-->
    <!--},-->
    <!--computed: {-->
      <!--...getters,-->

    <!--},-->
    <!--created () {-->
      <!--this.init()-->
      <!--this.info.remark && this.info.remark.length === 0 ? this.isNotesEdit = true : this.isNotesEdit = false-->
    <!--},-->
    <!--methods: {-->
      <!--...actions,-->
      <!--sexFilter,-->
      <!--isSickFilter,-->
      <!--sickTypeFilter,-->
      <!--pcaFilter,-->
      <!--clickMore () {-->
        <!--const {id} = paramsGetter(this.$store.state)-->
        <!--router.push({name: 'customer_edit', params: {id}, query: {from: 'patient_doctor_info'}})-->
      <!--},-->
      <!--notesEdit () {-->
        <!--this.isNotesEdit = !this.isNotesEdit-->
        <!--this.editPatientRemark()-->
      <!--},-->
    <!--},-->
    <!--watch: {-->
      <!--info(v) {-->
        <!--if (v.id) {-->
          <!--this.$nextTick(() => {-->
            <!--if (this.$refs.content && this.$refs.left && this.$refs.right) {-->
              <!--const contentRect = this.$refs.content.getBoundingClientRect()-->
              <!--const leftRect = this.$refs.left.getBoundingClientRect()-->
              <!--this.$refs.content.style.setProperty('width', contentRect.width + 'px')-->
              <!--this.$refs.right.style.setProperty('width', (contentRect.width - leftRect.width - 20) + 'px')-->

              <!--if (this.$route.name === 'customer_bp') {-->
                <!--this.$refs.right.style.setProperty('min-height', leftRect.height + 'px')-->
              <!--} else {-->
                <!--this.$refs.right.style.setProperty('height', leftRect.height + 'px')-->
              <!--}-->
            <!--}-->
          <!--})-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--destroyed () {-->
<!--//     this.clear()-->
    <!--}-->
  <!--}-->
<!--</script>-->
