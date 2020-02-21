import {saveLevelApi} from '../../../../../api/customer'
//等级选择
export const selectLevel = function (row, event) {
  var _this = this
  var _event = event
  _this.isShowLevel = !_this.isShowLevel
  if (_event) {
    _this.chooseLevelRow = row
    var _item = document.querySelectorAll('.level_select .item')
    for (var i = 0; i < _item.length; i++) {
      if (i == Math.abs(row.level - 3)) {
        _item[i].className = 'item item_active'
      } else {
        _item[i].className = 'item'
      }
    }
    _this.level_x = _event.clientX - 220 - _event.layerX
    _this.level_y = _event.clientY - _event.layerY - 30
    _this.isShowLevel ? _event.target.className = 'level_con level_con_active' : _event.target.className = 'level_con'
  }
}
//等级选择绑定事件
export const selectLevelClick = function (event, level) {
  const _this = this
  var _item = document.querySelectorAll('.level_select .item')
  for (var i = 0; i < _item.length; i++) {
    _item[i].className = 'item'
  }
  event.target.className = 'item item_active'
  for (var j in _this.tableData) {
    if (_this.tableData[j].id == _this.chooseLevelRow.id) {
      _this.tableData[j].level = _this.chooseLevelRow.level = level
    }
  }
}
//隐藏等级筛选
export const hideLevel = async function (row, event) {
  const _this = this
  var _event = event
  _this.isShowLevel = false
  if (_event) {
    _this.isShowLevel ? _event.target.className = 'level_con level_con_active' : _event.target.className = 'level_con'
  } else {
    await saveLevelApi({id: _this.chooseLevelRow.id, level: _this.chooseLevelRow.level})
    var _icon = document.querySelectorAll('.level_con')
    for (var j = 0; j < _icon.length; j++) {
      _icon[j].className = 'level_con'
    }
  }
}
