import  * as reader from 'feed-reader'
import * as fs  from "fs";
import * as opmlToJSON from "opml-to-json";
import * as _ from "lodash";
import * as jsonPath from "json-path";
import articleStorage from "../storage/article";
import feedStorage from "../storage/feed";
import {ISuccessCallback} from "../storage/history";
class FeedService {
  async GrabAndUpdateArticles(xmlurl: string, callback: ISuccessCallback<any>) {
    let feed = await reader.parse(xmlurl)
    articleStorage.AddRange(feed.entries, xmlurl, () => {
      if (callback)callback(null, {});
    })
  }

  updating = false;

  public UpdateFeedsArticles(callback: ICallback<any, any>) {
    if (!this.updating) {
      this.updating = true;
      feedStorage.Find({}, (error, feeds) => {
        Promise.all(_.map(feeds, (feed) => new Promise((resolve) => {
          this.GrabAndUpdateArticles(feed.xmlurl, function (error) {
            resolve({});
          });
        })))
          .then(() => {
            this.updating = true
            if (callback) {
              callback(null, null);
            }
          });
      });
    }
  }

  importFromFile(fileName: string) {
    fs.readFile(fileName, "utf-8", (err, data) => {
      opmlToJSON(data, (err, json) => {
        let rss = jsonPath.resolve(json, "/children[*]/children[*]");
        feedStorage.AddRange(rss, () => {

        });
      });
    });
  }
}
let feedService = new FeedService()
export default feedService
