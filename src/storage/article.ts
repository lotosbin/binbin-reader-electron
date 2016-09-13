/**
 * Created by liubinbin on 15/08/2016.
 */
import * as _ from "lodash";
import {ISuccessCallback} from "./history";
import {IArticle} from "../../definitions/storage/article";
import reject = require("lodash/reject");
import emitter from "../components/emitter";
const ArticleTableName = "ARTICLES3";
enum Readed{
  Unread = 0,
  Readed = 1,
  MarkReaded = 2,
}
class ArticleStorage {
  Add({title, link, feed_xmlurl}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql(`INSERT INTO ${ArticleTableName}  (id, title,link,feed_xmlurl,readed) VALUES (? ,?,?,?,?)`, [link, title, link, feed_xmlurl, Readed.Unread], (transaction, results) => {
        if (callback)callback();
      }, (transation, error) => {
        console.log(error);
      });
    });
  }

  AddAsync({title, link, feed_xmlurl}) {
    return new Promise((resolve, reject) => {
      this.Add({title, link, feed_xmlurl}, (error, results) => {
        resolve(results)
      })
    })
  }

  Read({id}, callback) {
    console.log("read:" + id);
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql(`UPDATE ${ArticleTableName} SET readed = 1 WHERE id=? `, [id], (transaction, results) => {
        emitter.emit("article_readed",id)
        if (callback)callback(null)
      }, (transation, error) => {
        console.log(error);
        if (callback)callback(error)
      });
    });
  }

  MarkReaded({id}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql(`UPDATE ${ArticleTableName} SET readed = 2 WHERE id = ? `, [id], (transaction, results) => {
        console.log(`MarkUnreaded:${id}`)
        emitter.emit("article_markreaded",id)
        if (callback)callback(null)
      }, (transation, error) => {
        console.log(error);
        if (callback)callback(error)
      });
    });
  }

  MarkReadedMultiAsync(ids: any[], callback) {
    Promise.all(_.map(ids, (id) => new Promise((resolve, reject) => {
      this.MarkReaded({id}, (error) => {
        if (error) {
          reject(error);
        }
        else {
          resolve({});
        }
      });
    })))
      .then(() => {
        if (callback) {
          callback(null, null);
        }
      });
  }

  Init() {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ArticleTableName} (id UNIQUE, title, link, feed_xmlurl,readed)`);
      console.log("<p>created </p>");
    });
  }


  AddRange(items, feed_xmlurl, callback) {
    var promises = items.map((item) => this.AddAsync(item));
    Promise.all(promises)
      .then(() => {
        if (callback)callback()
      })
  }

  AddRangeAsync(items, feed_xmlurl) {
    return new Promise((resolve, reject) => {
      this.AddRange(items, feed_xmlurl, () => {
        resolve({})
      })
    })
  }

  Get(id: string, callback: ISuccessCallback < IArticle >) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM ${ArticleTableName} WHERE id=?`, [id], (tx, results) => {
        if (callback)callback(null, results);
      }, null);
    });
  }

  GetAsync(id: string) {
    return new Promise((resolve, reject) => {
      this.Get(id, (error, article) => {
        resolve(article)
      })
    })
  }

  FindUnread({}, callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM ${ArticleTableName}  WHERE readed = 0 ORDER BY rowid DESC LIMIT 100`, [], (tx, results) => {
        callback(null, results);
      }, null);
    });
  }
}

let articleStorage = new ArticleStorage();
articleStorage.Init();

export default articleStorage;
