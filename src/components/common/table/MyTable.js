import './style.less'
export default {
  name: 'my-table',
  functional: true,
  render: function (h, context) {
    return (
        <el-table {...{
          ...context.data,
          props: {
            ...context.props,
          },
          class: {
            ...context.data.class,
            'my_table': true,
          }
        }}>
          {context.children}
        </el-table>
    )
  },
  props: {
    data: { // 显示的数据
      type: Array,
      default: function () {
        return []
      }
    },
    height: [String, Number], // table 的高度，默认高度为空，即自动高度，单位 px
    stripe: { // 是否为斑马纹 table
      type: Boolean,
      default: false
    },
    border: { // 是否带有纵向边框
      type: Boolean,
      default: false
    },
    fit: { // 列的宽度是否自撑开
      type: Boolean,
      default: true
    },
    rowClassName: Function, // 行的 className 的回调。
    rowKey: [Function, String], // 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的
  }
  // events: {
  //   select (selection, row) { // 当用户手动勾选数据行的 Checkbox 时触发的事件
  //     console.log('select\n', selection, row)
  //   },
  //   'select-all' (selection) { // 当用户手动勾选全选 Checkbox 时触发的事件
  //     console.log('select-all\n', selection)
  //   },
  //   'selection-change' (selection) { // 当选择项发生变化时会触发该事件
  //     console.log('selection-change\n', selection)
  //   },
  //   'cell-mouse-enter' (row, column, cell, event) { // 当单元格 hover 进入时会触发该事件
  //     console.log('cell-mouse-enter\n', row, column, cell, event)
  //   },
  //   'cell-mouse-leave' (row, column, cell, event) { // 当单元格 hover 退出时会触发该事件
  //     console.log('cell-mouse-leave\n', row, column, cell, event)
  //   },
  //   'cell-click' (row, column, cell, event) { // 当某个单元格被点击时会触发该事件
  //     console.log('cell-click\n', row, column, cell, event)
  //   },
  //   'row-click' (row, event) { // 当某一行被点击时会触发该事件
  //     console.log('row-click\n', row, event)
  //   },
  //   'sort-change' ({column, prop, order}) { // 当表格的排序条件发生变化的时候会触发该事件
  //     console.log('sort-change\n', column, prop, order)
  //   }
  // }
}
