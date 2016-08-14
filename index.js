function open_in_detail(url) {
  document.getElementById('webview').src = url
}

var remote = require('electron').remote;
var dialog = remote.dialog;
var fs = require('fs');
var opmlToJSON = require('opml-to-json');
var jsonPath = require('json-path');
var feedStorage = require('./storage/feed');
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
function UpdateFeeds() {
  feedStorage.Find({}, function (error, results) {
    console.log(results.rows.length)
    feedsVue.updateFeeds(results.rows)
  });
}
UpdateFeeds();
var entryVue = new Vue({
  el:'#entryList',
  data:{
    entries:[]
  },
  methods:{
    UpdateEntries:function (entires) {
      this.entries = entires
    }
  }
})
var reader = require('feed-reader');
function open_in_list(xmlurl) {
  reader.parse(xmlurl)
    .then(function (feed) {
      console.log(JSON.stringify(feed))
      entryVue.UpdateEntries(feed.entries)
    })
    .catch(function (error) {
      console.error(JSON.stringify(error))
    })
}
