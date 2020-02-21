<style lang="less" scoped>
  @import "../../../style.less";
</style>
<style lang="stylus" scoped>
  @import "index.styl";
</style>

<template>
  <div class="chart_steps_list">
    <!--loading-->
    <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
    <!--搜索层-->
    <div class="measureServer right">
      <span class="hint_search_left">步数数据查询的时间跨度为30天</span>
      <el-date-picker class="my-date-picker" type="daterange" v-model="search.mDateRange" placeholder="请选择时间区间"
                      style="width:242px;"></el-date-picker>
      <span class="se no-margin-r" v-html="img.holder" @click="searchMeasureData"></span>
    </div>
    <!--搜素结果列表-->
    <div class="measureList" >
      <my-table :data="meLi" stripe>
        <my-table-column width="220px" label="测量时间" inline-template>
          <div class="fon">{{dateTimeFilter(row.measurementTime, 'YYYY-MM-DD')}}</div>
        </my-table-column>

        <my-table-column width="230px" label="步数" inline-template>
          <div class="fon">{{row.step}} 步</div>
        </my-table-column>

        <my-table-column width="230px" label="公里数" inline-template>
          <div class="fon">{{row.distance/1000 || ''}} 公里</div>
        </my-table-column>

        <my-table-column label="消耗" inline-template>
          <div class="fon">{{row.calories}} 大卡</div>
        </my-table-column>

      </my-table>
      <div>
        <el-pagination
          class="chart_list_page"
          @current-change="handleStepsCurrentChange"
          :current-page="pagination.pageIndex"
          :page-size="pagination.pageSize"
          layout="prev, pager, next, jumper"
          :total="pagination.totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import moment from 'moment'

  import MyTable from '../../../../../../../../components/common/table/MyTable'
  import MyTableColumn from '../../../../../../../../components/common/table/MyTableColumn'
  import MyPagination from '../../../../../../../../components/common/pagination/MyPagination'

  import {
    dateTimeFilter,
    dataSource,
  } from '../../../../../../../../filters'

  import actions from './actions'
  import {MUTATION_NAME} from '../../../mutations'

  export default {
    props : {

    },
    data() {
        return {
          loading : false,
          meLi: [],
          search : {
            mDateRange:[
              (new Date(parseInt(moment().subtract(29, 'days').format('x')))),
              (new Date(parseInt(moment().format('x')))),
            ]
          },
          pagination: {
            pageIndex: 1,
            pageSize: 5,
            totalRecord: 0
          },
          img: {
            holder: require('!!raw!../../../../../../../../../static/assets/icon-search.svg'),
          },
        }
    },
    computed: {
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      }
    },
    watch: {
      Def () {
        this.init()
      }
    },
    methods: {
      ...actions,
      dateTimeFilter,
      dataSource,
    },
    components : {
      MyTable,
      MyTableColumn,
      MyPagination,
    },
    mounted(){
      const _this = this,
        {userId} = _this.Def
      if(userId) {
        _this.init()
      }
    }
  }

</script>
