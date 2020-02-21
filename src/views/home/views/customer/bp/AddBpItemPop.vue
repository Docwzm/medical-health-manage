<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
<style lang="stylus" rel="stylesheet/stylus">

</style>
<template>
  <el-dialog
    ref="dialog"
    :show-close="false"
    v-model="visible"
    :custom-class="'bp-add-item-dialog'"
    class="dialog"
    @close="onClose"
    @open="onOpen"
    title="添加血压数据"
  >
    <el-form ref="form">

      <div class="form-line">
        <span class="form-line-title">测量时间</span>
        <input-with-error-layout
          :field-config="formFields.measurementDate"
        >
          <el-date-picker
            ref="dPicker"
            type="datetime"
            v-model="formFields.measurementDate.v"
            :picker-options="datePickerOptions"
            slot="input"
            @input="dateChangeHelper"
          ></el-date-picker>

        </input-with-error-layout>

      </div>
      <div class="form-line">
        <span class="form-line-title">舒张压</span>
        <input-with-error-layout
          :field-config="formFields.diastolicPressure"
        >
          <el-input slot="input"
            v-model="formFields.diastolicPressure.v"
          >
            <template slot="append">mmhg</template>
          </el-input>
        </input-with-error-layout>
        <span style="margin-left: 35px;margin-right: 15px">收缩压</span>
        <input-with-error-layout
          :field-config="formFields.systolicPressure"
          >
          <el-input slot="input"
            v-model="formFields.systolicPressure.v"
          >
            <template slot="append">mmhg</template>
          </el-input>
        </input-with-error-layout>
      </div>
      <div class="form-line">
        <span class="form-line-title">脉搏</span>
        <input-with-error-layout
          :field-config="formFields.heartRate"
        >
          <el-input slot="input"

            v-model="formFields.heartRate.v"
          >
            <template slot="append">次/分</template>
          </el-input>
        </input-with-error-layout>
      </div>
      <div class="form-line">
        <span class="form-line-title">备注</span>
        <el-input
          v-model="remark"
          style="width:462px ;display: inline-block"
          :maxlength="20"
        ></el-input>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="addBpItem">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/babel">
  import {
    OPEN_DIALOG,
    STORE_NAME,
    ADD_BP_ITEM,
    QUERY_BP_LIST
  } from './constants'
  import InputWithErrorLayout from './InputWithErrorLayout.vue'
  import {triggerEvent,mapObject} from './utils'
  export default{
    components: { InputWithErrorLayout},
    data(){
      return {
        visible: false,
        formFields:{
          measurementDate:{
            width:180,
            v:'',
            test(v){
              if(!v||v==''){
                return '请输入测量日期'
              }else{
                return ''
              }
            },
            events:['blur','input'],
          },
          diastolicPressure:{
            width:180,
            v:'',
            test(v){
              if(!isNaN(v)&&v<=130&&v>=30){
                return ''
              }else{
                return '请输入30-130的数值'
              }
            },
            events:['blur'],
          },
          systolicPressure:{
            width:180,
            v:'',
            test(v){
              if(!isNaN(v)&&v<=200&&v>=60){
                return ''
              }else{
                return '请输入60-200的数值'
              }
            },
            events:['blur'],
          },
          heartRate:{
            width:180,
            v:'',
            test(v){
              if(!isNaN(v)&&v<=120&&v>=40){
                return ''
              }else{
                return '请输入40-120的数值'
              }
            },
            events:['blur'],
          }

        },
        remark:'',
        datePickerOptions:{
          disabledDate(d){
            let today = new Date()
            today.setHours(23)
            today.setMinutes(59)
            today.setSeconds(59)
            return d>today
          }
        },

      }
    },
    computed:{

    },
    methods: {
      dateChangeHelper(evt){
        setTimeout(()=>        triggerEvent(this.$refs.dPicker.$el.querySelector('input'),'input')
        ,50)

      },
      onOpen(){
        let $msgLayouts = this.$refs.dialog.$el.querySelectorAll('.__input-layout-with-err-msg')
        for (let i = 0; i < $msgLayouts.length; i++) {
          triggerEvent($msgLayouts[i],'reset')
        }
      },
      onClose(){
        for (let p in this.formFields) {
          this.formFields[p].v = ''
        }
        this.remark = ''
//        setTimeout(()=>{
//          let $inputs = this.$refs.dialog.$el.querySelectorAll('input')
//          for(let i = 0;i<$inputs.length;i++){
//            triggerEvent($inputs[i],'input')
//          }
//        },100)


      },

      async addBpItem(){
        let $inputs = this.$refs.form.$el.querySelectorAll('input')
        for(let i = 0;i<$inputs.length;i++){
          triggerEvent($inputs[i],'blur')
        }
        for (let p in this.formFields) {
          let msg = this.formFields[p].test( this.formFields[p].v)

          if (msg != '') {
            //console.log('表单校验失败')
            return ''
          }
        }
        //todo check fields
        //let measurementDate = this.uInput.measurementDate.getTime()
//        console.log(mapObject(this.formFields,(k,v)=>{
//          console.log([k,v.v])
//          return [k,v.v]
//        }))
        await this.$store.dispatch(ADD_BP_ITEM,{
          patientId:this.$store.getters.userId,
          ...{...mapObject(this.formFields,(k,v)=>{

            return [k,v.v]
          }),remark:this.remark}
        })

        this.visible = false
        this.$store.dispatch(QUERY_BP_LIST,{
          propName:'listViewData'
        })
      }
    },
    mounted(){
      this.$on(OPEN_DIALOG, e => this.visible = true)

    },
  }
</script>
