"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Vue = require('vue');
const reader = require('feed-reader');
const article_1 = require('../storage/article');
const emitter_1 = require('./emitter');
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
            event.preventDefault();
            emitter_1.default.emit('open_in_detail', entry);
            console.log('emit');
        }
    }
});
class Feed {
    UpdateList() {
        return __awaiter(this, void 0, void 0, function* () {
            article_1.default.Find({}, (error, results) => {
                console.log(results.rows.length);
                entryVue.UpdateEntries(results.rows);
            });
        });
    }
    open_in_list(xmlurl, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            entryVue.UpdateProgress(50);
            try {
                this.GrabAndUpdateArticles(xmlurl, () => {
                });
                entryVue.UpdateProgress(80);
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
    }
    GrabAndUpdateArticles(xmlurl, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let feed = yield reader.parse(xmlurl);
            article_1.default.AddRange(feed.entries, xmlurl, () => {
            });
            if (callback)
                callback();
        });
    }
}
exports.Feed = Feed;
var feed = new Feed();
emitter_1.default.on('open_in_list', (f) => {
    feed.open_in_list(f.xmlurl, () => {
    });
});
emitter_1.default.on('refresh_list', (f) => {
    feed.UpdateList();
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = feed;
//# sourceMappingURL=feed.js.map