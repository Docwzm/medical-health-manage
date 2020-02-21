<style lang="less" scoped>
</style>

<template>
  <span>
    <my-popover
            ref="names" class="my_popover"
            placement="left-start"
            width="500"
            v-model="showRemarks">
      <div class="remarkTitle" style="border-bottom: 1px solid #e0e6ed; padding: 40px 0 10px;line-height: 1;font-size: 16px;font-weight: 400;">
        <span class="left">添加备注</span>
      </div>
      <my-form :model="item" label-width="100px" label-position="left">
          <my-input style="padding: 40px 30px;box-sizing: border-box;" v-model="remark" placeholder="请填写备注" :maxlength="20" v-if="isbp"></my-input>
         <my-input style="padding: 40px 30px;box-sizing: border-box;" v-model="remark" placeholder="请填写备注" :maxlength="40" v-if="!isbp"></my-input>
        <div style="padding-bottom: 40px;width: 100%; text-align: center">
          <my-button @click="cancel">取 消</my-button>
          <my-button type="primary" @click="editRemarks" v-if="isbp">确 定</my-button>
          <my-button type="primary" @click="editRemarksTemperature" v-if="!isbp">确 定</my-button>
        </div>
      </my-form>
    </my-popover>

    <span>
       <span @click="set" style="color: #4db3ff;cursor: pointer;font-size: 13px" v-popover:names>备注</span>
      <!--&nbsp;<span v-show="item.source !== 0" style="color: rgb(229, 233, 242);">|</span>&nbsp;-->
      <span v-show="item.source !== 0" style="color: #000;cursor: pointer;font-size: 13px" @click="delRemarks" v-if="isbp">删除</span>
    </span>
  </span>
</template>

<script type="text/babel">
  import MyForm from '../form/MyForm'
  import MyItem from '../form/MyItem'
  import MyButton from '../button/MyButton'
  import MyPopover from './MyPopover'
  import MyInput from '../input/MyInput'
  import {showConfirm} from '../../../store/actions/confirm'

  // api
  import {setBpRecordApi, delBpRecordApi} from '../../../api/bp'
  import {updateRecordApi} from '../../../api/temperature'

  export default {
    name: 'remarksPopover',
    data() {
      return {
        showRemarks: false,
        remark: ''
      }
    },
    props: {
      item: {
        type: Object,
//        default: ''
      },
      patientId: {
        type: Number,
//        default: ''
      },
      isbp: {
        type: Boolean,
        default: true,
      }
    },
    mounted () {
      this.remark = this.item.remark || ''
    },
    watch: {
    },
    computed: {
      names () {
        const page = this.$route.query.page
        return `rm_${this.item.id}_${page}`
      }
    },
    methods: {
      set () {
        this.remark = this.item.remark || ''
      },
      async editRemarks () {
        await setBpRecordApi({...this.item, 'remark': this.remark, 'patientId': this.patientId}).then(() => {
          this.cancel()
          this.$emit('input', 1)
        })
      },
      async editRemarksTemperature () {
        await updateRecordApi({...this.item, 'remark': this.remark}).then(() => {
          this.cancel()
          this.$emit('input', 1)
        }).catch((res) => {
          this.$notify.error({
            title: '错误',
            message: res.msg
          });
        })
      },
      delRemarks () {
        const id = this.item.id
        showConfirm('确定要删除该条记录吗?', '删除血压记录').then(async () => {
          await delBpRecordApi(id)
          this.$emit('input', 1)
          showAlert('删除成功!')
//          getMeasureData(store, this)
        })
      },
      cancel () {
        this.showRemarks = !this.showRemarks
      }
    },
    components: {
      MyForm,
      MyButton,
      MyItem,
      MyPopover,
      MyInput,
    },
//    destroyed () {
//      this.remark = ''
//    }
  }
</script>
