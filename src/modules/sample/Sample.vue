<template>
    <div>
        <p>this is sample</p>
        <div><el-button>默认按钮</el-button></div>
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">{{'123'}}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">

                <el-select v-model="value" :disabled="select_disabled" class="select" placeholder="请选择">
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple"><div><el-button type="primary" class="change_select">切换</el-button></div></div></el-col>

        </el-row>

        <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
        </el-row>
    </div>
</template>
<script type="text/babel">
    import Vue from 'vue'
    import {Button,Select,Row,Col,Option} from 'element-ui'

    Vue.component(Button.name,Button)
    Vue.component(Select.name,Select)
    Vue.component(Row.name,Row)
    Vue.component(Col.name,Col)

    Vue.component(Option.name,Option)
</script>