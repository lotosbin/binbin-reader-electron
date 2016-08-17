"use strict";
/**
 * Created by liubinbin on 16/08/2016.
 */
var electron_1 = require('electron');
var Vue = require('vue');
var vue = new Vue({
    el: '#detail',
    data: {
        url: 'http://www.yuanjingtech.com',
        progress: 0
    },
    methods: {
        UpdateUrl: function (url) {
            this.url = url;
        },
        UpdateProgress: function (progress) {
            this.progress = progress;
        },
        OnOpenInBrowser: function (event) {
            electron_1.shell.openExternal(this.url);
        }
    }
});
var webview = document.getElementById('webview');
webview.addEventListener('did-start-loading', function () {
    vue.UpdateProgress(20);
});
webview.addEventListener('did-stop-loading', function () {
    vue.UpdateProgress(100);
});
function open_in_detail(url) {
    vue.UpdateUrl(url);
    webview.src = url;
}
exports.open_in_detail = open_in_detail;
//# sourceMappingURL=detail.js.map