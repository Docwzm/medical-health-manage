<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
<style lang="stylus" rel="stylesheet/stylus">
  .bp-set-threshold-dialog
    &.el-dialog
      min-width 715px
    .wrapper:nth-child(2)
      margin-right 80px
    .form-line
      word-spacing 10px
      maring-right 10px
      &:nth-child(2)
        margin-top 20px
      &:nth-child(1)
        .el-button
          width 106px
          height 36px
          color #000
          font-size 14px


</style>
<template>
  <el-dialog
    :show-close="false"
    v-model="visible"
    :custom-class="'bp-set-threshold-dialog'"
    class="dialog"
    title="自定义血压预警"
    @open="onOpen"
    ref="dialog"
    @close="onClose"
  >


    <el-form>
      <div class="form-line" style="text-align: right">
        <el-button
          @click="resetThreshold"
          size="small"

        >恢复默认值
        </el-button>
        <el-button

          @click="toggleAlertConfig"
          size="small">{{!!bpState.threshold.systolic.alert?'关闭':'开启'}}预警
        </el-button>
      </div>
      <div class="form-line">

        <span class="form-line-title">舒张压 上限</span>
        <input-error-layout
          :field-config="formFields.diaUL"
        >
          <el-input
            slot="input"
            class=""
            placeholder=""
            v-model="diaUL"

          >
            <template slot="append">mmhg</template>
          </el-input>
        </input-error-layout>


        <span>下限</span>

        <input-error-layout
          :field-config="formFields.diaLL"
        >
          <el-input
            slot="input"
            class=""
            placeholder=""
            v-model="diaLL"

          >
            <template slot="append">mmhg</template>
          </el-input>
        </input-error-layout>


      </div>
      <div class="form-line">
        <span class="form-line-title">收缩压 上限</span>
        <input-error-layout
          :field-config="formFields.sysUL"
        >
          <el-input
            slot="input"
            class=""
            placeholder=""
            v-model="sysUL"

          >
            <template slot="append">mmhg</template>
          </el-input>
        </input-error-layout>

        <span>下限</span>
        <input-error-layout
          :field-config="formFields.sysLL"
        >
          <el-input
            slot="input"
            class=""
            placeholder=""
            v-model="sysLL"
          >
            <template slot="append">mmhg</template>
          </el-input>
        </input-error-layout>
      </div>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="saveThreshold">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/babel">
  import {
    OPEN_DIALOG,
    STORE_NAME,
    SAVE_BP_THRESHOLD,

    TURN_OFF_BP_ALERT,
    EVT_THRESHOLD_CHANGED,
    QUERY_BP_THRESHOLD
  } from './constants'
  import InputErrorLayout from './InputWithErrorLayout.vue'
  import {triggerEvent} from './utils'
  const name = 'thresholdPopup'
  const comp = {
    components: {InputErrorLayout},
    data(){
      const testFn1 = (v) => {
        v = parseFloat(v)
        if (isNaN(v) || v > 200 || v < 60) {
          return '请输入60-200的数值'
        }
        return ''
      }
      const testFn2 = (v) => {
        v = parseFloat(v)
        if (isNaN(v) || v > 130 || v < 30) {
          return '请输入30-130的数值'
        }
        return ''
      }
      return {
        visible: false,
        inputWidth: '200px',
        formFields:{
          diaUL:{
            width:200,
            test:testFn2,
            v:-1,
            events:['blur']
          },
          diaLL:{
            width:200,
            test:testFn2,
            v:-1,
            events:['blur']
          },
          sysUL:{
            width:200,
            test:testFn1,
            v:-1,
            events:['blur']
          },
          sysLL:{
            width:200,
            test:testFn1,
            v:-1,
            events:['blur']
          }
        },

      }
    },
    computed: {

      bpState(){
        return this.$store.state[STORE_NAME]
      },
      threshold(){
        return this.bpState.threshold
      },

      //舒张压上限
      diaUL: {
        get(){
          return this.formFields.diaUL.v==-1?  this.threshold.diastolic.upperLimit:this.formFields.diaUL.v
        },
        set(v){

          this.formFields.diaUL.v = v

        }
      },

      //舒张压下限
      diaLL: {
        get(){
          return this.formFields.diaLL.v==-1?  this.threshold.diastolic.lowerLimit:this.formFields.diaLL.v
        },
        set(v){
          this.formFields.diaLL.v = v
        }
      },
      //收缩压下限
      sysLL: {
        get(){
          return this.formFields.sysLL.v==-1?  this.threshold.systolic.lowerLimit:this.formFields.sysLL.v
        },
        set(v){
          this.formFields.sysLL.v = v
        }
      },

      //收缩压上限
      sysUL: {
        get(){
          return this.formFields.sysUL.v==-1?  this.threshold.systolic.upperLimit:this.formFields.sysUL.v
        },
        set(v){
          this.formFields.sysUL.v = v
        }
      },
    },
    mounted(){
      this.$store.dispatch(QUERY_BP_THRESHOLD,this.$route.params.id)
      this.$on(OPEN_DIALOG, e => this.visible = true)
    },
    methods: {
      onOpen(){
        for(let p in this.formFields){
          this.formFields[p].v = -1
        }
        let $msgLayouts = this.$refs.dialog.$el.querySelectorAll('.__input-layout-with-err-msg')
        for (let i = 0; i < $msgLayouts.length; i++) {
          triggerEvent($msgLayouts[i],'reset')
        }
      },
      onClose(){

      },
      cancel(){
        for(let p in this.formFields){
          this.formFields[p].v = -1
        }

        this.visible = false
      },


      async saveThreshold(){
        for (let p in this.formFields) {
          let msg = this.formFields[p].test(this.formFields[p].v)

          if (msg != ''&&this.formFields[p].v!=-1) {
            //console.log('表单校验失败')
            return ''
          }
        }
        const threshold = {
          id:this.bpState.threshold.id,
          diastolic: {
            upperLimit: this.diaUL,
            lowerLimit: this.diaLL,
            alert:this.bpState.threshold.diastolic.alert
          },
          // 收缩压
          systolic: {
            upperLimit: this.sysUL,
            lowerLimit: this.sysLL,
            alert:this.bpState.threshold.systolic.alert
          }
        }

        this.$store.dispatch(SAVE_BP_THRESHOLD, threshold)
        this.visible = false
        this.$root.$emit(EVT_THRESHOLD_CHANGED)
      },
      resetThreshold(){
        for(let p in this.formFields){
          this.formFields[p].v = -1
        }
        const dfThreshold = {
          id:this.bpState.threshold.id,
          systolic :{
            alert:1,
            upperLimit:140,
            lowerLimit:89
          },
          diastolic:{
            alert:1,
            upperLimit:90,
            lowerLimit:59
          }
        }
        this.$store.dispatch(SAVE_BP_THRESHOLD, dfThreshold)
      },
      toggleAlertConfig(){
        let threshold = this.bpState.threshold
        let oldOnOff = threshold.diastolic.alert
        let newOnOff = !!oldOnOff?0:1
        let doit=()=>{
          const newthreshold = {
            id:this.bpState.threshold.id,
            diastolic: {
              ...threshold.diastolic,
              alert:newOnOff
            },
            // 收缩压
            systolic: {
              ...threshold.systolic,
              alert:newOnOff
            }
          }

          this.$store.dispatch(SAVE_BP_THRESHOLD, newthreshold)
        }
        if(newOnOff==0){
          this.$alert('确定要关闭血压预警吗？','关闭血压预警',{
            confirmButtonText: '确定',
            callback:action=>{
              if(action=='confirm'){
                doit()
              }
            }
          })
        }else{
          doit()
        }

      },

    }
  }
  comp.NAME = name
  export default comp

</script>
