"use strict";
/**
 * Created by liubinbin on 16/08/2016.
 */
const electron_1 = require('electron');
const Vue = require('vue');
const emitter_1 = require("./emitter");
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
class Detail {
    Init() {
    }
}
emitter_1.default.on("open_in_detail", (entry) => {
    var url = entry.link;
    vue.UpdateUrl(url);
    webview.src = url;
});
var detail = new Detail();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = detail;
//# sourceMappingURL=detail.js.map