var remote = require('electron').remote;
var dialog = remote.dialog;
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
      this.feeds = feeds
    }
  }
})
feedStorage.Init()
function onImport() {
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) return;
    var fileName = fileNames[0];
    fs.readFile(fileName, 'utf-8', function (err, data) {
      console.log(data)
      opmlToJSON(data, function (err, json) {
        console.log(JSON.stringify(json))
        var rss = jsonPath.resolve(json, "/children[*]/children[*]")
        console.log(JSON.stringify(rss))
        feedStorage.AddRange(rss)
        //update
        UpdateFeeds()
      })
    });
  });
}
function UpdateFeeds(callback) {
  feedStorage.Find({}, function (error, results) {
    console.log(results.rows.length)
    feedsVue.updateFeeds(results.rows)
    if (callback)callback(null, results.rows)
  });
}
var feedService = require('./feed')
var _ = require('lodash')
module.exports = {
  UpdateFeeds: UpdateFeeds,
  UpdateFeedsArticles: function (callback) {
    UpdateFeeds(function (error, feeds) {
      Promise.all(_.map(feeds, (feed)=>new Promise((resolve)=> {
        feedService.open_in_list(feed.xmlurl, function (error) {
          resolve({})
        })
      })))
        .then(()=> {
          if (callback)callback(null)
        })
    })
  }
}
