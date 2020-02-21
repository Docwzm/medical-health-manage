<style lang="stylus" scoped>
  @import "../../styles/welcome.styl";
</style>
<style lang="stylus">
  .admin-layout-mac
    font-family "PingFang SC","Hiragino Sans GB", Arial, sans-serif
  .admin-layout
    .index .top-box
       z-index 5 !important
    .top-bg
        position fixed
        z-index 4
  </style>

<script type="text/babel">
  // components
  import Top from './top/index.vue'
  import Left from './left/index.js'
  import MainContent from './main/index'
  import actions from './views/chat/actions'
  import {getlocalStorage} from '../../api/common'
  import {
    INIT_ROOT_STATE
  } from '../../store/mutation-types'
  export default {
    name: 'home',
    components: {},
    methods: {
      ...actions,
    },
    created () {
      //判断用户类型
      let roleType = getlocalStorage('roleType') || 0
      if(roleType) {
        roleType = parseInt(roleType)
        switch(roleType) {
          case 0 :
            this.loginIm()
            break
          case 1 :
            break
        }
      }
      this.$store.dispatch(INIT_ROOT_STATE)
    },
    mounted () {
      //判断是否mac系统
      if(navigator.userAgent.indexOf('Mac') > 0) {
        document.getElementsByClassName('admin-layout')[0].className = 'admin-layout admin-layout-mac'
      }
    },
    render (h) {
      return (
        <div class="admin-layout">
          <Top/>
          <div class="top-bg"></div>
          <div class="admin-bottom-bg"></div>
          <div class="admin-main">
            <div class="admin-left-con">
              <div class="admin-left">
                <Left class=""/>
              </div>
            </div>
            <div class="admin-right-con">
              <div class="admin-content">
                <MainContent/>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
</script>
