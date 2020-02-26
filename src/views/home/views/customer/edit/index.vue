<style lang="less" scoped>
  @import "./style.less";
</style>

<template>
  <div class="customer-info">
    <div class="tiTitle">
      <div class="left">{{isEdit && id !== 'create'?'编辑':isEdit && id === 'create'?'创建':'查看'}}用户{{id !==
        'create'?'信息':''}}
      </div>
      <div v-if="!isAdmin" v-show="!isEdit" class="right" @click="isEdit = true">编辑</div>
    </div>
    <my-form v-if="info" :model="info" :rules="rules" ref="customerForm" label-position="right" label-width="100px">
      <div class="isbox">
        <div class="imgBox">
          <img class="logoUrl" :src="info.headImgurl || './static/icon_user_no_man.png'">
          <!--<head-upload v-show="isEdit" :url="info.headImgurl" @head-upload="changeValue('headImgurl', $event)"></head-upload>-->
          <img v-if="info.qrcode" class="codeUrl" :src="info.qrcode.qrcodeUrl">
        </div>
        <div class="context">
          <div slot="left" class="title">基本信息 <span v-show="isEdit" style="color: red">(必填)</span></div>
          <my-row>
            <my-col :span="12">
              <my-item class="noRequireTip" label="姓名: " prop="name">
                <my-input class="win200" :value="info.name" :disabled="info.bindWechat && isEdit || !isEdit"
                          placeholder="请输入姓名" @input="changeValue('name', $event)"></my-input>
              </my-item>
            </my-col>
            <my-col :span="12">
              <my-item class="noRequireTip" label="出生日期: " prop="birthday">
                <my-date-picker class="win200" :value="info.birthday" :disabled="info.bindWechat && isEdit || !isEdit"
                                type="date"
                                placeholder="请选择出生日期"
                                :picker-options="pickerOptions"
                                @input="changeValue('birthday',$event)">
                </my-date-picker>
              </my-item>
            </my-col>
          </my-row>
          <my-row>
            <my-col :span="12">
              <my-item class="noRequireTip" label="性别: " prop="sex">
                <my-radio-group :value="info.sex" @input="changeValue('sex', $event)">
                  <my-radio :disabled="info.bindWechat && isEdit || !isEdit" :label="1">男</my-radio>
                  <my-radio :disabled="info.bindWechat && isEdit || !isEdit" :label="2">女</my-radio>
                </my-radio-group>
              </my-item>
            </my-col>
            <my-col :span="12">
              <my-item class="noRequireTip" label="手机号码: " prop="phone">
                <my-input class="win200" :value="info.phone" :disabled="info.bindWechat && isEdit || !isEdit"
                          placeholder="请输入手机号码" :maxlength="11" @input="changeValue('phone', $event)">
                  <template slot="prepend">cm</template>
                </my-input>
              </my-item>
            </my-col>
          </my-row>
          <my-row style="height: 46px">
            <my-col :span="12">
              <my-item class="my_form_item" label="来源渠道: ">{{patientSourceFilter(info.patientSource)}}</my-item>
            </my-col>
            <my-col :span="12">
              <my-item class="my_form_item" label="创建时间: ">{{dateFilter(info.created)}}</my-item>
            </my-col>
          </my-row>
          <my-row v-show="info.bindWechat" style="height: 46px" v-if="!isAdmin">
            <my-col :span="12">
              <my-item class="my_form_item" label="申请关联时间: ">{{dateFilter(info.linkRequestTime)}}</my-item>
            </my-col>
            <my-col :span="12">
              <my-item class="my_form_item" label="同意关联时间: ">{{dateFilter(info.agreeLinkTime)}}</my-item>
            </my-col>
          </my-row>
          <div class="title">体征信息</div>
          <my-row>
            <my-col :span="12">
              <my-item label="体重: " prop="weight">
                <el-input class="my-input win200" :value="info.weight" :disabled="info.bindWechat && isEdit || !isEdit"
                          :maxlength="3"
                          placeholder="请输入体重" @input="changeValue('weight', $event)">
                  <template slot="append">KG</template>
                </el-input>
              </my-item>
            </my-col>
            <my-col :span="12">
              <my-item label="身高: " prop="height">
                <el-input class="my-input win200" :value="info.height" :disabled="info.bindWechat && isEdit || !isEdit"
                          :maxlength="3"
                          placeholder="请输入身高" @input="changeValue('height', $event)">
                  <template slot="append">CM</template>
                </el-input>
              </my-item>
            </my-col>
          </my-row>
          <my-item label="腰围: " prop="waistline">
            <el-input class="my-input win200" :value="info.waistline" :disabled="info.bindWechat && isEdit || !isEdit"
                      :maxlength="3"
                      placeholder="请输入腰围" @input="changeValue('waistline', $event)">
              <template slot="append">CM</template>
            </el-input>
          </my-item>
          <div class="title">疾病信息</div>
          <my-item label="疾病类型: " prop="sickType">
            <my-select class="win200" :value="info.sickType" :disabled="info.bindWechat && isEdit || !isEdit" placeholder="请选择疾病类型"
                       @input="changeValue('sickType', $event)">
              <my-option label="无" :value="0"></my-option>
              <my-option label="普通" :value="1"></my-option>
              <my-option label="高血压" :value="2"></my-option>
              <my-option label="糖尿病" :value="3"></my-option>
              <my-option label="高血压/糖尿病" :value="4"></my-option>
            </my-select>
          </my-item>
          <my-row>
            <my-col :span="4">
              <div class="el-form-item__label" style="width: 100px">心血管病因</div>
            </my-col>
            <my-col :span="20">
              <my-row>
                <my-col :span="12">
                  <my-item label="吸烟: ">
                    <my-radio-group :value="info.cardiovascularRiskFactors.isSmoking"
                                    @input="chaninValue('isSmoking', $event)">
                      <my-radio :disabled="!isEdit" :label="1">是</my-radio>
                      <my-radio :disabled="!isEdit" :label="0">否</my-radio>
                    </my-radio-group>
                  </my-item>
                </my-col>
                <my-col :span="12">
                  <my-item label="血脂异常: ">
                    <my-radio-group :value="info.cardiovascularRiskFactors.dyslipidemia"
                                    @input="chaninValue('dyslipidemia', $event)">
                      <my-radio :disabled="!isEdit" :label="1">是</my-radio>
                      <my-radio :disabled="!isEdit" :label="0">否</my-radio>
                    </my-radio-group>
                  </my-item>
                </my-col>
              </my-row>
              <my-row>
                <my-col :span="12">
                  <my-item label="肥胖: ">
                    <my-radio-group :value="info.cardiovascularRiskFactors.isFat" @input="chaninValue('isFat', $event)">
                      <my-radio :disabled="!isEdit" :label="1">是</my-radio>
                      <my-radio :disabled="!isEdit" :label="0">否</my-radio>
                    </my-radio-group>
                  </my-item>
                </my-col>
                <my-col :span="12">
                  <my-item label="缺乏运动: ">
                    <my-radio-group :value="info.cardiovascularRiskFactors.lackOfPhysical"
                                    @input="chaninValue('lackOfPhysical', $event)">
                      <my-radio :disabled="!isEdit" :label="1">是</my-radio>
                      <my-radio :disabled="!isEdit" :label="0">否</my-radio>
                    </my-radio-group>
                  </my-item>
                </my-col>
              </my-row>
              <my-row>
                <my-col :span="12">
                  <my-item label="C反应异常: ">
                    <my-radio-group :value="info.cardiovascularRiskFactors.reactiveProteinC"
                                    @input="chaninValue('reactiveProteinC', $event)">
                      <my-radio :disabled="!isEdit" :label="1">是</my-radio>
                      <my-radio :disabled="!isEdit" :label="0">否</my-radio>
                    </my-radio-group>
                  </my-item>
                </my-col>
              </my-row>
            </my-col>
          </my-row>
          <div class="title">更多信息</div>
          <my-item label="身份证: " prop="idNO">
            <my-input class="win200" :value="info.idNO" :disabled="info.bindWechat && isEdit || !isEdit" style="width: 200px"
                      placeholder="请输入身份证" @input="changeValue('idNO', $event)"></my-input>
          </my-item>
          <my-item label="住址: " prop="address">
            <my-row :gutter="10">
              <my-col :span="6">
                <my-select v-if="info.province" class="win120" :value="info.province" placeholder="省份" :disabled="info.bindWechat && isEdit || !isEdit"
                           @input="getCitys('province', $event)">
                  <my-option v-for="(pro,index) in common.pros" :key="index" :label="pro.name" :value="pro.id"></my-option>
                </my-select>
                <my-select v-else class="win120" :value="info.province" placeholder="省份" :disabled="info.bindWechat && isEdit || !isEdit"
                           @input="getCitys('province', $event)">
                </my-select>
              </my-col>
              <my-col :span="6">
                <my-select v-if="info.city" class="win120" :value="info.city" placeholder="城市" :disabled="info.bindWechat && isEdit || !isEdit"
                           @input="changeValue('city', $event)">
                  <my-option v-if="common.citys" v-for="(c,index) in common.citys" :key="index" :label="c.name" :value="c.id"></my-option>
                </my-select>
                <my-select v-else class="win120" :value="info.city" placeholder="城市" :disabled="info.bindWechat && isEdit || !isEdit"
                           @input="changeValue('city', $event)">
                </my-select>
              </my-col>
              <my-col :span="12">
                <my-input class="win252" :value="info.address" :disabled="info.bindWechat && isEdit || !isEdit"
                          placeholder="请输入详细地址" @input="changeValue('address', $event)"></my-input>
              </my-col>
            </my-row>
          </my-item>
          <my-item label="社保号: " prop="insurcode">
            <my-input class="win200" :value="info.insurcode" :disabled="!isEdit"
                      placeholder="请输入社保号" @input="changeValue('insurcode', $event)"></my-input>
          </my-item>
          <my-item label="医疗ID: " prop="medicalid">
            <my-input class="win200" :value="info.medicalid" :disabled="!isEdit"
                      placeholder="请输入医疗ID" @input="changeValue('medicalid', $event)"></my-input>
          </my-item>
          <my-item label="紧急联系人: " prop="emergencyName">
            <my-input class="win200" :value="info.emergencyName" :disabled="!isEdit"
                      placeholder="请输入紧急联系人" @input="changeValue('emergencyName', $event)"></my-input>
          </my-item>
          <my-item label="紧急联系电话: " prop="emergencyPhone">
            <my-input class="win200" :value="info.emergencyPhone" :disabled="!isEdit"
                      placeholder="请输入紧急联系电话"
                      @input="changeValue('emergencyPhone', $event)"></my-input>
          </my-item>
          <div v-if="device&&device.length" class="title">设备信息</div>
          <div class="devices" v-if="device">
            <ms-popover v-for="(d, i) in device" :key="i" :device="d" :value="i" :column="5"></ms-popover>
          </div>
        </div>
      </div>
      <div v-if="!isAdmin" style="text-align: center; margin-bottom: 20px">
        <my-button style="width: 88px" v-if="isEdit" slot="center" type="primary" @click.native="save">保存</my-button>
        <my-button style="width: 88px" v-if="!isEdit" slot="center" type="primary" @click.native="go({name: 'customer_list'})">返回</my-button>
        <my-button style="width: 88px" v-if="isEdit" slot="center" @click.native="go({name: 'customer_list'})">取消</my-button>
        <my-button style="width: 88px" v-if="id !== 'create'" slot="center" type="waring" @click.native="delPatient">删除</my-button>
      </div>
      <div v-if="isAdmin" style="text-align: center; margin-bottom: 20px">
        <my-button style="width: 88px" slot="center" type="primary" @click.native="back" v-if="!isDialog">返回</my-button>
        <my-button style="width: 88px" slot="center" type="primary" @click="closeDialog" v-if="isDialog">返回</my-button>
      </div>
    </my-form>
    <!--</pages>-->
  </div>
</template>

<script>
  // components
  import MyNav from '../../../../../components/common/nav/MyNav.vue'
  import Page from '../../../../../components/common/page/Page'
  import MyButton from '../../../../../components/common/button/MyButton'
  import MyItem from '../../../../../components/common/form/MyItem'
  import MyForm from '../../../../../components/common/form/MyForm'
  import MyInput from '../../../../../components/common/input/MyInput'
  import MyPopover from '../../../../../components/common/popover/MyPopover'
  import MyRadioGroup from '../../../../../components/common/radio/MyRadioGroup'
  import MyRadio from '../../../../../components/common/radio/MyRadio'
  import MyDatePicker from '../../../../../components/common/date/MyDatePicker'
  import MySelect from '../../../../../components/common/select/MySelect'
  import MyOption from '../../../../../components/common/select/MyOption'
  import MsPopover from '../../../../../components/common/popover/msPopover.vue'
  import {MyRow, MyCol} from '../../../../../components/common/layout'
  //  import HeadUpload from '../../../../../components/common/upload/HeadUpload.vue'

  // actionss
  import actions from './actions'
  // getters
  import getters from './getters'
  import {
    getlocalStorage,
  } from '../../../../../api/common'
  import {paramsGetter, queryGetter} from '../../../../../store/getters/route'
  // filters
  import {dateFilter, patientSourceFilter, pcaFilter} from '../../../../../filters'

  export default{
    name: 'customer-edit-view',
    data () {
      return {
        isEdit: false,
        isShow: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now() - 8.64e7
          }
        },
      }
    },
    props: {
      isDialog: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      ...getters,
      id () {
        return paramsGetter(this.$store.state).id
      },
      from () {
        return queryGetter(this.$store.state).from
      },
      isAdmin () {
        return getlocalStorage('roleType') == '1'
      },
      getEditStatus () {
        return this.$route.query.isEdit || this.id === 'create'
      }
    },
    methods: {
      ...actions,
      dateFilter,
      patientSourceFilter,
      pcaFilter,
      closeDialog () {
        this.$emit('click', "back")
      }
    },
    components: {
      MyNav,
      Page,
      MyButton,
      MyItem,
      MyForm,
      MyInput,
      MyPopover,
      MyRadioGroup,
      MyRadio,
      MyDatePicker,
      MySelect,
      MyOption,
      MyRow,
      MyCol,
      MsPopover,
//      HeadUpload
    },
    created () {
      this.init()
      this.isEdit = this.getEditStatus
    },
    destroyed () {
      this.clear()
    }
  }
</script>
