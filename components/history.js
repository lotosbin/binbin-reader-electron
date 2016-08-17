"use strict";
/**
 * Created by liubinbin on 16/08/2016.
 */
var emitter_1 = require("./emitter");
var Vue = require('vue');
var vm = new Vue({
    el: '#readhistory',
    data: {
        histories: []
    },
    methods: {
        AddHistory: function (article) {
            this.histories.unshift(article);
        }
    }
});
emitter_1.default.on('open_in_detail', function (entry) {
    console.log('addhistory');
    vm.AddHistory(entry);
});
var default_1 = (function () {
    function default_1() {
    }
    return default_1;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=history.js.map