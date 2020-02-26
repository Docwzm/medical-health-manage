<style lang="stylus" scoped>
  @import "../chart/weight/list.styl";
</style>
<style lang="stylus">
  @import "../chart/weight/dialog.styl";
</style>
<template>
  <div>
    <div class="weight-infos" v-show="hasNewWeight">
      <div class="first">
        <div class="left">
          <b>{{weightInfos.weight}}<span>kg</span></b>
          <p>{{weightInfos.measurementDate | dateTimeFilter2}}</p>
        </div>
        <div class="right" v-show="weightInfos.bmi || weightInfos.bmi == 0">
          <div class="progress">
            <div class="item item1">
              <p class="s1">18.5</p>
              <div class="line"></div>
              <p class="label">偏瘦</p>
            </div>
            <div class="item item2">
              <p class="s1">24</p>
              <div class="line"></div>
              <p class="label">理想</p>
            </div>
            <div class="item item3">
              <p class="s1">28</p>
              <div class="line"></div>
              <p class="label">偏胖</p>
            </div>
            <div class="item item4">
              <p class="s1">&nbsp;</p>
              <div class="line"></div>
              <p class="label">肥胖</p>
            </div>
            <div class="pointer" :style="{left: pointerLeft(weightInfos) + 'px'}">
              <div class="box" :style="{backgroundColor: pointerColor(weightInfos)}"></div>
            </div>
          </div>
          <div class="info">
            <p class="s1"><b>{{weightInfos.bmi | weightToFixed}}</b> {{bmi(weightInfos)}}</p>
            <p class="s2">BMI</p>
          </div>
        </div>
      </div>

      <table class="weight-tab" v-show="weightInfos.resistance5k || weightInfos.resistance50k">
        <tr>
          <td width="50%">体型<b class="val">{{bodyType(pbf(weightInfos), muscle(weightInfos))}}</b></td>
          <td width="50%">身材得分<b class="val">{{bodyPoint(weightInfos) | bodyPointFilter}}</b></td>
        </tr>
      </table>
      <table class="weight-tab weight-tab2" v-show="weightInfos.resistance5k || weightInfos.resistance50k">
        <tr>
          <td width="33.3%">
            <div class="con">
              <span class="label">BMI</span>
              <span class="val" v-if="weightInfos.bmi || weightInfos.bmi == 0">{{weightInfos.bmi | weightToFixed}}</span>
              <span class="val" v-if="!weightInfos.bmi && weightInfos.bmi != 0">--</span>
              <span class="btn" :class="bmiBtn(bmi(weightInfos))" v-if="weightInfos.bmi || weightInfos.bmi == 0">{{bmi(weightInfos)}}</span>
            </div>
          </td>
          <td width="33.3%">
            <div class="con">
              <span class="label">脂肪率</span>
              <span class="val" v-if="weightInfos.pbf || weightInfos.pbf == 0">{{weightInfos.pbf | weightToFixed}}%</span>
              <span class="val" v-if="!weightInfos.pbf && weightInfos.pbf != 0">--</span>
              <span class="btn" :class="pbfBtn(pbf(weightInfos))" v-if="weightInfos.pbf || weightInfos.pbf == 0">{{pbf(weightInfos)}}</span>
            </div>
          </td>
          <td>
            <div class="con">
              <span class="label label2">肌肉量</span>
              <span class="val val2" v-if="weightInfos.muscle || weightInfos.muscle == 0">{{weightInfos.muscle | weightToFixed}}kg</span>
              <span class="val val2" v-if="!weightInfos.muscle && weightInfos.muscle != 0">--</span>
              <span class="btn" :class="muscleBtn(muscle(weightInfos))" v-if="weightInfos.muscle || weightInfos.muscle == 0">{{muscle(weightInfos)}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td width="33.3%">
            <div class="con">
              <span class="label">基础代谢</span>
              <span class="val" v-if="weightInfos.basalMetabolism || weightInfos.basalMetabolism == 0">{{weightInfos.basalMetabolism | weightToFixed2}}千卡</span>
              <span class="val" v-if="!weightInfos.basalMetabolism && weightInfos.basalMetabolism != 0">--</span>
              <span class="btn" :class="basalMetabolismBtn(basalMetabolism(weightInfos))" v-if="weightInfos.basalMetabolism || weightInfos.basalMetabolism == 0">{{basalMetabolism(weightInfos)}}</span>
            </div>
          </td>
          <td width="33.3%">
            <div class="con">
              <span class="label">身体年龄</span>
              <span class="val" v-if="age(weightInfos) != '--'">{{age(weightInfos)}}</span>
              <span class="val" v-if="age(weightInfos) == '--'">--</span>
              <span class="btn" :class="ageBtn(age(weightInfos))" v-if="age(weightInfos) != '--'">{{ageValue(ageBtn(age(weightInfos)))}}</span>
            </div>
          </td>
          <td>
            <div class="con">
              <span class="label label2">内脏脂肪等级</span>
              <span class="val val2" v-if="weightInfos.visceralFat || weightInfos.visceralFat == 0">{{weightInfos.visceralFat | weightToFixed2}}</span>
              <span class="val val2" v-if="!weightInfos.visceralFat && weightInfos.visceralFat != 0">--</span>
              <span class="btn" :class="visceralFatBtn(visceralFat(weightInfos))" v-if="weightInfos.visceralFat || weightInfos.visceralFat == 0">{{visceralFat(weightInfos)}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td width="33.3%">
            <div class="con">
              <span class="label">水分率</span>
              <span class="val" v-if="weightInfos.water || weightInfos.water == 0">{{weightInfos.water | weightToFixed}}%</span>
              <span class="val" v-if="!weightInfos.water && weightInfos.water != 0">--</span>
              <span class="btn" :class="waterBtn(water(weightInfos))" v-if="weightInfos.water || weightInfos.water == 0">{{water(weightInfos)}}</span>
            </div>
          </td>
          <td width="33.3%">
            <div class="con">
              <span class="label">骨量</span>
              <span class="val" v-if="weightInfos.bone || weightInfos.bone == 0">{{weightInfos.bone | weightToFixed}}kg</span>
              <span class="val" v-if="!weightInfos.bone && weightInfos.bone != 0">--</span>
              <span class="btn" :class="boneBtn(bone(weightInfos))" v-if="weightInfos.bone || weightInfos.bone == 0">{{bone(weightInfos)}}</span>
            </div>
          </td>
          <td>
            <div class="con">
              <span class="label label2">蛋白质</span>
              <span class="val val2" v-if="weightInfos.protein || weightInfos.protein == 0">{{weightInfos.protein | weightToFixed}}%</span>
              <span class="val val2" v-if="!weightInfos.protein && weightInfos.protein != 0">--</span>
              <span class="btn" :class="proteinBtn(protein(weightInfos))" v-if="weightInfos.protein || weightInfos.protein == 0">{{protein(weightInfos)}}</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="weight-list">
      <div class="el-loading-mask common-loading" v-show="loading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
      <div class="search">
        <el-date-picker
                class="date-input"
                v-model="search_time"
                type="daterange"
                placeholder="请选择日期">
        </el-date-picker><el-select class="search-select" v-model="source" placeholder="请选择数据来源" clearable>
        <el-option
                v-for="(item,index) in sourceList"
                :key="index"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select><a href="javascript:;" class="search-btn" @click="searchList"></a><el-button type="primary" class="add-btn" v-if="!isAdmin" @click="addWeight">添加数据</el-button>
      </div>


      <div class="table-con admin-list weight-table">
        <el-table
                :data="tableData"
                stripe
                @cell-click="cellClick"
        >
          <el-table-column
                  label="测量时间"
                  width="220"
                  inline-template
          >
            <div>{{row.measurementDate | dateTimeFilter2}}</div>
          </el-table-column>
          <el-table-column
                  label="测量结果"
                  width="230"
                  inline-template
          >
            <div>
              <div v-if="row.weight">{{row.weight}}kg</div>
              <div v-if="!row.weight">--</div>
            </div>
          </el-table-column>
          <el-table-column
                  label="BMI"
                  width="230"
                  inline-template
          >
            <div>
              <div v-if="row.bmi">BMI&nbsp;&nbsp;<span style="display:inline-block;width:40px;">{{row.bmi | weightToFixed}}</span> {{row.bmi | bmiFilter}}</div>
              <div v-if="!row.bmi">--</div>
            </div>
          </el-table-column>
          <el-table-column
                  label="数据来源"
                  inline-template
          >
            <div>
              <div v-if="row.deviceId && row.deviceId != 'useradd'">设备采集</div>
              <div v-if="!row.deviceId || row.deviceId == 'useradd'">手工添加</div>
            </div>
          </el-table-column>
        </el-table>
        <div class="page-space"></div>
        <div class="page-con" v-show="total>5">
          <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="total">
          </el-pagination>
        </div>
      </div>

    </div>

    <el-dialog v-model="dialog" class="weight-chart-dialog" :modal=false>
      <h2 class="title">
        体重历史<span>{{dialogWeightInfos.measurementDate | dateTimeFilter2}}</span>
      </h2>
      <div class="weight-infos">
        <div class="first">
          <div class="left">
            <b>{{dialogWeightInfos.weight}}<span>kg</span></b>
            <p>{{dialogWeightInfos.measurementDate | dateTimeFilter2}}</p>
          </div>
          <div class="right" v-show="dialogWeightInfos.bmi || dialogWeightInfos.bmi == 0">
            <div class="progress">
              <div class="item item1">
                <p class="s1">18.5</p>
                <div class="line"></div>
                <p class="label">偏瘦</p>
              </div>
              <div class="item item2">
                <p class="s1">24</p>
                <div class="line"></div>
                <p class="label">理想</p>
              </div>
              <div class="item item3">
                <p class="s1">28</p>
                <div class="line"></div>
                <p class="label">偏胖</p>
              </div>
              <div class="item item4">
                <p class="s1">&nbsp;</p>
                <div class="line"></div>
                <p class="label">肥胖</p>
              </div>
              <div class="pointer" :style="{left: pointerLeft(dialogWeightInfos) + 'px'}">
                <div class="box" :style="{backgroundColor: pointerColor(dialogWeightInfos)}"></div>
              </div>
            </div>
            <div class="info">
              <p class="s1"><b>{{dialogWeightInfos.bmi | weightToFixed}}</b> {{bmi(dialogWeightInfos)}}</p>
              <p class="s2">BMI</p>
            </div>
          </div>
        </div>

        <table class="weight-tab" v-show="dialogWeightInfos.resistance5k || dialogWeightInfos.resistance50k">
          <tr>
            <td width="50%">体型<b class="val">{{bodyType(pbf(dialogWeightInfos), muscle(dialogWeightInfos))}}</b></td>
            <td width="50%">身材得分<b class="val">{{bodyPoint(dialogWeightInfos) | bodyPointFilter}}</b></td>
          </tr>
        </table>
        <table class="weight-tab weight-tab2" v-show="dialogWeightInfos.resistance5k || dialogWeightInfos.resistance50k">
          <tr>
            <td width="33.3%">
              <div class="con">
                <span class="label">BMI</span>
                <span class="val" v-if="dialogWeightInfos.bmi || dialogWeightInfos.bmi == 0">{{dialogWeightInfos.bmi | weightToFixed}}</span>
                <span class="val" v-if="!dialogWeightInfos.bmi && dialogWeightInfos.bmi != 0">--</span>
                <span class="btn" :class="bmiBtn(bmi(dialogWeightInfos))" v-if="dialogWeightInfos.bmi || dialogWeightInfos.bmi == 0">{{bmi(dialogWeightInfos)}}</span>
              </div>
            </td>
            <td width="33.3%">
              <div class="con">
                <span class="label">脂肪率</span>
                <span class="val" v-if="dialogWeightInfos.pbf || dialogWeightInfos.pbf == 0">{{dialogWeightInfos.pbf | weightToFixed}}%</span>
                <span class="val" v-if="!dialogWeightInfos.pbf && dialogWeightInfos.pbf != 0">--</span>
                <span class="btn" :class="pbfBtn(pbf(dialogWeightInfos))" v-if="dialogWeightInfos.pbf || dialogWeightInfos.pbf == 0">{{pbf(dialogWeightInfos)}}</span>
              </div>
            </td>
            <td>
              <div class="con">
                <span class="label label2">肌肉量</span>
                <span class="val val2" v-if="dialogWeightInfos.muscle || dialogWeightInfos.muscle == 0">{{dialogWeightInfos.muscle | weightToFixed}}kg</span>
                <span class="val val2" v-if="!dialogWeightInfos.muscle && dialogWeightInfos.muscle != 0">--</span>
                <span class="btn" :class="muscleBtn(muscle(dialogWeightInfos))" v-if="dialogWeightInfos.muscle || dialogWeightInfos.muscle == 0">{{muscle(dialogWeightInfos)}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td width="33.3%">
              <div class="con">
                <span class="label">基础代谢</span>
                <span class="val" v-if="dialogWeightInfos.basalMetabolism || dialogWeightInfos.basalMetabolism == 0">{{dialogWeightInfos.basalMetabolism | weightToFixed2}}千卡</span>
                <span class="val" v-if="!dialogWeightInfos.basalMetabolism && dialogWeightInfos.basalMetabolism != 0">--</span>
                <span class="btn" :class="basalMetabolismBtn(basalMetabolism(dialogWeightInfos))" v-if="dialogWeightInfos.basalMetabolism || dialogWeightInfos.basalMetabolism == 0">{{basalMetabolism(dialogWeightInfos)}}</span>
              </div>
            </td>
            <td width="33.3%">
              <div class="con">
                <span class="label">身体年龄</span>
                <span class="val" v-if="age(dialogWeightInfos) != '--'">{{age(dialogWeightInfos)}}</span>
                <span class="val" v-if="age(dialogWeightInfos) == '--'">--</span>
                <span class="btn" :class="ageBtn(age(dialogWeightInfos))" v-if="age(dialogWeightInfos) != '--'">{{ageValue(ageBtn(age(dialogWeightInfos)))}}</span>
              </div>
            </td>
            <td>
              <div class="con">
                <span class="label label2">内脏脂肪等级</span>
                <span class="val val2" v-if="dialogWeightInfos.visceralFat || dialogWeightInfos.visceralFat == 0">{{dialogWeightInfos.visceralFat | weightToFixed2}}</span>
                <span class="val val2" v-if="!dialogWeightInfos.visceralFat && dialogWeightInfos.visceralFat != 0">--</span>
                <span class="btn" :class="visceralFatBtn(visceralFat(dialogWeightInfos))" v-if="dialogWeightInfos.visceralFat || dialogWeightInfos.visceralFat == 0">{{visceralFat(dialogWeightInfos)}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td width="33.3%">
              <div class="con">
                <span class="label">水分率</span>
                <span class="val" v-if="dialogWeightInfos.water || dialogWeightInfos.water == 0">{{dialogWeightInfos.water | weightToFixed}}%</span>
                <span class="val" v-if="!dialogWeightInfos.water && dialogWeightInfos.water != 0">--</span>
                <span class="btn" :class="waterBtn(water(dialogWeightInfos))" v-if="dialogWeightInfos.water || dialogWeightInfos.water == 0">{{water(dialogWeightInfos)}}</span>
              </div>
            </td>
            <td width="33.3%">
              <div class="con">
                <span class="label">骨量</span>
                <span class="val" v-if="dialogWeightInfos.bone || dialogWeightInfos.bone == 0">{{dialogWeightInfos.bone | weightToFixed}}kg</span>
                <span class="val" v-if="!dialogWeightInfos.bone && dialogWeightInfos.bone != 0">--</span>
                <span class="btn" :class="boneBtn(bone(dialogWeightInfos))" v-if="dialogWeightInfos.bone || dialogWeightInfos.bone == 0">{{bone(dialogWeightInfos)}}</span>
              </div>
            </td>
            <td>
              <div class="con">
                <span class="label label2">蛋白质</span>
                <span class="val val2" v-if="dialogWeightInfos.protein || dialogWeightInfos.protein == 0">{{dialogWeightInfos.protein | weightToFixed}}%</span>
                <span class="val val2" v-if="!dialogWeightInfos.protein && dialogWeightInfos.protein != 0">--</span>
                <span class="btn" :class="proteinBtn(protein(dialogWeightInfos))" v-if="dialogWeightInfos.protein || dialogWeightInfos.protein == 0">{{protein(dialogWeightInfos)}}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>

    <el-dialog title="添加体重数据" v-model="showDialog" class="add-weight-dialog">
      <div class="el-loading-mask common-loading" v-show="dialogLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
        <el-form-item class="-form-item" label="测量时间：" prop="time">
          <el-date-picker
                  v-model="ruleForm.time"
                  type="datetime"
                  class="el-form-time"
                  placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="-form-item" label="测量结果：" prop="weight">
          <el-input v-model="ruleForm.weight" class="el-from-input" :maxlength=5></el-input>
          <div class="tips">kg</div>
        </el-form-item>
        <div class="dialog-footer2">
          <el-button @click="showDialog = false">取 消</el-button><el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import actions from '../chart/weight/weight_actions'
  import {MUTATION_NAME} from '../../mutations'
  import {
    dateTimeFilter2,
  } from '../../../../../../../filters/index'
  import getters from '../chart/weight/getters'
  export default{
    data () {
      var validateTime = (rule, value, callback) => {
        if(!value) {
          return callback(new Error('请选择测量时间'))
        } else {
          callback()
        }
      }

      var validateWeight = (rule, value, callback) => {
        if(isNaN(value) || parseFloat(value) < 30 || parseFloat(value) > 200) {
          return callback(new Error('请输入30.0-200 范围的数字，精确到小数点后1位数'))
        } else {
          if(value.indexOf('.') > -1) {
            if(value.split('.')[1].length != 1) {
              return callback(new Error('请输入30.0-200 范围的数字，精确到小数点后1位数'))
            }
          }
          callback()
        }
      }
      return {
        loading: false,
        total: 0,
        currentPage: 1,
        source: "",
        tableData:[],
        userId: "",
        search_time: [],
        sourceList: [
          {
            label:"全部",
            value: 3
          },
          {
            label: '设备采集',
            value: 'true'
          },
          {
            label: '手工添加',
            value: 'false',
          },
        ],
        hasNewWeight: false,
        weightInfos: {},
        dialogWeightInfos: {},
        userInfos: {},
        dialog: false,
        historyTime: '',
        isAdmin: true,
        showDialog: false,
        dialogLoading: false,
        ruleForm: {
          time: '',
          weight: '',
        },
        rules: {
          time: [
            { validator: validateTime, trigger: 'blur' },
          ],
          weight: [
            { required: true, message: '请输入30.0-200 范围的数字', trigger: 'blur' },
            { validator: validateWeight, trigger: 'blur' },
          ]
        }
      }
    },
    computed: {
      Def () {
        return this.$store.state[MUTATION_NAME].Def
      },
    },
    watch: {
      Def ({userId}) {
        const _this  = this
        if(userId) {
          _this.userId = userId
          _this.userInfos = _this.Def
          _this.searchList()
          _this.getLastWeight()
        }
      },
      showDialog (val) {
        if(!val) {
          this.$refs['ruleForm'].resetFields();
        }
      }
    },
    mounted(){
      const _this = this,
          {userId} = _this.Def
      if(userId) {
        _this.userId = userId
        _this.userInfos = _this.Def
        _this.searchList()
        _this.getLastWeight()
      }
      _this.isAdminFn()
    },
    methods: {
      ...actions,
      ...getters,
    },
    filters: {
      dateTimeFilter2,
      bodyPointFilter (val) {
        if(val <= 19) {
          return "19"
        } else if(val >= 100) {
          return "100"
        } else {
          return val
        }
      },
      bmiFilter (val) {
        if(val < 18.5) {
          return `偏瘦`
        }else if(val >= 18.5 && val <= 23.9) {
          return `理想`
        } else if(val >= 24 && val <= 28) {
          return `偏胖`
        } else {
          return `肥胖`
        }
      },
      weightToFixed (val) {
        if(val) {
          var newVal = val.toFixed(1)
          if(newVal.split('.')[1] == 0) {
            return newVal.split('.')[0]
          } else {
            return newVal
          }
        }
      },
      weightToFixed2 (val) {
        if(val) {
          return val.toFixed(0)
        }
      }
    }
  }
</script>