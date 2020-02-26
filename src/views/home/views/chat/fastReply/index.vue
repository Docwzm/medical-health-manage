<style lang="stylus" scoped>
  @import "./index.styl";
</style>
<template>
  <div class="fast-replay-con" tabindex="1" @blur="show=false">
    <div class="fast-replay-btn" @click="show=!show">快捷回复<span class="icon" :class="{'icon-open' :show}"></span></div>
    <div class="fast-replay-list" v-show="show">
        <div class="item" v-for="(item,index) in list" :key="index" @click="setReply(item.word)" >
          <span v-if="item.word.length > 28" :title="item.word">{{item.word | wordFilter}}</span>
          <span v-if="item.word.length <= 28">{{item.word}}</span>
        </div>
        <div class="item item2" @click="goEditor">自定义快捷回复</div>
    </div>

  </div>

</template>
<script>
  import actions from './actions'
  export default{
    data (){
      return {
        show: false,
        id: '',
        list: [],
      }
    },
    props: {
      docotrInfos: {
        type: Object,
      }
    },
    methods: {
        ...actions,
        setReply (val) {
          this.$emit('click', val)
        }
    },
    watch : {
      show (val) {

      },
      docotrInfos ({id}) {
        if(id) {
          this.id = id
          this.init()
        }
      },
    },
    filters: {
      wordFilter (val) {
        if(val.length > 28) {
          return val.substring(0, 28) + '...'
        } else {
          return val
        }
      }
    }
  }
</script>