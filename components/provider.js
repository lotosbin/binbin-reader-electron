"use strict";
const electron_1 = require('electron');
var dialog = electron_1.remote.dialog;
const fs = require('fs');
const opmlToJSON = require('opml-to-json');
const jsonPath = require('json-path');
const feed_1 = require('../storage/feed');
const Vue = require('vue');
const feed_2 = require('./feed');
const _ = require('lodash');
const emitter_1 = require("./emitter");
var feedsVue = new Vue({
    el: '#app',
    data: {
        feeds: []
    },
    methods: {
        updateFeeds: function (feeds) {
            this.feeds = feeds;
        },
        on_open_in_list: function (feed, $event) {
            $event.preventDefault();
            emitter_1.default.emit('open_in_list', feed);
        },
        onImport: function () {
            dialog.showOpenDialog(function (fileNames) {
                if (fileNames === undefined)
                    return;
                var fileName = fileNames[0];
                fs.readFile(fileName, 'utf-8', function (err, data) {
                    opmlToJSON(data, function (err, json) {
                        var rss = jsonPath.resolve(json, "/children[*]/children[*]");
                        feed_1.default.AddRange(rss, () => {
                        });
                        provider.UpdateFeeds(() => {
                        });
                    });
                });
            });
        }
    }
});
feed_1.default.Init();
class Provider {
    UpdateFeeds(callback) {
        feed_1.default.Find({}, function (error, results) {
            feedsVue.updateFeeds(results.rows);
            if (callback)
                callback(null, results.rows);
        });
    }
    UpdateFeedsArticles(callback) {
        this.UpdateFeeds(function (error, feeds) {
            Promise.all(_.map(feeds, (feed) => new Promise((resolve) => {
                feed_2.default.GrabAndUpdateArticles(feed.xmlurl, function (error) {
                    resolve({});
                });
            })))
                .then(() => {
                if (callback)
                    callback(null);
            });
        });
    }
}
var provider = new Provider();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = provider;
//# sourceMappingURL=provider.js.map