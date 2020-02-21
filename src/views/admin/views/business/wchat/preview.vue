<style lang="stylus" scoped>
.preview_list
.preview_details
  width 750px
  min-height 100%
  margin 0 auto

.preview_list
  margin-top 10px
  .preview_item
    background-color #FFFFFF
    -webkit-border-radius 10px
    -moz-border-radius 10px
    border-radius 10px
    width 700px
    margin-left 25px
    border 1px solid #f4f4f4
    div
      padding 10px 25px
    .content
      span
        font-size 15px
        display block
        &.title
          line-height 1.8
        &.date
          color #999999
          margin-bottom 5px
        &.desc
          color #999999
          margin-top 5px
          margin-bottom 5px
      img
        display block
        width 650px
        height 361px
        margin-top 10px
    .destails
      border-top 1px solid #f4f4f4
      span
        font-size 15px
        line-height 2
        /*margin-left 10px*/
        &:last-child
          float right
          /*margin-right 10px*/

.preview_details
  overflow-x auto
</style>
<style lang="stylus">
  body
    background-color #f9f7f5
</style>

<template>
  <div class="preview_list" v-if="!hasDetails">
    <div class="preview_item" @click="showDetails()">
      <div class="content">
        <span class="title">{{ wchat_title }}</span>
        <span class="date">{{ dateFilter(new Date(),'M月D日') }}</span>
        <img :src="wchat_imgurl">
        <span class="desc">{{ wchat_desc }}</span>
      </div>
      <div class="destails">
        <span>阅读全文</span>
        <span><i class="el-icon-arrow-right"></i></span>
      </div>
    </div>
  </div>
  <div class="preview_details" v-else v-html="wchat_content"></div>

</template>

<script type="text/babel">
  import { getlocalStorage } from '../../../../../api/common'
  import { dateFilter } from '../../../../../filters'

  export default {
      data() {
          return {
            hasDetails: false,

            wchat_imgurl: null,
            wchat_title: null,
            wchat_desc: null,
            wchat_link: null,
            wchat_content: null,
            contentType: "0",
          }
        },
        methods: {
          initDetails: function () {
              const _this = this
            _this.contentType = getlocalStorage("wchat_preview_contentType")
            _this.wchat_imgurl = getlocalStorage("wchat_preview_wchat_imgurl")
            _this.wchat_title = getlocalStorage("wchat_preview_wchat_title")
            _this.wchat_desc = getlocalStorage("wchat_preview_wchat_desc")
            _this.wchat_link = getlocalStorage("wchat_preview_wchat_link")
            _this.wchat_content = getlocalStorage("wchat_preview_wchat_content")
          },
          showDetails: function () {
              const _this = this
              if(_this.contentType === "1") {
                  //window.location.href = _this.wchat_link
                window.open(_this.wchat_link,"preview_details")
              } else {
                //_this.hasDetails = true
                //window.location.href = "#/previewwchat/1"
                window.open("#/previewwchat/1","preview_details")
              }
          },
          dateFilter,
        },
        created () {
          const _this = this

          if(_this.$route.params["type"] == "1") {
            _this.hasDetails = true
          }

          _this.initDetails()

          setInterval(function () {
              _this.initDetails()
          },200)
        }
  }

</script>
