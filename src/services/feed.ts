import  * as reader from 'feed-reader'
import articleStorage from "../storage/article";
import feedStorage from "../storage/feed";
import {ISuccessCallback} from "../storage/history";
class FeedService{
  async GrabAndUpdateArticles(xmlurl: string, callback :ISuccessCallback<any>) {
    let feed = await reader.parse(xmlurl)
    articleStorage.AddRange(feed.entries, xmlurl, () => {
      if (callback)callback(null,{});
    })
  }

  updating = false;

  public UpdateFeedsArticles(callback: ICallback<any, any>) {
    if (!this.updating) {
      this.updating = true;
      feedStorage.Find({},  (error, feeds) => {
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
}
let feedService = new FeedService()
export default feedService
