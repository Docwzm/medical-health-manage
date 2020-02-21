//todo 外链样式引用依然要考虑加入随机参数
function addStyles(check) {
  const menuId = 'add-style-set'
  const E = window.wangEditor
  if (!check(menuId))return
  const editor = this
  const menu = new E.Menu({
    editor: editor,
    title: '样式表',
    $domNormal: $('<a style="font-size: 11px" href="#" tabindex="-1">样式表</a>'),
    $domSelected: $('<a style="font-size: 11px" href="#" tabindex="-1" class="selected">添加样式表</a>')
  })

  let styles = []
  const $panel = $('<div class="-pannel-">')

  const diffArr = (a1,a2)=>{
    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }

    for (var k in a) {
      diff.push(k);
    }

    return diff;
  }

  const updateStyleList = () =>{
    $panel.html(
      `
      <ul>
      
      ${
        styles.map(s => `<li><span>${s}</span> <button class="remove-style">移除</button></li>`)

        }
      </ul>
      <div>
        <input type="text" class="style-name-input"><button class="add-style">添加样式表</button>
      </div>
        `)
    if(editor.$txt){

      editor.$txt.html(`${styles.map(s => `<link rel="stylesheet" href="${s}?r=${new Date().getTime()}">`)}${$('<div>').append(editor.$txt.html()).find('[rel=stylesheet]').remove().end().html()}`)
    }

  }

  //<link rel="stylesheet" href="a.css"></link>

  editor.onchange=()=>{
    console.log('editor onchange')
    //parse styles
    let $stylesheets = []
    try{
      $stylesheets = $('<div>').append($(editor.$txt.html()).clone()).find('[rel=stylesheet]')
    }catch (e){
      console.error(e)
    }

    let contentStyles =[]
    $stylesheets.each((i,e)=>contentStyles.push(e.href.replace(/\?r=\d+/,'')))
    //去重
    contentStyles = Array.from(new Set(contentStyles))
    //todo diff array and updateStyleList()
    //console.log(diffArr(contentStyles,styles))
    if(diffArr(contentStyles,styles).length!=0){
      styles = contentStyles
      updateStyleList()

    }
  }

  updateStyleList()


  menu.dropPanel = new E.DropPanel(editor, menu, {
    $content: $panel,
    width: 350
  });
  $panel.on('click',e=>{
    e.preventDefault()

    let clz = e.target.className
    if(clz=='add-style'){
      let val = $panel.find('input').val()
      styles.push(val)
      updateStyleList()
    }else if(clz=='remove-style'){
      let val = $(e.target.closest('li')).find('span').html()
      styles = styles.filter(e=>e!=val)
      updateStyleList()
    }
    if(e.target.tagName.toLowerCase()=='button'){
      e.stopPropagation()
    }
  })

  // 增加到editor对象中
  editor.menus[menuId] = menu;
}
addStyles.id = 'add-style-set'
export default addStyles
