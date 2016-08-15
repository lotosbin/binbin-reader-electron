/**
 * Created by liubinbin on 16/08/2016.
 */
var Vue = require('vue');
var vue = new Vue({
  el: '#detail',
  data: {
    progress:0
  },
  methods: {
    UpdateProgress:function (progress) {
      this.progress = progress
    } 
  }
})
var webview = document.getElementById('webview');
webview.addEventListener('did-start-loading', function () {
  vue.UpdateProgress(20)
})
webview.addEventListener('did-stop-loading', function () {
  vue.UpdateProgress(100)
})
function open_in_detail(url) {
  webview.src = url
}
module.exports = {
  open_in_detail:open_in_detail
} 
