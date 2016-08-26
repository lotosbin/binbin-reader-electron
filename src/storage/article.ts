/**
 * Created by liubinbin on 15/08/2016.
 */
import * as _ from "lodash";
import {ISuccessCallback} from "./history";
import {IArticle} from "../../definitions/storage/article";
const ArticleTableName = "ARTICLES3";
class ArticleStorage {
  Add({title, link, feed_xmlurl}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
    let msg;
    db.transaction(function (tx) {
      tx.executeSql(`INSERT INTO ${ArticleTableName}  (id, title,link,feed_xmlurl,readed) VALUES (? ,?,?,?,?)`, [link, title, link, feed_xmlurl, 0], function (transaction, results) {

      }, function (transation, error) {
        console.log(error);
      });
    });
  }

  Read({id}, callback) {
    console.log("read:" + id);
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
    let msg;
    db.transaction(function (tx) {
      tx.executeSql(`UPDATE ${ArticleTableName} SET readed = 1 WHERE id=? `, [id], function (transaction, results) {

      }, function (transation, error) {
        console.log(error);
      });
    });
  }

  Init() {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
    let msg;

    db.transaction(function (tx) {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ArticleTableName} (id UNIQUE, title, link, feed_xmlurl,readed)`);
      msg = "<p>created </p>";
      console.log(msg);
    });
  }


  AddRange(items, feed_xmlurl, callback) {
    _(items).forEach((value) => {
      this.Add({title: value.title, link: value.link, feed_xmlurl: feed_xmlurl}, () => {
      });
    });
  }

  Get(id: string, callback: ISuccessCallback<IArticle>) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction(function (tx) {
      tx.executeSql(`SELECT * FROM ${ArticleTableName} WHERE id=?`, [id], function (tx, results) {
        if (callback)callback(null, results);
      }, null);
    });
  }

  GetAsync(id: string) {
    return new Promise((resolve, reject)=> {
      this.Get(id, (error, article)=> {
        resolve(article)
      })
    })
  }

  Find({}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
    
    db.transaction(function (tx) {
      tx.executeSql(`SELECT * FROM ${ArticleTableName}  ORDER BY readed,rowid DESC LIMIT 100`, [], function (tx, results) {
        callback(null, results);
      }, null);
    });
  }
}

let articleStorage = new ArticleStorage();
articleStorage.Init();

export default articleStorage;
