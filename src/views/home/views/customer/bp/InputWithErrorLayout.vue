<style lang="stylus" rel="stylesheet/stylus" scoped>
.wrapper
  position relative
  display inline-block
  vertical-align middle
.error-msg
  position absolute
  top 100%
  left 0
  color red
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .__input-layout-with-err-msg
    &.err
      input
        border-color red

      .el-input-group__append
        border-color red
</style>
<template>
  <div
    class="wrapper __input-layout-with-err-msg" :class="errMsg?'err':''" :style="{'width':fieldConfig.width+'px'}">
    <slot name="input"></slot>
    <span class="error-msg" v-text="errMsg" v-show="errMsg!=''"></span>
  </div>
</template>
<script type="text/babel">
  export default{
    props:['field-config'],
    data(){
      return {
        errMsg:''
      }
    },
    methods:{
      checkField(){
        this.errMsg = this.fieldConfig.test(this.$el.querySelector('input').value)
        //this.errMsg = this.fieldConfig.test(this.fieldConfig.v)
      }
    },

    mounted(){
      let $el = this.$el.querySelector('input')
      for(let i=0; i< this.fieldConfig.events.length;i++){
        $el.addEventListener(this.fieldConfig.events[i],this.checkField)
      }
      this.$el.addEventListener('reset',()=>this.errMsg = '')
    },
//    beforeDestroy(){
//      let $el = this.$el.querySelector('input')
//      for(let i=0; i< this.fieldConfig.events.length;i++){
//        $el.removeEventListener(this.fieldConfig.events[i],this.checkField)
//      }
//    }
  }
</script>
