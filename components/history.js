"use strict";
/**
 * Created by liubinbin on 16/08/2016.
 */
const emitter_1 = require("./emitter");
const Vue = require('vue');
var vm = new Vue({
    el: '#readHistory',
    data: {
        histories: []
    },
    methods: {
        AddHistory: function (article) {
            this.histories.unshift(article);
        }
    }
});
emitter_1.default.on('open_in_detail', (entry) => {
    console.log('addhistory');
    vm.AddHistory(entry);
});
class History {
    Init() {
    }
}
var history = new History();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = history;
//# sourceMappingURL=history.js.map