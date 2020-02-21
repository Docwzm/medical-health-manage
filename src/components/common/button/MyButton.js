import './style.less'
export default {
  name: 'my-button',
  functional: true,
  render: function (h, context) {
    return (
        <el-button {...{
          ...context.data,
          props: context.props,
          class: {
            ...context.data.class,
            'my-button': true
          }
        }}>
          {context.children}
        </el-button>
    )
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
}
