<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<template>
  <div class="admin-content-box custom_bg">
    <div class="custom_layout">
      <div class="custom_layout_bg">
        <div class="blank"></div>
        <div class="admin-title">
          <h2>品牌定制</h2>
        </div>
        <div style="position:relative">
          <div class="el-loading-mask common-loading" v-show="brandLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
          <div class="brank_con" :class="{brank_con2:hasImg}">
            <form  id="J_from">
              <!--<div v-if="hasImg">-->
                <!--&lt;!&ndash;<el-button class="change_img">更换图片</el-button>&ndash;&gt;-->
                <!--<div class="change_img">更换图片<input type="file" id="J_upload_file" accept="image/png" @change="getFile"></div>-->
                <!--<el-button class="edit_url" @click="urlEdit" v-show="!urlIsEidt">修改链接</el-button>-->
              <!--</div>-->
              <div class="brank_item">
                <span class="label">品牌图片:</span>
                <div class="detail">
                  <img id="uploadImg" :src="imgSrc" class="upload_img" v-show="hasImg">
                  <div class="img_box" v-show="!hasImg" v-loading.body="imgLoading">
                    <input type="file" class="upload_file" id="J_upload_file" accept="image/png" @change="getFile">
                  </div>
                  <div v-if="hasImg">
                    <div class="change_img">更换图片<input type="file" id="J_upload_file" accept="image/png" @change="getFile"></div>
                  </div>
                  <div class="tips">图片必须为PNG格式，尺寸为750x200px，大小不超过2M</div>
                  <div class="tips tips2">注：品牌图片不允许涉及政治敏感与色情，一经发现，则停用该账号。</div>
                </div>
              </div>
            </form >

            <div class="brank_item">
              <span class="label">品牌链接:</span>
              <div class="detail">
                <el-input
                        class="url_input"
                        v-model="url" :disabled="!urlIsEidt" :class="{url_input_error:urlError}" :maxlength=500>
                </el-input>
                <div v-if="hasImg">
                  <el-button class="edit_url" @click="urlEdit" v-show="!urlIsEidt">修改链接</el-button>
                </div>
                <div class="tips" v-if="!urlError">选填，请输入正确的链接，500字符以内</div>
                <div class="tips tips2" v-if="urlError">请输入正确的链接</div>
              </div>
            </div>

            <div class="brank_item brank_item2">
              <span class="label">&nbsp;</span>
              <div class="detail detail2" v-if="isNew">
                <el-button type="primary" @click="uploadSubmit">立即创建</el-button><el-button @click="cancelEdit(false)">&nbsp;&nbsp;&nbsp;取&nbsp;消&nbsp;&nbsp;&nbsp;</el-button>
              </div>
              <div class="detail detail2" v-if="!isNew" v-show="showSave">
                <el-button type="primary" @click="uploadSubmit">&nbsp;&nbsp;&nbsp;保&nbsp;存&nbsp;&nbsp;&nbsp;</el-button><el-button @click="cancelEdit(true)">&nbsp;&nbsp;&nbsp;取&nbsp;消&nbsp;&nbsp;&nbsp;</el-button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import actions from './actions'
  import getters from '../../../../home/top/getters'
  export default {
    data () {
      return {
        brandLoading: true,
        url: '',
        hasImg: false,
        isNew: true,
        imgLoading: false,
        imgSrc: null,
        brand_data: null,
        urlIsEidt: true,
        urlError: false,
        fileFormDate:null,
        organId:'',
        showSave: false,

      }
    },
    watch: {
      'adminInfos' (val) {
        this.init(val)
      }
    },
    methods: {
      ...actions,
    },
    computed: {
      ...getters,
    },
    mounted () {
      const _this = this,
          id = _this.adminInfos.id
      if(id) {
        _this.init({id:id})
      }

    },
  }
</script>
