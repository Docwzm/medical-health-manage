<style lang="less">
  @import "./Message.less";
</style>

<template>
  <div class="message">
    <div v-for="(el,index) in els()" :key="index">
      <div v-if="type(el) == 'TIMTextElem'" :style="{'line-height': `${getText(el).length > 52 ? '1.8' : '52px'}`}">{{getText(el)}}</div><!--文本消息-->
      <div v-if="type(el) == 'TIMImageElem'" class="img_box"><img :src="getIMG(el)" @click="showIMG(el)"></div><!--图片消息-->
      <div v-if="type(el) == 'TIMSoundElem'" class="sound_box" v-html="getAudio(el)"></div><!--语音消息-->
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import showImg from './showImg.vue'
  export default {
    name: 'chat-message',
    props: {
      msg: Object, // 要解析的消息对象
    },
    data () {
      return {
        audio: {},
        show: null
      }
    },
    computed: {},
    methods: {
      els () { //获取消息包含的元素数组
        return this.msg.elems || this.msg.MsgBody
      },
      type (elem) { //获取元素类型
        return elem.type || elem.MsgType
      },
      getContent (elem) { //获取元素对象
        return elem.content || elem.MsgContent
      },
      getText(elem) {//解析文本消息元素
        const content = this.getContent(elem)
        return content.text || content.Text;
      },
      getIMG(elem){//解析图片消息元素
        const content = this.getContent(elem)
        let url = '';
        content.ImageInfoArray.forEach(img => {
          url += url ? '#' : '';
          url += img.url || img.URL
        })
        return url
      },
      getAudio(elem){ // 解析语音消息元素
        const content = this.getContent(elem)
        let second = parseInt(content.second || content.Second);
        second = second >= 1000 ? (second / 1000) : second;//获取语音时长
        const downUrl = content.downUrl || content.URL;
        return '<span class="audio" style="width:' + (10 + Math.pow(second / 10, 0.5) * 100) + 'px;max-width: 240px" onclick="playAudio(this,\'' + downUrl + '\',' + second + ')">' + second + '"</span>';
      },
      showIMG(el){
        if (!this.showImg) {
          this.showImg = new Vue(showImg).$mount(document.createElement('div'));
          this.showImg.url = this.getIMG(el)
          this.$root.$el.appendChild(this.showImg.$el);
        }
        this.showImg.show = true
      }
    },
  }
</script>
