//切换播放audio对象
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
var context,
  source,
  curObj,
  curUrl,
  startType,
  // startTime = 0,
  buffer,
  timer,
  time;
try {
  context = new AudioContext(), source = context.createBufferSource();
} catch (e) {
  console.error('不支持AudioContext播放语音：', e)
}
// startOffset = 0;
function playAudio(thisObj, thisUrl, thisTime) {
  if (!thisUrl || thisUrl == 'undefined' || thisUrl == 'null') {
    return
  }
  if (!context) {
    alert('IE浏览器不支持播放该语音！')
    return
  }
  clear()
  thisObj.className = "audioPlay";
  // if(source.buffer){
  //     // 暂停
  //     if (curUrl == thisUrl && startType) {
  //         source.stop();
  //         startType = false;
  //         startOffset += context.currentTime - startTime;
  //         return
  //     }
  //     // 播放
  //     if (curUrl == thisUrl && !startType) {
  //         startTime = context.currentTime;
  //         source = context.createBufferSource();
  //         source.buffer = buffer;
  //         source.connect(context.destination);
  //         source.start(0, startOffset % buffer.duration);
  //         startType = true;
  //         return
  //     }
  // }
  if (curUrl == thisUrl && !startType) {
    start()
  }
  if (curUrl != thisUrl || !source.buffer) {
    curUrl = thisUrl;
    curObj = thisObj;
    time = thisTime;
    fetchBlob(curUrl, function (blob) {
      readBlob(blob, function (data) {
        play(data);
      });
    });
  }
}
function startWith(str0, str1) {
  if (str1 == null || str1 == "" || str0.length == 0 || str1.length > str0.length)
    return false;
  if (str0.substr(0, str1.length) == str1)
    return true;
  else
    return false;
}

function fetchBlob(url, callback) {
  var xhr = new XMLHttpRequest();
  var protocol = location.protocol;
  if (!startWith(url, protocol)) {
    url = protocol + url.slice(protocol.length - 1)
  }
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    callback(this.response);
  };
  xhr.onerror = function (e) {
    console.error(e)
    alert('获取语音文件失败：' + url);
  };
  xhr.send();
}

function readBlob(blob, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    callback(data);
  };
  reader.readAsArrayBuffer(blob);
}

function play(array) {
  var samples = AMR.decode(array);
  if (!samples) {
    alert('语音文件解码失败!');
    return;
  }
  buffer = context.createBuffer(1, samples.length, 8000);
  if (buffer.copyToChannel) {
    buffer.copyToChannel(samples, 0, 0)
  } else {
    var channelBuffer = buffer.getChannelData(0);
    channelBuffer.set(samples);
  }
  // startTime = context.currentTime;
  // startType = true;
  start()
}
function start() {
  startType = true;
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
  timer = setTimeout(clear, (time + 1) * 1000);
}
function clear() {
  if (!curObj) {
    return;
  }
  if (source) {
    try {
      source.stop();
    } catch (e) {
      console.error(e)
    }
  }
  startType = false;
  curObj.className = "audio";
  clearTimeout(timer);
}
