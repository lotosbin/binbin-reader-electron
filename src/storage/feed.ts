/**
 * Created by liubinbin on 15/08/2016.
 */
import * as _ from "lodash";
import {ISuccessCallback} from "./history";
import {IFeed} from "../../definitions/storage/feed";
import {Storage} from "./storagebase"
class FeedStorage extends Storage<IFeed> {
  Init() {
    this.open().transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS FEEDS (id UNIQUE, title, xmlurl)");
      console.log("<p>created </p>");
    });
  }

  Add({title, xmlurl}, callback) {
    this.open().transaction((tx) => {
      tx.executeSql("INSERT INTO FEEDS (id, title,xmlurl) VALUES (? ,?,?)", [xmlurl, title, xmlurl], (transaction, results) => {

      }, (transation, error) => {
        console.log(error);
      });
    });
  }

  AddRange(items, callback) {
    _(items).forEach((value) => {
      this.Add({title: value.title, xmlurl: value.xmlurl}, () => {
      });
    });
  }

  Find({limit}, callback: ISuccessCallback<IFeed[]>) {
    this.open().transaction((tx) => {
      let sql = "SELECT * FROM FEEDS"
      if (limit) {
        sql = `${sql} LIMIT ${limit} `;
      }
      tx.executeSql(sql, [], (tx, results) => {
        var d: IFeed[] = [];
        for (var i = 0; i < results.rows.length; i++) {
          d.push(results.rows.item(i))
        }
        if (callback)callback(null, d);
      }, null);
    });
  }

  FindAsync() {
    return new Promise((resolve, reject) => {
      this.Find({}, (error, results) => {
        if (error)
          reject(error)
        else
          resolve(results)
      })
    })
  }
}
let feedStorage = new FeedStorage();
feedStorage.Init();
export default feedStorage;
