<style lang="less">
  @import "./showImg.less";
</style>

<template>
  <div class="show_img" v-if="show">
    <div @click="close">x</div>
    <i></i>
    <img :src="url"/>
  </div>
</template>

<script>
  export default {
    name: 'chat-message-img',
    props: {
      url: String, // 图片地址
      width: Number, // 图片宽度
      height: Number, // 图片高度
    },
    data () {
      return {
        show: false
      }
    },
    computed: {},
    methods: {
      close(){
        this.show = false
      }
    },
  }
</script>
