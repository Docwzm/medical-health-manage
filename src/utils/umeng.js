//友盟统计，根据域名区分统计账号。
const _umId = {
  'dev': 1261954418,
  'qa': 1260948329,
  'qa2': 1265329834,
  'online': 1260952126
};

const _host = location.hostname;
let _hostType = 'dev';
if (_host.indexOf('cdn') !== -1) {
  _hostType = 'online'
} else if (_host.indexOf('qa2') !== -1) {
  _hostType = 'qa2'
} else if (_host.indexOf('qa') !== -1) {
  _hostType = 'qa'
}

const umIdByHost = _umId[_hostType];
const umScript = document.createElement('script');
umScript.src = 'https://s95.cnzz.com/z_stat.php?id=' + umIdByHost + '&web_id=' + umIdByHost;
umScript.setAttribute('language', 'JavaScript');
document.head.appendChild(umScript);

const _czc = [];
umScript.onload = function () {
  //声明_czc对象
  const _czc = _czc || [];
  //绑定siteid
  _czc.push(["_setAccount", umIdByHost]);
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  if (isAndroid) {
    _czc.push(["_setCustomVar", "安卓用户", "是"]);
  }
  if (isiOS) {
    _czc.push(["_setCustomVar", "苹果用户", "是"]);
  }
};

export default function logEvent(type, action, label) {
  _czc.push(["_trackEvent", type, action, label]);
};
