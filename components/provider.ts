import {remote}  from 'electron'
var dialog = remote.dialog;
import * as fs  from 'fs'
import * as opmlToJSON from 'opml-to-json'
import * as jsonPath from 'json-path'
import feedStorage from '../storage/feed'
import * as Vue from 'vue'
import emmiter from './emitter'

var feedsVue = new Vue({
  el: '#app',
  data: {
    feeds: []
  },
  methods: {
    updateFeeds: function (feeds) {
      this.feeds = feeds
    },
    on_open_in_list: function (feed,$event) {
      $event.preventDefault()
      emitter.emit('open_in_list', feed)
    }
  }
})
feedStorage.Init()
function onImport() {
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) return;
    var fileName = fileNames[0];
    fs.readFile(fileName, 'utf-8', function (err, data) {
      opmlToJSON(data, function (err, json) {
        var rss = jsonPath.resolve(json, "/children[*]/children[*]")
        feedStorage.AddRange(rss,()=>{
          
        })
        UpdateFeeds(()=> {
        })
      })
    });
  });
}
export function UpdateFeeds(callback) {
  feedStorage.Find({}, function (error, results) {
    feedsVue.updateFeeds(results.rows)
    if (callback)callback(null, results.rows)
  });
}

import feedService from './feed'
import * as _ from 'lodash'
import emitter from "./emitter";
export function UpdateFeedsArticles(callback) {
  UpdateFeeds(function (error, feeds) {
    Promise.all(_.map(feeds, (feed)=>new Promise((resolve)=> {
      feedService.GrabAndUpdateArticles(feed.xmlurl, function (error) {
        resolve({})
      })
    })))
      .then(()=> {
        if (callback)callback(null)
      })
  })
}
