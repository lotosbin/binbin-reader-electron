/**
 * Created by liubinbin on 15/08/2016.
 */
import * as _ from "lodash";
class FeedStorage {
  Init() {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction(function (tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS FEEDS (id UNIQUE, title, xmlurl)");
      console.log("<p>created </p>");
    });
  }

  Add({title, xmlurl}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
    
    db.transaction(function (tx) {
      tx.executeSql("INSERT INTO FEEDS (id, title,xmlurl) VALUES (? ,?,?)", [xmlurl, title, xmlurl], function (transaction, results) {

      }, function (transation, error) {
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

  Find({}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
    
    db.transaction(function (tx) {
      tx.executeSql("SELECT * FROM FEEDS", [], function (tx, results) {
        callback(null, results);
      }, null);
    });
  }
}
let feedStorage = new FeedStorage();
feedStorage.Init();
export default feedStorage;
