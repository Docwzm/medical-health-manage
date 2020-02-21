<style lang="less" scoped>
  @import "../../style.less";
</style>

<template>
    <div>

      <!-- 测量数据 搜索 添加 -->
      <div class="measureServer">
        <el-date-picker class="my-date-picker" type="daterange" v-model="search.mDateRange" placeholder="请选择时间区间"
                        style="width:242px;"></el-date-picker>
        <my-select style="width:242px;" class="source-select" v-model="search.source" placeholder="请选择数据来源">
          <my-option label="设备采集" :value="0"></my-option>
          <my-option label="手工添加" :value="1"></my-option>
          <my-option label="全部" :value="-1"></my-option>
        </my-select>
        <span class="se" v-html="img.holder" @click="getMeasureData(1)"></span>
        <my-button v-show="type === 'doctor'" style="width: 100px" type="primary" @click.native="bpFrom = !bpFrom">添加数据</my-button>
      </div>

      <!-- 测量数据列表 -->
      <div class="measureList">
        <!-- 医生 -->
        <my-table v-show="type === 'doctor'" :data="meLi" :row-style="markAbnormalRows" stripe>
          <my-table-column width="220px" label="测量时间" inline-template>
            <div class="fon">{{dateTimeFilter(row.measurementDate, 'YYYY-MM-DD HH:mm')}}</div>
          </my-table-column>
          <my-table-column width="250px" label="测量结果" inline-template>
            <div class="fon">
              <span v-show="row.systolicPressure">{{row.systolicPressure}}</span>
              <span v-show="row.diastolicPressure">/{{row.diastolicPressure}}<span class="cTips"
                                                                                   style="margin-right: 10px;">&nbsp;mmHg</span></span>
              <span v-show="row.heartRate">{{row.heartRate}}<span class="cTips">&nbsp;次/分</span></span>
              <span v-show="!row.systolicPressure && !row.diastolicPressure && !row.heartRate">未测量</span>
            </div>
          </my-table-column>
          <my-table-column width="120px" label="数据来源" inline-template>
            <div class="fon">{{dataSource(row.source)}}</div>
          </my-table-column>
          <my-table-column label="备注" inline-template>
            <div class="fon">{{row.remark}}</div>
          </my-table-column>
          <el-table-column width="110px" label="操作" inline-template>
            <div class="fon">
              <remarks :item="row" :patientId="Def.userId" @input="set"></remarks>
            </div>
          </el-table-column>
        </my-table>
        <!-- 管理员 -->
        <my-table v-show="type === 'admin'" :data="meLi" :row-style="markAbnormalRows" stripe>
          <my-table-column width="220px" label="测量时间" inline-template>
            <div class="fon">{{dateTimeFilter(row.measurementDate, 'YYYY-MM-DD HH:mm')}}</div>
          </my-table-column>
          <my-table-column width="250px" label="测量结果" inline-template>
            <div class="fon">
              <span v-show="row.systolicPressure">{{row.systolicPressure}}</span>
              <span v-show="row.diastolicPressure">/{{row.diastolicPressure}}<span class="cTips"
                                                                                   style="margin-right: 10px;">&nbsp;mmHg</span></span>
              <span v-show="row.heartRate">{{row.heartRate}}<span class="cTips">&nbsp;次/分</span></span>
              <span v-show="!row.systolicPressure && !row.diastolicPressure && !row.heartRate">未测量</span>
            </div>
          </my-table-column>
          <my-table-column width="120px" label="数据来源" inline-template>
            <div class="fon">{{dataSource(row.source)}}</div>
          </my-table-column>
          <my-table-column label="备注" inline-template>
            <div class="fon">{{row.remark}}</div>
          </my-table-column>
        </my-table>
        <div>
          <my-pagination style="text-align: right" @current-change="getMeasureData" :current-page="pagination.pageIndex"
                         layout="prev, pager, next, jumper"
                         :pageSize="pagination.pageSize" :total="pagination.totalRecord">
          </my-pagination>
        </div>
      </div>

      <!-- 添加数据弹窗 -->
      <my-dialog ref="dialog" class="my_dialog win622" v-model="bpFrom" title="添加血压数据">
        <my-form style="padding: 0 40px" :model="formFields" :rules="bpFromRules" ref="bpFrom"
                 label-position="left" label-width="80px">
          <my-item label="测量时间:" prop="measurementDate">
            <my-date-picker style="width: 160px" type="datetime" v-model="formFields.measurementDate"
                            :picker-options="datePickerOptions" slot="input"></my-date-picker>
          </my-item>
          <my-row>
            <my-col :span="10">
              <my-item label="收缩压:" prop="systolicPressure">
                <el-input style="width: 160px" class="my-input" v-model="formFields.systolicPressure" :maxlength="3">
                  <template slot="append">mmhg</template>
                </el-input>
              </my-item>
            </my-col>
            <my-col :span="10" :offset="3">
              <my-item label="舒张压:" prop="diastolicPressure">
                <el-input style="width: 160px" class="my-input" v-model="formFields.diastolicPressure" :maxlength="3">
                  <template slot="append">mmhg</template>
                </el-input>
              </my-item>
            </my-col>
          </my-row>
          <my-item label="脉搏:" prop="heartRate">
            <el-input class="my-input" style="width: 160px" v-model="formFields.heartRate" :maxlength="3">
              <template slot="append">次/分</template>
            </el-input>
          </my-item>
          <my-item label="备注:" prop="remark">
            <my-input v-model="formFields.remark" style="width:440px ;display: inline-block"
                      :maxlength="20"></my-input>
          </my-item>
        </my-form>
        <div class="dialog-footer">
          <el-button style="width: 100px" @click="cancel('bpFrom')">取消</el-button>
          <el-button style="width: 100px" type="primary" @click="addData('bpFrom')">保存</el-button>
        </div>
      </my-dialog>

    </div>
</template>

<script>
  // components
  import MsPopover from '../../../../../../../components/common/popover/msPopover.vue'
  import MyTable from '../../../../../../../components/common/table/MyTable'
  import MyTableColumn from '../../../../../../../components/common/table/MyTableColumn'
  import MyPagination from '../../../../../../../components/common/pagination/MyPagination'
  import {MyRow, MyCol} from '../../../../../../../components/common/layout'
  import MyButton from '../../../../../../../components/common/button/MyButton'
  import MyForm from '../../../../../../../components/common/form/MyForm'
  import MyInput from '../../../../../../../components/common/input/MyInput'
  import MyItem from '../../../../../../../components/common/form/MyItem'
  import MySelect from '../../../../../../../components/common/select/MySelect'
  import MyOption from '../../../../../../../components/common/select/MyOption'
  import MyDatePicker from '../../../../../../../components/common/date/MyDatePicker'
  import MyDialog from '../../../../../../../components/common/modal/MyDialog'
  import remarks from '../../../../../../../components/common/popover/remarks.vue'

  // filters
  import {
    dateTimeFilter,
    dataSource,
  } from '../../../../../../../filters'
  import rules from '../../rules'

  // API
  import {getMeasureDataApi} from '../../../../../../../api/abnormal'
  import {addBpRecordApi} from '../../../../../../../api/bp'

  // actionss
  import actions from '../../actions'
  // getters
  import {paramsGetter, queryGetter} from '../../../../../../../store/getters/route'
  import router from '../../../../../../../router'
  // mutations
  import {MUTATION_NAME} from '../../mutations'

  export default{
    props: {
      type: {
        type: [String, Number],
        default: 'admin'
      },
    },
    data () {
      return {
        bpFrom: false,
        meLi: [],
        formFields: {
          measurementDate: '',
          diastolicPressure: '',
          systolicPressure: '',
          heartRate: '',
          remark: ''
        },
        datePickerOptions: {
          disabledDate(d){
            let today = new Date()
            today.setHours(23)
            today.setMinutes(59)
            today.setSeconds(59)
            return d > today
          }
        },
        search: {
          source: null,
          mDateRange: []
        },
        pagination: {
          pageIndex: 1,
          pageSize: 5,
          totalRecord: 5
        },
        img: {
          holder: require('!!raw!../../../../../../../../static/assets/icon-search.svg'),
        },
      }
    },
    components: {
      MsPopover,
      MyTable,
      MyTableColumn,
      MyPagination,
      MyDatePicker,
      MyButton,
      MyRow,
      MyCol,
      MyInput,
      MyForm,
      MyItem,
      MySelect,
      MyOption,
      MyDialog,
      remarks,
    },
    computed: {
      ...rules,
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      }
    },
    watch:{
      Def () {
        this.init()
      }
    },
    methods: {
      dateTimeFilter,
      dataSource,
      ...actions,
      async init () {
        await this.getMeasureData()
      },
      set (v) {
        if (v) {
          this.getMeasureData()
        }
      },
      async getMeasureData (p) {
        const {userId} = this.Def
        if (!userId) return
        const {page} = queryGetter(this.$store.state)
        let tPage = (typeof p === "object" ? p.page : p) || page
        let {mDateRange, source} = this.search
        let begin = mDateRange[0] && mDateRange[0].getTime() || ''
        let end = mDateRange[1] && mDateRange[1].getTime() || ''
        const {data, pageIndex, pageSize, totalRecord} = await getMeasureDataApi({
          userId,
          pageIndex: tPage,
          pageSize: this.pagination.pageSize,
          begin,
          end,
          source: source || (source === 0 ? 0 : -1)
        })
        this.meLi = data
        this.pagination = {...this.pagination, pageIndex: tPage, pageSize, totalRecord}
        tPage === 1 && router.replace({query: {...router.history.current.query, page: 1}})
      },
      addData (formName) {
        this.submitForms(formName, async () => {
          await addBpRecordApi({...this.formFields, 'patientId': this.Def.userId})
          this.formFields = {measurementDate: '', diastolicPressure: '', systolicPressure: '', heartRate: '', remark: ''}
          this.init()
        }, '添加数据')
      }
    },
    created () {
    },
    mounted () {
      if (this.Def) {
        this.getMeasureData()
      }
    },
    destroyed () {
    }
  }
</script>
