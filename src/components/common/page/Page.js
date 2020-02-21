import Component from 'vue-class-component'
import {prop} from 'vue-property-decorator'

import LoadingSpinner from '../spinner/loadingSpinner'

import './style.less'

@Component
export default class Page {
  @prop({
    type: Boolean,
    default: false,
  })
  loading

  render(h) {
    //   return (
    //       <div class="my-page">
    //         {this.loading ? (
    //                 <div class="my-page-loading">
    //                   <LoadingSpinner loading/>
    //                 </div>
    //             ) : this.$slots.default}
    //       </div>
    //   )
    // }
    return (
        <div class="my-page">
          <div v-show={this.loading} class="my-page-loading">
            <LoadingSpinner loading/>
          </div>
          <div v-show={this.loading} class="bg"></div>
          {this.$slots.default}
        </div>
    )
  }
}
