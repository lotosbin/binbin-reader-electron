"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var Vue = require('vue');
var reader = require('feed-reader');
var articleStorage = require('../storage/article');
var emitter_1 = require('./emitter');
var entryVue = new Vue({
    el: '#entryList',
    data: {
        progress: 0,
        entries: []
    },
    methods: {
        UpdateEntries: function (entires) {
            this.entries = entires;
        },
        UpdateProgress: function (progress) {
            this.progress = progress;
        },
        on_open_in_detail: function (event, entry) {
            emitter_1.default.emit('open_in_detail', entry);
            console.log('emit');
        }
    }
});
var Feed = (function () {
    function Feed() {
    }
    Feed.prototype.UpdateList = function () {
        return __awaiter(this, void 0, void 0, function* () {
            articleStorage.Find({}, function (error, results) {
                console.log(results.rows.length);
                entryVue.UpdateEntries(results.rows);
            });
        });
    };
    Feed.prototype.open_in_list = function (xmlurl, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            entryVue.UpdateProgress(50);
            try {
                var feed_1 = yield reader.parse(xmlurl);
                entryVue.UpdateProgress(80);
                articleStorage.AddRange(feed_1.entries, xmlurl);
                yield this.UpdateList();
                entryVue.UpdateProgress(100);
                if (callback)
                    callback(null);
            }
            catch (error) {
                console.error(JSON.stringify(error));
                entryVue.UpdateProgress(100);
                if (callback)
                    callback(error);
            }
        });
    };
    return Feed;
}());
exports.Feed = Feed;
var feed = new Feed();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = feed;
//# sourceMappingURL=feed.js.map