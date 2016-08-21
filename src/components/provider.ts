import {remote}  from "electron";
let dialog = remote.dialog;
import * as fs  from "fs";
import * as opmlToJSON from "opml-to-json";
import * as jsonPath from "json-path";
import feedStorage from "../storage/feed";
import feedService from "./feed";
import * as Vue from "vue";
import * as _ from "lodash";
import emitter from "./emitter";


let feedsVue = new Vue({
  el: "#app",
  data: {
    feeds: [],
  },
  methods: {
    updateFeeds: function (feeds) {
      this.feeds = feeds;
    },
    on_open_in_list: function (feed){
      emitter.emit("open_in_list", feed);
    },
    onImport: function () {
      dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) return;
        let fileName = fileNames[0];
        fs.readFile(fileName, "utf-8", function (err, data) {
          opmlToJSON(data, function (err, json) {
            let rss = jsonPath.resolve(json, "/children[*]/children[*]");
            feedStorage.AddRange(rss, () => {

            });
            provider.UpdateFeeds(() => {
            });
          });
        });
      });
    },
  },
});
feedStorage.Init();
class Provider {
  public UpdateFeeds(callback) {
    feedStorage.Find({}, function (error, results) {
      feedsVue.updateFeeds(results.rows);
      if (callback)callback(null, results.rows);
    });
  }

  public UpdateFeedsArticles(callback) {
    this.UpdateFeeds(function (error, feeds) {
      Promise.all(_.map(feeds, (feed) => new Promise((resolve) => {
        feedService.GrabAndUpdateArticles(feed.xmlurl, function (error) {
          resolve({});
        });
      })))
        .then(() => {
          if (callback)callback(null);
        });
    });
  }
}
let provider = new Provider();
export  default provider;
