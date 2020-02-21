<style lang="less" scoped>
  @import "./style.less";
</style>

<template>
  <div class="head_upload" :style="style">
    <div class="img">
      <div v-if="loading">
        <my-progress class="progress" type="circle" :percentage="loaded" :width="100"></my-progress>
      </div>
      <img :src="url" alt="头像">
    </div>
    <label v-if="name">
      点击上传
      <input
              type="file"
              :name="name"
              :id="name"
              :accept="accept"
              @change="headUpload">
    </label>
    <span class="label">
      只能上传 jpg/png/bmp文件 <br/>
      且不超过2M</span>
  </div>
</template>

<script type="text/babel">
  import MyProgress from '../progress/MyProgress'
  import {uploadFileApi} from '../../../api/file'
  export default {
    name: 'head-upload',
    props: {
      style: String,
      name: {
        type: String,
        default: 'headimgurl'
      },
      accept: {
        type: String,
        default: 'jpg,png,bmp'
      },
      url: {
        type: String,
        default: ''
      }
    },
    components: {
      MyProgress
    },
    data () {
      return {
        loaded: 0,
        loading: false
      }
    },
    methods: {
      headUpload: async function (e) {
        this.loading = true
        this.loaded = 0
        const file = e.target.files[0]
        this.$emit('head-upload', window.URL.createObjectURL(file))
        const {url} = await uploadFileApi(file, this.progress)
        this.loading = false
        this.$emit('head-upload', url)
      },
      progress ({loaded, total}) {
        this.loaded = parseInt(loaded * 1000 / total) / 10
      }
    }
  }
</script>
