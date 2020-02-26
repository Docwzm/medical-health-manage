<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./stylFunc.styl"
  .customer-bp-list-view
    position relative
    padding-bottom 40px
    min-height 800px
  .query-form-line-wrapper
    position relative
    margin-top  20px
    padding 0 20px
    padding-left 0
    padding-bottom 20px
    border-bottom 1px solid #e5e9f2
  .btn-bp-desc
    position: absolute
    right 0
    border none
    top 8px
    color #20a0ff
  .icon-bp-desc
    width 16px
    height 16px
    vertical-align middle
    display inline-block
    background url(./assets/icon-explain-blood-pressure.svg) no-repeat

  .bp-desc-box
    borderPointer(494px,-6px,10px,#c0ccda)
    overflow visible
    font-size 14px
    z-index 101
    position absolute
    width 500px
    right 10px
    top 40px
    border 1px solid #c0ccda
    padding 10px
    border-radius 3px
    background #fff
    p,ul
      padding 20px
    ul
      list-style none
    li
      margin-bottom 10px
    li:before
      content '•'

  .bp-desc-hd
    padding 10px
    border-bottom 1px solid darkgray
  .btn-hide-desc
    float right
    color blue
    cursor pointer

  .pager-wrapper
    position absolute
    bottom 0
    right 0
    //padding 20px
</style>
<style lang="stylus" rel="stylesheet/stylus" >
@import "./stylFunc.styl"
.customer-bp-list-view
  .remark-input
    width 450px
    display block
    margin auto
  .set-remark-dialog
    z-index 2000
    transform none
    display none
    borderPointer(482px,-7px,10px,rgba(0,0,0,.1))
    min-width auto
    .form-line
      margin-top 0
    .el-input
      padding 40px 30px 40px 30px
    .el-dialog__body
      padding 0
      margin 0
    .el-dialog__footer
      padding 0
      padding-bottom 40px
    //&:after
      //box-shadow  1px -1px 1px 0 rgba(0,0,0,.3)
      //top  -4px
    //.el-dialog__wrapper
    //  overflow visible
  .my_table .el-table__body-wrapper .cell
    height auto
    line-height 24px
  .my_table
    td,tr
      border none !important
</style>
<template>
  <div class="customer-bp-list-view" ref="container">
    <!--<svg style="display: none">-->
      <!--<symbol v-html="bpDescIcon" id="icon-bp-desc"></symbol>-->
    <!--</svg>-->
    <div class="query-form-line-wrapper">
      <query-form></query-form>
      <a href="#"
        @click.stop.prevent="toggleBpDesc"
        class="btn-bp-desc"
      >
        <!--<svg class="icon-bp-desc">-->
          <!--<use xlink:href="#icon-bp-desc"></use>-->
        <!--</svg>-->
        <span class="icon-bp-desc" >
        <!---->
      </span>
        血压说明

      </a>
      <div
        class="bp-desc-box" v-show="bpDescVisible"

      >

        <p>血压是指血管内的血液在单位面积上的侧压力，即压强，习惯以毫米汞柱为单位。</p>
        <p>心脏有收缩及放松期，当心脏收缩，左心室便会将血液泵出到主动脉，主动脉压产生最高血压，又称收缩压。</p>
        <p>接下来，心脏会舒张，血液流入右心房，这个时候压力最低，称为低血压或舒张压。</p>
        <ul>
          <li>
            正常血压：<br>
            收缩压 90mmHg～119 mmHg<br>
            舒张压 60 mmHg～79 mmHg
          </li>
          <li>
            低血压：<br>
            收缩压 <90 mmHg<br>
            舒张压 <90 mmHg
          </li>
          <li>
            正常高值：<br>
            收缩压 120mmHg～139 mmHg<br>
            舒张压 80 mmHg～89 mmHg
          </li>
          <li>
            轻度高血压<br>
            收缩压 140mmHg～159 mmHg<br>
            舒张压 90 mmHg～99 mmHg
          </li>
          <li>
            中度高血压<br>
            收缩压 160mmHg～179 mmHg<br>
            舒张压 100 mmHg～109 mmHg
          </li>
          <li>
            高度高血压<br>
            收缩压 ≥180 mmHg<br>
            舒张压 ≥110 mmHg
          </li>
        </ul>
      </div>
    </div>
    <div class="query-form-line-wrapper">
      <my-button @click="addBpItem">添加数据</my-button>
    </div>


    <my-table
      v-loading.body="tableData==null"
      :data="tableData"
      stripe="true"

      :row-style="markAbnormalRows"
      style="margin: auto">
      <column
        prop="date"
        label="测量时间"
        >
      </column>
      <column

        label="测量结果"
        width="150"
        inline-template
      >
        <span >
         {{row.measurement}}
        </span>
      </column>
      <column
        prop="from"
        width="110"
        label="数据来源">
      </column>
      <column

        prop="remark"
        label="备注">
      </column>
      <column
        label="操作"
        :context="_self"
        inline-template
        width="130"
      >
        <span>
        <el-button @click="setRemark(row,$index,$event)" type="text" >备注</el-button>
        <span v-if="row.origin.source==1" style="color:#e5e9f2">|</span>
        <el-button @click="removeItem(row)" type="text"
                   style="color:red" :style="{'visibility':row.origin.source==1?'visible':'hidden'}"
        >删除</el-button>
      </span>
      </column>
    </my-table>
    <div class="pager-wrapper" v-show="pageCount&&pageCount>0">
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="pageCount"
        @current-change="onChangePage"
        :current-page="pageIndex"
      >
      </el-pagination>
    </div>
  <!--dialogs-->
    <div class="el-dialog el-dialog--small set-remark-dialog" ref="setRemarkDialog"
         >
      <div class="el-dialog__header"><span class="el-dialog__title">添加备注</span>
        <div class="el-dialog__headerbtn"><!----></div>
      </div>
      <div class="el-dialog__body">
        <div class="form-line">
          <el-input
            style="width:400px"
            v-model="remarkContent"
            :maxlength="20"
          ></el-input>
        </div>
      </div>
      <div class="el-dialog__footer">
        <span data-v-13ffed91="" class="dialog-footer">
          <el-button @click="dismissRemarkDialog">取 消</el-button>
          <el-button type="primary" @click="saveRemark">确 定</el-button>
        </span>
      </div>
    </div>


    <!--<el-dialog-->
      <!--ref="setRemarkDialog"-->
      <!--:modal="false"-->
      <!--:show-close="false"-->
      <!--:custom-class="'set-remark-dialog'"-->
      <!--:lock-scroll="true"-->
      <!--title="添加备注" v-model="remarkPopupVisible" >-->
      <!--<div class="form-line">-->
        <!--<el-input-->
          <!--style="width:400px"-->
          <!--v-model="remarkContent"-->
          <!--:maxlength="20"-->
        <!--&gt;</el-input>-->
      <!--</div>-->

      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="remarkPopupVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="saveRemark">确 定</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->
    <add-bp-item-popup ref="addBpItemPopup"></add-bp-item-popup>
  </div>
</template>
<script type="text/babel">
  import QueryForm from './QueryForm.vue'
  import MyButton from '../../../../../components/common/button/MyButton'
  import MyTable from '../../../../../components/common/table/MyTable'
  import Column from '../../../../../components/common/table/MyTableColumn'
  import AddBpItemPopup from  './AddBpItemPop.vue'
  import {
    REMOVE_BP_ITEM,
    QUERY_BP_LIST,
    STORE_NAME,
    SAVE_BP_REMARK,
    OPEN_DIALOG
  } from './constants'

  export default {
    components: {
      AddBpItemPopup,
      QueryForm,
      MyButton,
      MyTable,
      Column,
    },
    data () {
      return {
        bpDescVisible: false,
        remarkPopupVisible: false,
        remarkingItem: null,
        remarkContent: '',

        //bpDescIcon: require('!raw-loader!!./assets/icon-explain-blood-pressure.svg')
      }
    },
    computed: {

      tableData () {
        if (this.bpState.listViewData == null) {
          return null
        } else {
          return this.bpState.listViewData.map(e => this.toListViewModel(e))
        }
      },
      pageCount () {
        return (this.bpState.listViewQuery?parseFloat(this.bpState.listViewQuery.totalPage):1)*10
      },
      bpState () {
        return this.$store.state[STORE_NAME]
      },
      pageIndex(){
        // console.log('123456')
        if(this.bpState.listViewQuery){
          return this.bpState.listViewQuery.pageIndex
        }else{
          return 1
        }
      },
      userId(){
        let generalInfo = this.$store.state['views-customer-info-left']
        if(generalInfo&&generalInfo.info&&generalInfo.info.idNO){
          return generalInfo.info.idNO
        }else{
          return -1
        }
      },
    },
    mounted () {

      document.removeEventListener('click',this.hideBpDescBox)
      document.addEventListener('click',this.hideBpDescBox)
      // this.$on(CLOSE_DIALOG, () => this.remarkPopupVisible = false)
    },
    methods: {
      toggleBpDesc(){

        this.bpDescVisible=!this.bpDescVisible
      },
      hideBpDescBox(){
        this.bpDescVisible = false
      },
      markAbnormalRows(row,index){
        //todo  row.origin.level
        let color = 'inherit'
        if(row.origin. diastolicPressure<60
          ||row.origin. systolicPressure<90){
          color = '#FF9404'
        }

        if(row.origin. diastolicPressure<=99&&row.origin. diastolicPressure>=90
          ||row.origin. systolicPressure<=159&&row.origin. systolicPressure>=140){
          color = '#FF9404'
        }
        if(row.origin. diastolicPressure<=109&&row.origin. diastolicPressure>=100
          ||row.origin. systolicPressure<=179&&row.origin. systolicPressure>=160){
          color = '#FF4949'
        }
        if(row.origin. diastolicPressure>=109
          ||row.origin. systolicPressure>=180){
          color = '#FF4949'
        }
        return {
          color
        }

      },
      addBpItem(){

        this.$refs.addBpItemPopup.$emit(OPEN_DIALOG)
      },
      dismissRemarkDialog(){
        this.$refs.setRemarkDialog.style.setProperty('display','none')
      },
      onChangePage(pageIndex){
        //todo
        this.$store.dispatch(QUERY_BP_LIST, {
          propName: 'listViewData',
          query: {pageIndex}
        })
      },

      removeItem (rowData) {
        this.$alert('确定要删除该条记录吗', '删除血压记录', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              this.$store.dispatch(REMOVE_BP_ITEM, rowData)
            }
//            this.$message({
//              type: 'info',
//              message: `action: ${ action }`
//            });
          }
        })
      },
      setRemark (rowData,idx,evt) {
        //set dialog position

        let $dialog = this.$refs.setRemarkDialog
        let $container = this.$refs.container
        // console.log(evt)
        setTimeout(()=>{
          $dialog.style.display = 'block'
          $dialog.style.left = (evt.clientX-$container.getBoundingClientRect().left-$dialog.getBoundingClientRect().width+12)+'px'
          $dialog.style.top = (evt.clientY-$container.getBoundingClientRect().top+20)+'px'
        },10)
        this.remarkPopupVisible = true
        this.remarkingItem = rowData
        this.remarkContent = rowData.remark
      },
      async saveRemark(){
        await this.$store.dispatch(SAVE_BP_REMARK, {
          newRemark: this.remarkContent,
          item: this.remarkingItem,
          patientId:this.$store.getters.userId,
        })
        this.dismissRemarkDialog()
      },

      toListViewModel (item) {
        const d = new Date(item.measurementDate)
        return {
          date: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.toTimeString().substr(0, 5)}`,

          measurement: `${item.systolicPressure}/${item.diastolicPressure}mmHg`,
          from: item.source === 0 ? '设备采集' : '人工添加',
          remark: item.remark,
          origin: item
        }
      }
    }
  }
</script>
