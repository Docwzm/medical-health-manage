import './style.less'
export default {
  name: 'my-date-picker',
  functional: true,
  render: function (h, context) {
    return (
        <el-date-picker {...{
          ...context.data,
          props: context.props,
          class: {
            ...context.data.class,
            'my-date-picker': true
          },
          on: {
            ...context.data.on,
            input: (date) => context.data.on.input(date && date.getTime() || '')
          }
        }}>
          {context.children}
        </el-date-picker>
    )
  },
  props: {
    format: String,
    readonly: Boolean,
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    align: {
      type: String,
      default: 'left'
    },
    value: {},
    haveTrigger: {},
    pickerOptions: {}
  },
}
