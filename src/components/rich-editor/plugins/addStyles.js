export default function(){
  var editor = this;
  var $txt = editor.$txt;

  $txt.on('click', 'img', function (e) {
    var $img = $(e.currentTarget);
    alert($img.attr('src'));
  });
}
