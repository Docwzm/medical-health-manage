import './style.less'
export default {
  functional: true,
  render: function (h, context) {
    // context.props.trigger = 'hover' // 修改props的值
    return (
        <el-popover
            {...{
              ...context.data,
              props: context.props,
              class: {
                ...context.data.class,
              }
            }
            }>
          {context.children}
        </el-popover>
    )
    // return createElement(
    //   'el-popover',
    //   {
    //     ...context.data,
    //     props: context.props,
    //   },
    //   context.children
    // )
  },
  props: {
    popperClass: {
      type: String,
      default: 'my_popover'
    },
  },
}
