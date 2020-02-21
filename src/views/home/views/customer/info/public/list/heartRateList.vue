<style lang="less" scoped>
  @import "../../style.less";
</style>

<template>
  <div>
    <!-- 测量数据 搜索 添加 -->
    <div class="measureServer" style="text-align: right;">
      <el-date-picker class="my-date-picker" type="daterange" v-model="search.mDateRange" placeholder="请选择时间区间"
                      style="width:242px;"></el-date-picker>
      <span class="se" v-html="img.holder" @click="getList(1)"></span>
    </div>

    <!-- 测量数据列表 -->
    <div class="measureList" style="margin-top: 30px;">
      <my-table :data="meLi" @row-click="acClick" stripe>
        <my-table-column width="190px" label="测量时间" inline-template>
          <div class="fon">{{dateFilter(row.measurementDate)}}</div>
        </my-table-column>
        <my-table-column width="180px" label="热身" inline-template>
          <div class="fon">{{toMinuteForHoursFilter(row.exetimeWarmUp, '')}}</div>
        </my-table-column>
        <my-table-column width="180px" label="燃脂" inline-template>
          <div class="fon">{{toMinuteForHoursFilter(row.exetimeLf, '')}}</div>
        </my-table-column>
        <my-table-column width="180px" label="耐力" inline-template>
          <div class="fon">{{toMinuteForHoursFilter(row.exetimeCpm, '')}}</div>
        </my-table-column>
        <my-table-column label="极限" inline-template>
          <div class="fon">{{toMinuteForHoursFilter(row.exetimeSup, '')}}</div>
        </my-table-column>
      </my-table>
      <div>
        <my-pagination style="text-align: right" @current-change="getList" :current-page="pagination.pageIndex"
                       layout="prev, pager, next, jumper"
                       :pageSize="pagination.pageSize" :total="pagination.totalRecord">
        </my-pagination>
      </div>
    </div>

    <!-- 展示某个时期段的 心率图表 -->
    <my-dialog class="my_dialog win980" v-model="chartToop" top="8%">
      <div class="titles" slot="title">动态心率历史<span style="display: inline-block;padding-left: 20px">{{toopTimes}}</span></div>
      <heartRateChart v-if="!!chartToop" type="toop" class="toopChart" :titleShow="false" :datas="chartData"></heartRateChart>
    </my-dialog>

  </div>
</template>

<script>
  // components
  import MyPagination from '../../../../../../../components/common/pagination/MyPagination'
  import MyTable from '../../../../../../../components/common/table/MyTable'
  import MyTableColumn from '../../../../../../../components/common/table/MyTableColumn'
  import MyDatePicker from '../../../../../../../components/common/date/MyDatePicker'
  import MyDialog from '../../../../../../../components/common/modal/MyDialog'

  import heartRateChart from '../chart/heartRateChart'

  import {showAlert} from '../../../../../../../store/actions/alert'
  import {showConfirm} from '../../../../../../../store/actions/confirm'

  // filters
  import {
    dateFilter, toMinuteForHoursFilter
  } from '../../../../../../../filters'

  // API
  import {getHeartRateAnalysisListApi} from '../../../../../../../api/datachart'

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
        chartToop: false,
        meLi: [],
        chartData: {},
        toopTimes: '',
        search: {
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
      MyTable,
      MyTableColumn,
      MyPagination,
      MyDatePicker,
      MyDialog,
      heartRateChart,
    },
    computed: {
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
      dateFilter,
      toMinuteForHoursFilter,
//      toggleDom,
      ...actions,
      async getList (pageIndex) {
//        userId, startDate, endDate, pageSize = 5, pageNum = 1
        const {userId} = this.Def
        if (!userId) return
        const {page} = queryGetter(this.$store.state)
        let pageNum = (typeof pageIndex === "object" ? pageIndex.page : pageIndex) || page
        const {mDateRange} = this.search
        let startDate = mDateRange[0] && mDateRange[0].getTime() || ''
        let endDate = mDateRange[1] && mDateRange[1].getTime() || ''
//        const {list, total} = await getHeartRateAnalysisListApi({userId: 4519647, pageNum, startDate, endDate}) || {}
        const {list, total} = await getHeartRateAnalysisListApi({userId, pageNum, startDate, endDate}) || {}
        this.meLi = list
        this.pagination = {...this.pagination, totalRecord: total || 0}
        pageNum === 1 && router.replace({query: {...router.history.current.query, page: 1}})
      },
      acClick (obj) {
        this.chartData = {}
        this.chartToop = !this.chartToop
        this.chartData = obj
        this.toopTimes = dateFilter(obj.measurementDate)
      }
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
