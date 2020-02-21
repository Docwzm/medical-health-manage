 let menu= [
  'source',
  '|',
  'bold',
  'underline',
  'italic',
  'strikethrough',
  'eraser',
  'forecolor',
  'bgcolor',
  '|',
  'quote',
  'fontfamily',
  'fontsize',
  'head',
  'unorderlist',
  'orderlist',
  'alignleft',
  'aligncenter',
  'alignright',
  '|',
  'link',
  'unlink',
  'table',
  'emotion',
  '|',
  'img',
  'video',
  'location',
  'insertcode',
  '|',
  'undo',
  'redo',
  'fullscreen',
  '|'
];

function addMenuItem(menuObj){
  menu.push(menuObj.id)
  window.wangEditor.createMenu(menuObj)
}

addMenuItem(require('./menuItems/add-styles').default)


export default menu
