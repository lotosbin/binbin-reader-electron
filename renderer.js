const {ipcRenderer} = require('electron')
function open_in_detail(url) {
  ipcRenderer.send('open_in_detail', url)
}
document.getElementById('open_in_detail').onclick=function(){
  open_in_detail('http://www.baidu.com')
}
