import Component from 'vue-class-component'
import {
  savelocalStorage,
  getlocalStorage,
} from '../../../api/common'
import {getter} from '../../../decorators'
// getters
import {shortcutMenus, shortcutMenus2} from '../../../store/getters/menus'
// styles
import './index.styl'

import router from '../../../router'


@Component
export default class Left {

  @getter(shortcutMenus)
  shortcutMenus
  @getter(shortcutMenus2)
  shortcutMenus2
  homeIcon = require('!!raw!../../../../static/admin/icon_sidetbarleft_home.svg')
  checkMenu = '0'
  // opensMenu = ['0','1','2','3','4','5','6','7','8','9','10']
  fullPath = router.currentRoute.fullPath

  render(h) {
    if (getlocalStorage('roleType') == 0 || !getlocalStorage('roleType')) {
      this.homeUrl = {path: '/home'}
      this.menus = this.shortcutMenus
    } else {
      this.homeUrl = {path: '/admin'}
      this.menus = this.shortcutMenus2
    }
    const _this = this
    clearInterval(getlocalStorage('leftMenuCheck'))
    var id = setInterval(function(){
      for (var i = 0; i < _this.menus.length; i++) {
        for (var j = 0; j < _this.menus[i].subMenus.length; j++) {
          if (router.currentRoute.fullPath.indexOf(_this.menus[i].subMenus[j].link.path) > -1) {
            if(_this.checkMenu != `${i}-${j}`) {
              _this.checkMenu = `${i}-${j}`
            }
          }
        }
      }
      if(router.currentRoute.fullPath == '/admin' || router.currentRoute.fullPath == '/home') {
        if(_this.checkMenu != '-1') {
          _this.checkMenu = '-1'
        }
      }
      if(router.currentRoute.fullPath.indexOf('home/customer/edit') > -1) {
        if(_this.checkMenu != getlocalStorage('menu-save')) {
          _this.checkMenu = getlocalStorage('menu-save')
        }
      }
      if(router.currentRoute.fullPath.indexOf('home/customer/info') > -1 || router.currentRoute.fullPath.indexOf('home/customer/chat') > -1 || router.currentRoute.fullPath.indexOf('home/customer/record') > -1) {
        if(_this.checkMenu != getlocalStorage('menu-save')) {
          _this.checkMenu = getlocalStorage('menu-save')
        }
      }
      if(router.currentRoute.fullPath.indexOf('home/doctor/info') > -1 || router.currentRoute.fullPath.indexOf('doctor/message/') > -1 || router.currentRoute.fullPath.indexOf('admin/message/list') > -1) {
        if(_this.checkMenu != '0') {
          _this.checkMenu = '0'
        }
      }
    },1000)
    savelocalStorage('leftMenuCheck', id)

    return (
        <div class="left_layout">
          <el-menu default-active={this.checkMenu} router>
            <el-menu-item index="-1" route={this.homeUrl}>
              <div domPropsInnerHTML={this.homeIcon} class="icon"></div>
              <span class="name">首页</span></el-menu-item>
            {
              this.menus.map((menu, i) => (
                  <el-menu-item-group title={menu.text}>
                    <div domPropsInnerHTML={menu.icon} class="icon"></div>
                    {menu.subMenus.map((sub, k) => (
                        <el-menu-item index={ `${i}-${k}` } route={ sub.route }>{sub.text}</el-menu-item>
                    ))}
                  </el-menu-item-group>
              ))}
          </el-menu>
        </div>
    )

  }
}


