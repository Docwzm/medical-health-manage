<style lang="stylus" scoped>
  @import "../../../../../styles/layout.styl";
  @import "./index.styl";
</style>
<style lang="stylus">
  .wangeditor_disabled
    cursor not-allowed
    >.wangEditor-container
      background-color #F9F9F9
      >.wangEditor-menu-container
        background-color #F9F9F9

  .wchat_item_error
    >input.el-input__inner
      border-color #ff4949
</style>
<template>
  <div class="admin-content-box wchat_bg">
      <!-- 标题 -->
      <div class="admin-title">
          <h2>机构微信图文</h2>
      </div>
      <!-- 主体 -->
      <div class="wchat_content_box" v-loading.body="wchatLoading">
          <!-- 左侧主体 -->
          <div class="left" v-show="hasEdit">
              <!-- 图文简述展示 -->
              <div class="wchat_sketch">
                  <div class="title">
                    <span>推送封面</span>
                  </div>
                  <div class="content">
                    <span class="content_title">{{ wchat_title || "标题" }}</span>
                    <span class="content_date">{{ dateFilter(new Date(),'M月D日') }}</span>
                    <div class="content_pic">
                      <img :src="wchat_imgurl" v-show="hasImg">
                    </div>
                    <span class="content_desc">{{ wchat_desc || "描述" }}</span>
                  </div>
              </div>
              <!-- 图文详情展示 -->
              <div class="wchat_details">
                  <div class="title">
                    <span>详情内容</span>
                  </div>
                  <div class="content" v-show="contentType === '1'">
                    由于您选择详情链接，没有编辑详情内容，无法展示详情内容的浏览效果
                  </div>
                  <div class="content" v-show="contentType === '0'" v-html="wchat_content"></div>
              </div>
          </div>
          <!-- 右侧主体 -->
          <div class="right" v-bind:class="{ noleft: !hasEdit}">

            <form  id="J_from">
              <div class="wchat_item">
                  <label class="wchat_upload_label">封面图片:</label>
                  <div v-show="hasEdit" class="wchat_upload_item_layer">
                      <img id="uploadImg" :src="wchat_imgurl" class="upload_img" v-show="hasImg">
                      <div class="wchat_upload_select_layer" v-show="!hasImg" v-loading.body="imgLoading">
                          <input type="file" class="upload_file" accept="image/png,image/jpeg,image/jpg" @change="getFile">
                      </div>
                    <div v-show="hasEdit && hasImg" class="wchat_upload_item_change_img_btn">更换图片<input type="file" accept="image/png,image/jpeg,image/jpg" @change="getFile"></div>
                    <div v-show="hasEdit && !hasImg" class="wchat_upload_item_change_img_btn">上传图片<input type="file" accept="image/png,image/jpeg,image/jpg" @change="getFile"></div>
                    <span>图片必须为PNG、JPG格式,尺寸为900*500px,大小不超过2M</span>
                  </div>
                  <div v-show="!hasEdit" class="wchat_upload_item_layer">
                    <img :src="wchat_imgurl" class="upload_img">
                  </div>
              </div>
            </form>

              <div class="wchat_item">
                  <label>标题:</label>
                  <div>
                    <el-input v-model="wchat_title" :placeholder="getInputPlaceHolderForType('title',hasEdit)" :disabled="!hasEdit" :class="{wchat_item_error: errorItem.isTitleError}" @blur="checkInput('title')"></el-input>
                    <span v-show="hasEdit" class="valid_length" :class="{error: titleLen > titleMaxLen}" @keyup="calcInputLength('title')">{{titleLen}} / {{ titleMaxLen }}</span>
                    <!--<span v-show="!hasEdit">{{ wchat_title }}</span>-->
                    <transition name="fade">
                      <span v-if="hasEdit && errorItem.isTitleError" class="wchat_item_error">请输入标题</span>
                    </transition>
                  </div>
              </div>

              <div class="wchat_item">
                  <label>描述:</label>
                  <div>
                    <el-input v-model="wchat_desc" :placeholder="getInputPlaceHolderForType('desc',hasEdit)" :disabled="!hasEdit" :class="{wchat_item_error: errorItem.isDescError}" @blur="checkInput('desc')"></el-input>
                    <span v-show="hasEdit" class="valid_length" :class="{error: descLen > descMaxLen}" @keyup="calcInputLength('desc')">{{ descLen }} /  {{ descMaxLen }}</span>
                    <!--<span v-show="!hasEdit">{{ wchat_desc }}</span>-->
                    <transition name="fade">
                      <span v-show="hasEdit && errorItem.isDescError" class="wchat_item_error">请输入描述</span>
                    </transition>
                  </div>
              </div>

              <div class="wchat_item">
                  <label>跳转:</label>
                  <div v-show="hasEdit">
                    <el-radio class="radio" label="0" v-model="contentType">启用正文内容</el-radio>
                    <el-radio class="radio" label="1" v-model="contentType">启用正文链接</el-radio>
                  </div>
                  <div v-show="!hasEdit">
                    <span v-if="contentType === '0'">
                      启用正文内容
                    </span>
                    <span v-else>
                      启用正文链接
                    </span>
                  </div>
              </div>

              <div class="wchat_item" v-show="contentType === '1'">
                  <label>详情链接:</label>
                  <div>
                    <el-input v-model="wchat_link" :placeholder="getInputPlaceHolderForType('link',hasEdit)" :disabled="!hasEdit" :class="{wchat_item_error: errorItem.isLinkError}" @blur="checkInput('link')"></el-input>
                    <!--<span v-show="!hasEdit">{{ wchat_link }}</span>-->
                    <transition name="fade">
                      <span v-show="hasEdit && errorItem.isLinkError" class="wchat_item_error">请输入正确的链接</span>
                    </transition>
                  </div>
              </div>

              <div class="wchat_item" v-show="contentType === '0'">
                <label>作者:</label>
                <div>
                  <el-input v-model="wchat_author" :placeholder="getInputPlaceHolderForType('author',hasEdit)" :disabled="!hasEdit" :class="{wchat_item_error: errorItem.isAuthorError}" @blur="checkInput('author')"></el-input>
                  <span v-show="hasEdit" class="valid_length" :class="{error: authorLen > authorMaxLen}" @keyup="calcInputLength('author')">{{ authorLen }} / {{ authorMaxLen }}</span>
                  <!--<span v-show="!hasEdit">{{ wchat_author }}</span>-->
                  <transition name="fade">
                    <span v-show="hasEdit && errorItem.isAuthorError" class="wchat_item_error">请输入正确的作者</span>
                  </transition>
                </div>
              </div>

              <div class="wchat_item" v-show="contentType === '0'">
                  <label class="wchat_upload_label">详情内容:</label>
                  <div :class="{wangeditor_disabled: !hasEdit}">
                      <div id="wangeditor" style="height:300px;"></div>
                  </div>
              </div>

              <div class="wchat_item wchat_item_btns">
                <el-button @click="wchatPreviewSave">生成预览</el-button>
                <el-button type="primary" v-show="!hasEdit" @click="wchatEdit">编辑</el-button>
                <el-button type="primary" v-show="hasNew && hasEdit" @click="wchatSaveSubmit">立即创建</el-button>
                <el-button type="primary" v-show="!hasNew && hasEdit" @click="wchatSaveSubmit">保存</el-button>
                <el-button v-show="hasEdit" @click="cancleEdit(hasNew)">取消</el-button>
              </div>
          </div>
      </div>
  </div>
</template>
<script type="text/babel">
  import actions from './actions'
  import getters from '../../../../home/top/getters'
  import MyEditor from '../../../../../components/rich-editor/index'
  import { dateFilter } from '../../../../../filters'
  export default {
    data () {
          return {
            wchatLoading: false,
            imgLoading: false,
            hasImg: false,
            contentType: "0",
            hasEdit: true,
            hasNew : true,
            fileFormDate: null,
            isFirst: true,

            titleMaxLen: 32,
            titleLen: 0,
            descMaxLen: 32,
            descLen: 0,
            authorMaxLen: 8,
            authorLen: 0,

            wchat_data : null,

            organId: null,
            wchat_imgurl : null,
            wchat_title : null,
            wchat_desc : null,
            wchat_author : null,
            wchat_link : null,
            wchat_content : null,
            errorItem : {
                isTitleError : false,
                isDescError : false,
                isLinkError : false,
                isAuthorError : false,
            }
          }
      },
      watch: {
        'adminInfos' (val) {
          this.init(val)
        },
        'wchat_title': function(val) {
            this.calcInputLength("title", val)
        },
        'wchat_desc': function(val) {
          this.calcInputLength("desc", val)
        },
        'wchat_author': function(val) {
          this.calcInputLength("author", val)
        },
      },
      methods: {
        ...actions,
        dateFilter
      },
      computed: {
        ...getters
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
