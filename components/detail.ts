/**
 * Created by liubinbin on 16/08/2016.
 */
import {shell} from 'electron'
import * as Vue from 'vue'
import emitter from "./emitter";
var vue = new Vue({
  el: '#detail',
  data: {
    url: 'http://www.yuanjingtech.com',
    progress: 0
  },
  methods: {
    UpdateUrl: function (url) {
      this.url = url
    },
    UpdateProgress: function (progress) {
      this.progress = progress
    },
    OnOpenInBrowser: function (event) {
      shell.openExternal(this.url)
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
class Detail {
  Init() {
    
  }
}

emitter.on("open_in_detail", (entry) => {
  var url = entry.link
  vue.UpdateUrl(url)
  webview.src = url
});
var detail = new Detail();
export default detail

