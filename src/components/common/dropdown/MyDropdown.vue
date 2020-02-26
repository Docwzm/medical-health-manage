<style lang="less" scoped>
  @import "MyDropdown.less";
</style>

<template>
  <MyDropdown class="my_dropdown" trigger="click">
    <my-button :type="butype">
      {{labels}}<i class="el-icon-caret-bottom el-icon--right"></i>
    </my-button>
    <MyDropdownMenu>
      <MyDropdownItem v-for="(item, index) in menu" :key="index" @click.native="check(item)">{{item.name}}</MyDropdownItem>
    </MyDropdownMenu>
  </MyDropdown>
</template>

<script type="text/babel">
  import MyButton from '../button/MyButton'
  import MyDropdown from '../dropdown/MyDropdown'
  import MyDropdownItem from '../dropdown/MyDropdownitem'
  import MyDropdownMenu from '../dropdown/MyDropdownmenu'
  import {mapGetters} from '../../../utils/vuex'
  import router from '../../../router'
  // getters
  import {queryGetter} from '../../../store/getters/route'
  export default {
    name: 'my-dropdown',
    data() {
      return {
        labels: ''
      }
    },
    props: {
      label: {
        type: [String, Number],
        default: '菜单'
      },
      change: {
        type: Boolean,
        default: false
      },
      butype: {
        type: String,
        default: 'primary'
      },
      value: {
        type: [Number, String],
        default: 0
      },
      menu: {
        type: Array,
        default: []
      },
      async: String
    },
    components: {
      MyButton,
      MyDropdown,
      MyDropdownItem,
      MyDropdownMenu
    },
    computed: {
      ...mapGetters({
        query: queryGetter
      }),
    },
    mounted () {
      this.labels = this.label || ''
    },
    methods: {
      async check ({key, name}) {
        if (this.async) {
          await router.replace({
            query: {
              ...this.query,
              [this.async]: key,
              page: 1
            }
          })
        }
        if (this.change) this.labels = name
        this.$emit('check', key)
      },
    },
  }
</script>
