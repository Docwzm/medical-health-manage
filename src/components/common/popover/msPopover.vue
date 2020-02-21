<style lang="less" scoped>
  @import "./style.less";
</style>

<template>
  <div class="devBox" :style="{width: `${100/column}%`}" v-popover:names>
    <my-popover
            ref="names" class="my_popover"
            placement="top"
            width="500"
            v-model="showDevice">
      <div class="devTitle">
        <span class="left">设备详情</span>
        <span class="right el-icon-close" @click="showDevice = !showDevice"></span>
      </div>
      <my-form :model="device" label-width="100px" label-position="right">
        <my-row class="deviceBox">
          <my-col :span="8" class="left">
            <img class="devImg" :src="device.picture">
            <!--<img :src="device.qrcode">-->
            <div :id="names"></div>
          </my-col>
          <my-col :span="16" class="right">
            <my-item class="devBoxLi" label="设备名称: ">{{device.name}}</my-item>
            <my-item class="devBoxLi" label="型号: ">{{device.model}}</my-item>
            <my-item class="devBoxLi" label="SN码: ">{{device.sn}}</my-item>
            <my-item :label="isBindKey?'当前绑定按键':'绑定状态'" class="devBoxLi" v-if="device.userNo">
              <my-radio-group v-show="device.productTypeCode === '08'" :value="device.userNo">
                <my-radio :label="1" disabled>1号键</my-radio>
                <my-radio :label="2" disabled>2号键</my-radio>
              </my-radio-group>
              <div v-show="device.productTypeCode !== '08'">已绑定</div>
            </my-item>
            </my-item>
          </my-col>
        </my-row>
      </my-form>
    </my-popover>

    <img :src="device.picture" :alt="device.name">
    <span class="laTi" :title="device.name">{{device.name}}</span>
  </div>
</template>

<script type="text/babel">
  import MyForm from '../form/MyForm'
  import MyItem from '../form/MyItem'
  import MyButton from '../button/MyButton'
  import MyPopover from './MyPopover'
  import MyRadioGroup from '../radio/MyRadioGroup'
  import MyRadio from '../radio/MyRadio'
  import QRCode from 'davidshimjs-qrcodejs'
  import {MyRow, MyCol} from '../layout'

  export default {
    name: 'dviPopover',
    data() {
      return {
        visible2: false,
        showDevice: false,
        names: `dvi${this.value}`
      }
    },
    props: {
      device: {
        type: Object,
//        default: ''
      },
      value: {
        type: Number,
//        default: ''
      },
      column: {
        type: Number,
        default: 2
      },
    },
    computed: {
      isBindKey () {
        return this.device.productTypeCode === '08'
      }
    },
    mounted () {
      var qrcode = new QRCode(document.getElementById(this.names), {
        width: 80,
        height: 80,
        colorDark: "#000000",
        colorLight: "#ffffff",
      })
      qrcode.clear() // clear the code.
      qrcode.makeCode(this.device.qrcode)
    },
    components: {
      MyForm,
      MyButton,
      MyItem,
      MyPopover,
      MyRadioGroup,
      MyRadio,
      MyRow,
      MyCol,
    },
  }
</script>
