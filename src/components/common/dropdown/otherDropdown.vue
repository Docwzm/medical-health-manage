<style lang="less" scoped>
  @import "MyDropdown.less";
</style>

<template>
  <div class="otherDropdowns">
    <span @click="setType" style="padding: 10px 6px 10px 22px;">{{label}}</span>
    <MyDropdown class="my_dropdown" trigger="click" style="padding-right: 14px">
      <i class="el-icon-caret-bottom el-icon--right"></i>
      <MyDropdownMenu>
        <MyDropdownItem :class="{'active': parseInt(value) === index+1}" v-for="(item, index) in menu" @click.native="check(item.key)">{{item.name}} {{parseInt(value) === index+1 ? '&nbsp;&nbsp;&nbsp;&radic;' : ''}}</MyDropdownItem>
      </MyDropdownMenu>
    </MyDropdown>
  </div>
</template>

<script type="text/babel">
//  import MyButton from '../button/MyButton'
  import MyDropdown from '../dropdown/MyDropdown'
  import MyDropdownItem from '../dropdown/MyDropdownitem'
  import MyDropdownMenu from '../dropdown/MyDropdownmenu'
  import {mapGetters} from '../../../utils/vuex'
  import router from '../../../router'
  // getters
  import {queryGetter} from '../../../store/getters/route'
  export default {
    name: 'other-dropdown',
    props: {
      label: {
        type: [String, Number],
        default: '菜单'
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
//      MyButton,
      MyDropdown,
      MyDropdownItem,
      MyDropdownMenu
    },
    computed: {
      ...mapGetters({
        query: queryGetter
      }),
    },
    methods: {
      setType () {
        this.$emit('check', 'send')
      },
      async check (index) {
        if (this.async) {
          await router.replace({
            query: {
              ...this.query,
              [this.async]: index,
              page: 1
            }
          })
        }
        this.$emit('check', index)
      },
    },
  }
</script>
