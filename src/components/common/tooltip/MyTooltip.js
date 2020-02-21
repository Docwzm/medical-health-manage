import './style.less'
export default {
  name: 'my-tooltip',
  functional: true,
  render: function (h, context) {
    return (
        <el-tooltip {...{
          ...context.data,
          props: context.props,
        }}>
          {context.children}
        </el-tooltip>
    )
  },
  props: {
    value: [Boolean],
    content: [String, Number],
    placement: {
      type: [String, Number],
      default: 'top'
    },
    effect: {
      type: [String, Number],
      default: 'light'
    },
    popperClass: {
      type: [String, Number],
      default: 'my-tooltip'
    },
  },
}
