<style lang="less" scoped>
</style>

<template>
  <my-table
          :data="tableData"
          @selection-change="handleSelectionChange">
    <my-table-column
            type="selection"
            width="55">
    </my-table-column>
    <my-table-column
            label="序号"
            type="index"
            width="80">
    </my-table-column>
    <my-table-column
            property="name"
            label="姓名"
            width="180">
    </my-table-column>
    <my-table-column
            property="city"
            label="地址"
            width="180">
    </my-table-column>
    <my-table-column
            inline-template
            label="操作">
      <div>hello</div>
    </my-table-column>
  </my-table>
</template>

<script type="text/babel">
  import MyTable from '../../../../../../components/common/table/MyTable'
  import MyTableColumn from '../../../../../../components/common/table/MyTableColumn'

  export default {
    name: 'MyTableTest',
    components: {
      MyTable,
      MyTableColumn,
    },
    data () {
      const generate = (size, treeLevel) => {
        if (treeLevel < 1) {
          return []
        }
        return [...new Array(size)].map(() => ({
          name: '姓名',
          city: '广州',
          children: generate(size, treeLevel - 1)
        }))
      }
      return {
        tableData: generate(20, 2),
        multipleSelection: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

