import './style.less'
export default {
  name: 'my-switch',
  functional: true,
  render: function (h, context) {
    return (
        <el-switch {...{
          ...context.data,
          props: context.props,
          class: {
            ...context.data.class,
            'my-switch': true
          }
        }}>
          {context.children}
        </el-switch>
    )
  },
  props: {
    // value: [Boolean, Number],
    disabled: [Boolean, Number], // 是否禁用
    width: { // switch 的宽度（像素）
      type: Number,
      default: 40
    },
    onIconClass: String, // switch 打开时所显示图标的类名，设置此项会忽略 on-text
    offIconClass: String, // switch 关闭时所显示图标的类名，设置此项会忽略 off-text
    onText: { // switch 打开时的文字
      type: String,
      default: ''
    },
    offText: { // switch 关闭时的文字
      type: String,
      default: ''
    },
    onColor: String, // switch 打开时的背景色
    offColor: String, // switch 关闭时的背景色
    name: String // switch 对应的 name 属性
  },
}
