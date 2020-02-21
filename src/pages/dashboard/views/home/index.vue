<style lang="less">
@import "./index.less";
</style>

<template>
  <div class="dashboard-container">
    <div class="top">
      <div class="bg"></div>
      <p class="title">罗湖医院数据大屏</p>
      <my-button class="control-btn" @click="handlefullscreen">
        <i class="icon-control"></i>
        控制台
      </my-button>
    </div>
    <div class="main">
      <div class="left">
        <div class="top-title-bar">
          <p class="title">今日数据 2020-01-04</p>
          <a class="check-detail-btn" href>查看详情 &gt;</a>
        </div>
        <div class="info-counter-wrap">
          <div class="card card-wrap">
            <p class="title">筛查人数</p>
            <div class="counter-wrap">
              <span>849</span>
              <div class="per"><div class="top_arrows"></div><i>20%</i></div>
            </div>
            <p class="total">本月累计 128,234人</p>
          </div>
          <div class="card card-wrap">
            <p class="title">发现人数</p>
            <div class="counter-wrap">
              <span>849</span>
              <div class="per"><div class="top_arrows"></div><i>20%</i></div>
            </div>
            <p class="total">本月累计 128,234人</p>
          </div>
          <div class="card card-wrap">
            <p class="title">管理人数</p>
            <div class="counter-wrap">
              <span>849</span>
              <div class="per"><div class="down_arrows"></div><i class="down">20%</i></div>
            </div>
            <p class="total">本月累计 128,234人</p>
          </div>
        </div>
        <div class="device-wrap card-wrap">
          <div class="title-bar">
            <span>设备使用</span>
            <a class="check-detail-btn" href>查看详情 &gt;</a>
          </div>
          <div class="info-wrap">
            <div class="device-chart">
              <div class="chart-wrap">
                <div class="pie-chart" id="divece-pie-chart"></div>
                <div class="info">
                  <p class="count">7633</p>
                  <span>设备激活</span>
                </div>
              </div>
              <div class="legend-wrap">
                <p>
                  <span>未使用</span>
                  <i>12314人</i>
                </p>
                <p>
                  <span>使用1次</span>
                  <i>12314人</i>
                </p>
                <p>
                  <span>使用≥2次</span>
                  <i>12314人</i>
                </p>
              </div>
            </div>
            <div class="line-divide"></div>
            <div class="device-info">
              <div class="watch device">
                <p>手环</p>
                <span>1233人</span>
              </div>
              <div class="wristbands device">
                <p>手表</p>
                <span>1233人</span>
              </div>
              <div class="bp-dc device">
                <p>血压计</p>
                <span>1233人</span>
              </div>
              <div class="bs-dc device">
                <p>血糖仪</p>
                <span>1233人</span>
              </div>
              <div class="body-fat-dc device">
                <p>体脂秤</p>
                <span>1233人</span>
              </div>
            </div>
          </div>
        </div>
        <div class="warn-wrap card-wrap">
          <div class="title-bar">
            <span>预警情况</span>
            <a class="check-detail-btn" href>查看详情 &gt;</a>
          </div>
          <div class="tag-bar">
            <div class="tag">
              <span class="text">预警数量及分布</span>
            </div>
          </div>
          <div class="count-info-wrap">
            <div class="count-chart">
              <div class="chart-wrap">
                <div class="pie-chart" id="warn-pie-chart"></div>
                <div class="info">
                  <p class="count">7633</p>
                  <span>预警总数</span>
                </div>
              </div>
              <div class="legend-wrap">
                <p>
                  <span>高血压</span>
                  <i>12314人</i>
                </p>
                <p>
                  <span>糖尿病</span>
                  <i>12314人</i>
                </p>
                <p>
                  <span>其他</span>
                  <i>12314人</i>
                </p>
              </div>
            </div>
            <div class="line-divide"></div>
            <div class="spread-info">
              <div class="area-item">
                <p class="name">新围社康中心</p>
                <p class="count">2310人</p>
              </div>
              <div class="area-item">
                <p class="name">新围社康中心</p>
                <p class="count">2310人</p>
              </div>
              <div class="area-item">
                <p class="name">新围社康中心</p>
                <p class="count">2310人</p>
              </div>
            </div>
          </div>
          <div class="tag-bar warn-handle">
            <div class="tag">
              <span class="text">预警处理情况</span>
            </div>
            <div class="handle-legend-wrap">
              <p>已处理</p>
              <p>未处理</p>
            </div>
          </div>
          <div class="handle-info-wrap">
            <div class="card">
              <canvas width="300" height="300" class="guage-chart" id="guage-chart-1"></canvas>
              <div class="info">
                <p class="data">
                  <span class="num">48</span>
                  <span class="unit">%</span>
                </p>
                <p class="tag">总处理率</p>
              </div>
            </div>
            <div class="card">
              <canvas width="300" height="300" class="guage-chart" id="guage-chart-2"></canvas>
              <div class="info">
                <p class="data">
                  <span class="num">90</span>
                  <span class="unit">%</span>
                </p>
                <p class="tag">高血压</p>
              </div>
            </div>
            <div class="card">
              <canvas width="300" height="300" class="guage-chart" id="guage-chart-3"></canvas>
              <div class="info">
                <p class="data">
                  <span class="num">48</span>
                  <span class="unit">%</span>
                </p>
                <p class="tag">糖尿病</p>
              </div>
            </div>
            <div class="card">
              <canvas width="300" height="300" class="guage-chart" id="guage-chart-4"></canvas>
              <div class="info">
                <p class="data">
                  <span class="num">48</span>
                  <span class="unit">%</span>
                </p>
                <p class="tag">其他</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="top-title-bar">
          <p class="title">历史数据概览</p>
          <my-select class="year-select" popper-class="year-popper" :value="selectYear" @input="changeYear($event)">
              <my-option label="2020" :value="2020"></my-option>
              <my-option label="2019" :value="2019"></my-option>
            </my-select>
        </div>

        <div class="top-info">
          <div class="card">
            <span class="tag">年任务总量</span>
            <span class="num">13500</span>
          </div>
          <div class="card">
            <div class="item">
              <span class="tag">筛查数</span>
              <span class="num">13500</span>
            </div>
            <div class="item">
              <span class="tag">筛查数</span>
              <span class="num">13500</span>
            </div>
          </div>
          <div class="card">
            <div class="item">
              <span class="tag">筛查数</span>
              <span class="num">13500</span>
            </div>
            <div class="item">
              <span class="tag">筛查数</span>
              <span class="num">13500</span>
            </div>
            <div class="item">
              <span class="tag">筛查数</span>
              <span class="num">13500</span>
            </div>
          </div>
        </div>

        <div class="trend-wrap card-wrap">
          <div class="top-bar">
            <div class="title-bar">
              <span class="title">整体趋势</span>
              <div class="trend-legend-wrap">
                <p>管理率</p>
                <p>规范率</p>
                <p>控制率</p>
              </div>
            </div>
            <div class="tab-wrap">
              <p v-for="(item,index) in trendTimeRange" :key="index" @click="changeTrendTimeRange(item.name)" :class="currentTrendTimeRange===item.name?'active':''">{{item.text}}</p>
            </div>
          </div>
          <div class="line-chart-wrap">
            <div id="line-chart" style="width:9.22rem;height:2.75rem"></div>
          </div>
          <div class="info-card">
            <p class="title">2020年 9月</p>
            <div class="item">
              <p class="tag">管理数</p>
              <div class="info">
                <p class="num">6192</p>
                <p class="percent">67%</p>
              </div>
            </div>
            <div class="item">
              <p class="tag">规范数</p>
              <div class="info">
                <p class="num">6192</p>
                <p class="percent">67%</p>
              </div>
            </div>
            <div class="item">
              <p class="tag">控制数</p>
              <div class="info">
                <p class="num">6192</p>
                <p class="percent">67%</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bot-wrap">
          <div class="disease-control-wrap card-wrap">
            <div class="title-bar">
              <span class="title">病种控制-9月</span>
              <div class="trend-legend-wrap">
                <p>管理率</p>
                <p>规范率</p>
                <p>控制率</p>
              </div>
            </div>
            <div class="bar-chart-container">
              <div class="y-line-wrap">
                <p class="line"></p>
                <p class="line"></p>
                <p class="line"></p>
                <p class="line"></p>
              </div>
              <div class="x-line-wrap">
                <p class="per">0%</p>
                <p class="per">25%</p>
                <p class="per">50%</p>
                <p class="per">75%</p>
                <p class="per">100%</p>
              </div>
              <div class="bar-chart-wrap">
                <div class="bar-chart-box">
                  <p class="title">高血压</p>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                </div>
                <div class="bar-chart-box">
                  <p class="title">糖尿病</p>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                </div>
                <div class="bar-chart-box">
                  <p class="title">其他</p>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                  <div class="bar-chart-item">
                    <div class="bar-chart">
                      <p style="width:63%"></p>
                    </div>
                    <span class="data">63%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="community-health-wrap card-wrap">
            <div class="title-bar">
              <span class="title">社康管理情况-9月</span>
              <a class="check-detail-btn" href>查看详情 &gt;</a>
            </div>
            <div class="table-wrap">
              <my-table
                :data="communityData"
                style="margin: auto"
                class="community-table"
                :border="false"
              >
                <column
                  :render-header="renderHeader"
                  color="#fffff"
                  prop="col1"
                  label="机构名称"
                  inline-template
                >
                  <div class="col1-span">{{row.col1}}</div>
                </column>
                <column :render-header="renderHeader" color="#E4C04A" prop="col2" label="任务数"></column>
                <column :render-header="renderHeader" color="#A19BFF" prop="col3" label="筛查数"></column>
                <column :render-header="renderHeader" color="#A19BFF" prop="col4" label="发现数"></column>
                <column :render-header="renderHeader" color="#57D0FF" prop="col5" label="管理数"></column>
                <column :render-header="renderHeader" color="#57D0FF" prop="col6" label="规范数"></column>
                <column :render-header="renderHeader" color="#57D0FF" prop="col7" label="控制数"></column>
                <column
                  :render-header="renderHeader"
                  color="#5C8CE3"
                  prop="col8"
                  label="依从率"
                  inline-template
                >
                  <div class="col8-col">{{row.col8}}</div>
                </column>
              </my-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import MyButton from "@/components/common/button/MyButton";
import MySelect from "@/components/common/select/MySelect";
import MyOption from "@/components/common/select/MyOption";
import MyTable from "@/components/common/table/MyTable";
import Column from "@/components/common/table/MyTableColumn";
import actions from "./actions";
export default {
  name: "dashboard",
  data() {
    return {
      selectYear: 2019,
      currentTrendTimeRange:'month',
      trendTimeRange:[
        {
          name:'month',
          text:'月',
        },
        {
          name:'season',
          text:'季',
        }
      ],
      deviceChartData: [
        {
          value: 335,
          name: "未使用",
          color: ["#00CBED", "#048CE4"]
        },
        {
          value: 135,
          name: "使用1次",
          color: ["#F52153", "#E33D0F"]
        },
        {
          value: 1548,
          name: "使用≥2次",
          color: ["#03D65C", "#70E555"]
        }
      ],
      warnChartData: [
        {
          value: 335,
          name: "高血压",
          color: ["#00CBED", "#048CE4"]
        },
        {
          value: 135,
          name: "糖尿病",
          color: ["#F52153", "#E33D0F"]
        },
        {
          value: 1548,
          name: "其他",
          color: ["#03D65C", "#70E555"]
        }
      ],
      communityData: [
        {
          col1: "新围社康中心",
          col2: "20000",
          col3: "20000",
          col4: "20000",
          col5: "20000",
          col6: "20000",
          col7: "20000",
          col8: "67%"
        },
        {
          col1: "新围社康中心",
          col2: "20000",
          col3: "20000",
          col4: "20000",
          col5: "20000",
          col6: "20000",
          col7: "20000",
          col8: "67%"
        },
        {
          col1: "新围社康中心",
          col2: "20000",
          col3: "20000",
          col4: "20000",
          col5: "20000",
          col6: "20000",
          col7: "20000",
          col8: "67%"
        },
        {
          col1: "新围社康中心",
          col2: "20000",
          col3: "20000",
          col4: "20000",
          col5: "20000",
          col6: "20000",
          col7: "20000",
          col8: "67%"
        },
        {
          col1: "新围社康中心",
          col2: "20000",
          col3: "20000",
          col4: "20000",
          col5: "20000",
          col6: "20000",
          col7: "20000",
          col8: "67%"
        },
        {
          col1: "新围社康中心",
          col2: "20000",
          col3: "20000",
          col4: "20000",
          col5: "20000",
          col6: "20000",
          col7: "20000",
          col8: "67%"
        },
        {
          col1: "新围社康中心",
          col2: "20000",
          col3: "20000",
          col4: "20000",
          col5: "20000",
          col6: "20000",
          col7: "20000",
          col8: "67%"
        }
      ]
    };
  },
  components: {
    MyButton,
    MyOption,
    MySelect,
    MyTable,
    Column
  },
  mounted() {
    this.init();
  },
  methods: {
    ...actions
  }
};
</script>
