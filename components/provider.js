"use strict";
var electron_1 = require('electron');
var dialog = electron_1.remote.dialog;
var fs = require('fs');
var opmlToJSON = require('opml-to-json');
var jsonPath = require('json-path');
var feedStorage = require('../storage/feed');
var Vue = require('vue');
var feedsVue = new Vue({
    el: '#app',
    data: {
        feeds: []
    },
    methods: {
        updateFeeds: function (feeds) {
            this.feeds = feeds;
        }
    }
});
feedStorage.Init();
function onImport() {
    dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined)
            return;
        var fileName = fileNames[0];
        fs.readFile(fileName, 'utf-8', function (err, data) {
            opmlToJSON(data, function (err, json) {
                var rss = jsonPath.resolve(json, "/children[*]/children[*]");
                feedStorage.AddRange(rss);
                UpdateFeeds();
            });
        });
    });
}
function UpdateFeeds(callback) {
    feedStorage.Find({}, function (error, results) {
        feedsVue.updateFeeds(results.rows);
        if (callback)
            callback(null, results.rows);
    });
}
exports.UpdateFeeds = UpdateFeeds;
var feed_1 = require('./feed');
var _ = require('lodash');
function UpdateFeedsArticles(callback) {
    UpdateFeeds(function (error, feeds) {
        Promise.all(_.map(feeds, function (feed) { return new Promise(function (resolve) {
            feed_1.default.open_in_list(feed.xmlurl, function (error) {
                resolve({});
            });
        }); }))
            .then(function () {
            if (callback)
                callback(null);
        });
    });
}
exports.UpdateFeedsArticles = UpdateFeedsArticles;
//# sourceMappingURL=provider.js.map