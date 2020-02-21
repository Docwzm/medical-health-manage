<style lang="less" scoped>
  @import "../../style.less";
</style>

<template>
  <div>
    <!-- 测量数据 搜索 添加 -->
    <div class="measureServer" style="padding-top:30px;">
      <el-date-picker class="my-date-picker" type="daterange" v-model="search.mDateRange" placeholder="请选择时间区间"
                      style="width:242px;"></el-date-picker>
      <my-select style="width:242px;" class="source-select" v-model="search.source" placeholder="请选择数据来源">
        <my-option label="设备采集" :value="0"></my-option>
        <my-option label="手工添加" :value="1"></my-option>
        <my-option label="全部" :value="-1"></my-option>
      </my-select>
      <span class="se" v-html="img.holder" @click="getList(1)"></span>
      <my-button v-show="type === 'doctor'" style="width: 100px" type="primary" @click.native="addToop">添加数据</my-button>
    </div>

    <!-- 测量数据列表 -->
    <div class="measureList">
      <my-table :data="meLi" stripe>
        <my-table-column width="210px" label="测量时间" inline-template>
          <div class="fon">{{row.date}}</div>
        </my-table-column>
        <my-table-column width="100px" label="空腹" inline-template>
          <div @click="setToop(row.fasting)" :class="liClass(row.fasting)">
            <my-tooltip v-show="row.fasting && row.fasting.memo" placement="top" :content="row.fasting && row.fasting.memo">
              <span>{{row.fasting && row.fasting.glucoseConcentration}}</span>
            </my-tooltip>
            <div v-show="row.fasting && !row.fasting.memo">{{row.fasting && row.fasting.glucoseConcentration}}</div>
            <div v-show="!row.fasting">--</div>
          </div>
        </my-table-column>
        <my-table-column width="100px" label="早餐后" :show-overflow-tooltip="true" inline-template>
          <div @click="setToop(row.afBreakfast)" :class="liClass(row.afBreakfast)">
            <my-tooltip v-show="row.afBreakfast && row.afBreakfast.memo" placement="top" :content="row.afBreakfast && row.afBreakfast.memo">
              <span>{{row.afBreakfast && row.afBreakfast.glucoseConcentration}}</span>
            </my-tooltip>
            <div v-show="row.afBreakfast && !row.afBreakfast.memo">{{row.afBreakfast && row.afBreakfast.glucoseConcentration}}</div>
            <div v-show="!row.afBreakfast">--</div>
          </div>
        </my-table-column>
        <my-table-column width="100px" label="午餐前" inline-template>
          <div @click="setToop(row.beLunch)" :class="liClass(row.beLunch)">
            <my-tooltip v-show="row.beLunch && row.beLunch.memo" placement="top" :content="row.beLunch && row.beLunch.memo">
              <span>{{row.beLunch && row.beLunch.glucoseConcentration}}</span>
            </my-tooltip>
            <div v-show="row.beLunch && !row.beLunch.memo">{{row.beLunch && row.beLunch.glucoseConcentration}}</div>
            <div v-show="!row.beLunch">--</div>
          </div>
        </my-table-column>
        <my-table-column width="100px" label="午餐后" inline-template>
          <div @click="setToop(row.afLunch)" :class="liClass(row.afLunch)">
            <my-tooltip v-show="row.afLunch && row.afLunch.memo" placement="top" :content="row.afLunch && row.afLunch.memo">
              <span>{{row.afLunch && row.afLunch.glucoseConcentration}}</span>
            </my-tooltip>
            <div v-show="row.afLunch && !row.afLunch.memo">{{row.afLunch && row.afLunch.glucoseConcentration}}</div>
            <div v-show="!row.afLunch">--</div>
          </div>
        </my-table-column>
        <my-table-column width="100px" label="晚餐前" inline-template>
          <div @click="setToop(row.beDinner)" :class="liClass(row.beDinner)">
            <my-tooltip v-show="row.beDinner && row.beDinner.memo" placement="top" :content="row.beDinner && row.beDinner.memo">
              <span>{{row.beDinner && row.beDinner.glucoseConcentration}}</span>
            </my-tooltip>
            <div v-show="row.beDinner && !row.beDinner.memo">{{row.beDinner && row.beDinner.glucoseConcentration}}</div>
            <div v-show="!row.beDinner">--</div>
          </div>
        </my-table-column>
        <my-table-column width="100px" label="晚餐后" inline-template>
          <div @click="setToop(row.afDinner)" :class="liClass(row.afDinner)">
            <my-tooltip v-show="row.afDinner && row.afDinner.memo" placement="top" :content="row.afDinner && row.afDinner.memo">
              <span>{{row.afDinner && row.afDinner.glucoseConcentration}}</span>
            </my-tooltip>
            <div v-show="row.afDinner && !row.afDinner.memo">{{row.afDinner && row.afDinner.glucoseConcentration}}</div>
            <div v-show="!row.afDinner">--</div>
          </div>
        </my-table-column>
        <my-table-column width="" label="睡前" inline-template>
          <div @click="setToop(row.beSleep)" :class="liClass(row.beSleep)">
            <my-tooltip v-show="row.beSleep && row.beSleep.memo" placement="top" :content="row.beSleep && row.beSleep.memo">
              <span>{{row.beSleep && row.beSleep.glucoseConcentration}}</span>
            </my-tooltip>
            <div v-show="row.beSleep && !row.beSleep.memo">{{row.beSleep && row.beSleep.glucoseConcentration}}</div>
            <div v-show="!row.beSleep">--</div>
          </div>
        </my-table-column>
      </my-table>
      <div>
        <my-pagination style="text-align: right" @current-change="getList" :current-page="pagination.pageIndex"
                       layout="prev, pager, next, jumper"
                       :pageSize="pagination.pageSize" :total="pagination.totalRecord">
        </my-pagination>
      </div>
    </div>

    <!-- 添加数据弹窗 -->
    <my-dialog :class="{'win622': type === 'doctor', 'win520': type === 'admin'}" v-model="bsFrom" :title="`${type === 'doctor'?(setBs?'编辑':'添加'):'查看'}血糖数据`">
      <my-form style="padding: 0 40px" :model="formFields" :rules="bsFromRules" ref="bsFrom"
               label-position="left" label-width="80px">
        <div v-if="type === 'doctor'">
          <my-item label="测量时间:" prop="measurementDate">
            <my-date-picker v-show="!setBs" style="width: 160px" type="datetime" v-model="formFields.measurementDate"
                            :picker-options="datePickerOptions" slot="input"></my-date-picker>
            <div v-show="setBs">{{dateTimeFilter2(formFields.measurementDate)}}</div>
          </my-item>
          <my-item label="测量结果:" prop="glucoseConcentration">
            <el-input v-show="!setBs" style="width: 160px" class="my-input" v-model="formFields.glucoseConcentration" :maxlength="4">
              <template slot="append">mmol/L</template>
            </el-input>
            <div v-show="setBs">{{formFields.glucoseConcentration}} mmol/L <span :class="{'sourceSty1': formFields.source === 0, 'sourceSty2': formFields.source === 1}">{{dataSource(formFields.source)}}</span></div>
          </my-item>
          <my-item class="mLine" label="测量状态" prop="mealPeroid">
            <check-button :disabled="formFields.source === 0" :buttons="bsTabs" v-model="formFields.mealPeroid"></check-button>
          </my-item>
          <my-item label="备注:" prop="memo">
            <my-input v-model="formFields.memo" style="width:440px ;display: inline-block"
                      :maxlength="50"></my-input>
          </my-item>
          <div v-show="formFields.source === 1" class="delSty"><span @click="delData(formFields.id)">删除血糖数据</span></div>
        </div>

        <div v-if="type === 'admin'" style="margin: 0 60px">
          <my-item label="测量时间:" prop="measurementDate">
            {{dateTimeFilter2(formFields.measurementDate)}}
          </my-item>
          <my-item label="测量结果:" prop="glucoseConcentration">
            <div>{{formFields.glucoseConcentration}} mmol/L <span :class="{'sourceSty1': formFields.source === 0, 'sourceSty2': formFields.source === 1}">{{dataSource(formFields.source)}}</span></div>
          </my-item>
          <my-item class="verTop" label="备注:" prop="memo" style="height: 40px">
            <div style="padding-top: 9px;text-overflow: ellipsis; overflow: hidden; word-break: break-all; white-space: normal; line-height: 18px;">{{formFields.memo}}</div>
          </my-item>
        </div>

      </my-form>
      <div class="dialog-footer">
        <el-button v-if="type === 'admin'" style="width: 100px" @click="cancel('bsFrom')">返回</el-button>
        <el-button v-if="type === 'doctor'"  style="width: 100px" @click="cancel('bsFrom')">取消</el-button>
        <el-button v-if="type === 'doctor'" style="width: 100px" type="primary" @click="addData('bsFrom')">保存</el-button>
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
  import MyButton from '../../../../../../../components/common/button/MyButton'
  import MyForm from '../../../../../../../components/common/form/MyForm'
  import MyInput from '../../../../../../../components/common/input/MyInput'
  import MyItem from '../../../../../../../components/common/form/MyItem'
  import MySelect from '../../../../../../../components/common/select/MySelect'
  import MyOption from '../../../../../../../components/common/select/MyOption'
  import MyDatePicker from '../../../../../../../components/common/date/MyDatePicker'
  import MyDialog from '../../../../../../../components/common/modal/MyDialog'
  import MyTooltip from '../../../../../../../components/common/tooltip/MyTooltip'

  import checkButton from '../../../../../../../components/common/checkbox/checkButton.vue'

  import {showAlert} from '../../../../../../../store/actions/alert'
  import {showConfirm} from '../../../../../../../store/actions/confirm'

  // filters
  import {
    dateTimeFilter,
    dataSource,
    dateFilter, dateTimeFilter2,
  } from '../../../../../../../filters'
  import rules from '../../rules'

  // API
  import {
    getPeroidLastApi,
    addPeroidLastApi,
    setPeroidLastApi,
    delPeroidLastApi
  } from '../../../../../../../api/datachart'

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
        bsFrom: false,
        meLi: [],
        bsTabs: [
          {name: '空腹', key: 0},
          {name: '早餐后', key: 1},
          {name: '午餐前', key: 2},
          {name: '午餐后', key: 3},
          {name: '晚餐前', key: 4},
          {name: '晚餐后', key: 5},
          {name: '睡前', key: 6},
        ],
        formFields: {
          measurementDate: '',
          glucoseConcentration: '',
          mealPeroid: 0,
          memo: ''
        },
        setBs: false,
        datePickerOptions: {
          disabledDate(d){
            let today = new Date().getTime()
//            today.setHours(23)
//            today.setMinutes(59)
//            today.setSeconds(59)
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
      MyInput,
      MyForm,
      MyItem,
      MySelect,
      MyOption,
      MyDialog,
      MyTooltip,
      checkButton,
    },
    computed: {
      ...rules,
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
    },
    watch: {
      Def () {
        this.getList()
      },
    },
    methods: {
      dateTimeFilter,
      dateFilter, dateTimeFilter2,
      dataSource,
      ...actions,
      liClass (v) {
        return {
          'fon': true,
          'tip': v && v.memo,
          'highColor': v && v.level > 2,
          'lowColor': v && v.level < 2,
          'normalColor': v && v.level === 2
        }
      },
      setName (key) {
        return {
          0: 'fasting',
          1: 'afBreakfast',
          2: 'beLunch',
          3: 'afLunch',
          4: 'beDinner',
          5: 'afDinner',
          6: 'beSleep'
        }[key]
      },
      fles (dada, time) { // 按年月日分类，去重 排序
        const newArr = [] // 结果
        const soArr = new Array(...new Set(dada.map(d => dateFilter(d[time])))).map((n) => (new Date(n)).getTime()) // 转换成年份去重 毫秒数排序
        soArr.sort((a, b) => b - a).filter(t => {
          const list = dada.filter(da => dateFilter(t) === dateFilter(da[time]))
          let obs = {}
          list.forEach(item => {
            obs[`${this.setName(item.mealPeroid)}`] = item
          })
          return newArr.push({...{'date': dateFilter(t), ...obs}})
        })
        return newArr
      },
      async getList (pageIndex) {
//        userId, startTime, endTime, source, pageNo, pageSize = 1
        const {userId} = this.Def
        if (!userId) return
        const {page, pageSize} = queryGetter(this.$store.state)
        let pageNo = (typeof pageIndex === "object" ? pageIndex.page : pageIndex) || page
        let {mDateRange, source} = this.search
        let startTime = mDateRange[0] && mDateRange[0].getTime() || ''
        let endTime = mDateRange[1] && mDateRange[1].getTime() || ''
        const {list, total} = await getPeroidLastApi({userId, pageNo, pageSize, source: source === -1?'':source, startTime, endTime}) || {}
        this.pagination = {...this.pagination, totalRecord: total || 0}
        pageNo === 1 && router.replace({query: {...router.history.current.query, page: 1}})
        this.meLi = list && this.fles(list, 'measurementDate') || []
      },
      setToop (obj = {}) {
        if (JSON.stringify(obj) !== '{}') {
          const {measurementDate, glucoseConcentration, mealPeroid, memo, source, id} = obj
          this.formFields = {...this.formFields, measurementDate, glucoseConcentration, mealPeroid, memo, source, id}
          this.bsFrom = !this.bsFrom

          if (this.type === 'doctor') this.setBs = true
        }
      },
      addToop () {
        this.cancel('bsFrom')
        this.setBs = false
        this.formFields = {measurementDate: null, glucoseConcentration: null, mealPeroid: 0, memo: ''}
      },
      delData (id) {
        showConfirm('删除后，将无法在图表中查看到该笔血糖数据.', '确认删除数据？').then(() => {
          delPeroidLastApi(id).then(() =>{
            showAlert('删除成功!')
            this.cancel('bsFrom')
            this.getList()
          }).catch(e => {
            showAlert(e.msg, 'error')
          })
        })
      },
      addData (formName) {
        const {userId} = this.Def
        this.submitForms(formName, async() => {
          try {
            this.setBs && await setPeroidLastApi({userId, ...this.formFields})
            !this.setBs && await addPeroidLastApi({userId, ...this.formFields})
            this.getList()
          } catch (e) {
            showAlert(e.msg, 'error')
          }
          await this.getList()
        }, '添加数据')
      },
    },
    created () {
    },
    mounted () {
      if (this.Def) {
        this.getList()
      }
    },
    destroyed () {
    }
  }
</script>
