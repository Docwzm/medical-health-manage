<style lang="less" scoped>
  @import "./style.less";
</style>

<template>
  <div class="buttonsBox">
    <el-button-group class="tabs">
      <el-button :disabled="disabled" @click="set(b)" v-for="b in buttons"
                 :class="{'active': b.key === value}">
        {{b.name}}
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
  // components
  export default{
    props: {
      buttons: {
        type: Array,
        default: []
      },
      value: [String, Number],
      disabled: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        tak: null,
      }
    },
    components: {
    },
    computed: {
    },
    methods: {
      set ({key, name}) {
        this.tak = name
        this.$emit('input', key)
      }
    },
    created () {
    },
    mounted(){
    },
    destroyed () {
    }
  }
</script>
