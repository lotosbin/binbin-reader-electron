/**
 * Created by liubinbin on 15/08/2016.
 */
import * as _ from "lodash";
import {ISuccessCallback} from "./history";
import {IFeed} from "../../definitions/storage/feed";
import {Storage} from "./storagebase"
class FeedStorage extends Storage<IFeed> {
  Init() {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS FEEDS (id UNIQUE, title, xmlurl)");
      console.log("<p>created </p>");
    });
  }

  Add({title, xmlurl}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
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

  Find({}, callback: ISuccessCallback<IFeed[]>) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM FEEDS LIMIT 10", [], (tx, results) => {
        var d: IFeed[] = [];
        for (var i = 0; i < results.rows.length; i++) {
          d.push(results.rows.item(i))
        }
        if (callback)callback(null, d);
      }, null);
    });
  }
}
let feedStorage = new FeedStorage();
feedStorage.Init();
export default feedStorage;
