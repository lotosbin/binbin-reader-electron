/**
 * Created by liubinbin on 15/08/2016.
 */
import * as _ from "lodash";
import {ISuccessCallback} from "./history";
import {IArticle} from "../../definitions/storage/article";
import reject = require("lodash/reject");
import emitter from "../functions/emitter";
import {IFeed} from "../../definitions/storage/feed";
import {doSegment} from "../functions/segment";
const ArticleTableName = "ARTICLES6";
enum Readed{
  Unread = 0,
  Readed = 1,
  MarkReaded = 2,
}
class ArticleStorage {
  Add({title, link, feed_xmlurl}, callback: any) {
    this.executeSql(`INSERT INTO ${ArticleTableName}  (id, title,link,feed_xmlurl,readed,p,pversion) VALUES (? ,?,?,?,?,0,0)`, [link, title, link, feed_xmlurl, Readed.Unread], callback);
  }

  private executeSql(s: string, extracted: any[], callback) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

    db.transaction((tx) => {
      tx.executeSql(s, extracted, (transaction, results) => {
        console.log(s)
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
        this.incPVersion()
        emitter.emit("article_readed", id)
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
        this.incPVersion()
        emitter.emit("article_markreaded", id)
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
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ArticleTableName} (id UNIQUE, title, link, feed_xmlurl,readed,p,pversion)`);
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

  FindUnreadPromise() {
    return new Promise((resolve, reject) => {
      let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM ${ArticleTableName}  WHERE readed = 0 ORDER BY p DESC,rowid DESC LIMIT 10`, [], (tx, results) => {
          var d: IFeed[] = [];
          for (var i = 0; i < results.rows.length; i++) {
            d.push(results.rows.item(i))
          }
          resolve(d)
        }, (tx, error) => {
          reject(error);
        });
      });
    })
  }

  FindUnCalePromise(pversion: number) {
    return new Promise((resolve, reject) => {
      let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM ${ArticleTableName}  WHERE readed = 0 AND p = 0 AND pversion < ? ORDER BY rowid DESC LIMIT 10`, [pversion], (tx, results) => {
          var d: IFeed[] = [];
          for (var i = 0; i < results.rows.length; i++) {
            d.push(results.rows.item(i))
          }
          console.log(`pversion:${pversion},FindUnCalePromise:${JSON.stringify(d)}`)
          resolve(d)
        }, (tx, error) => {
          reject(error);
        });
      });
    })
  }

  ReadedAndMarkReadedCount() {
    return new Promise((resolve, reject) => {
      let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
      db.transaction((tx) => {
        let sql = `SELECT * FROM ${ArticleTableName} WHERE (readed = 1 OR readed = 2)`;
        tx.executeSql(sql, [], (tx, results) => {
          resolve(results.rows.length)
        }, (transaction, error) => {
          reject(error)
        });
      });
    })
  }

  ReadedAndMarkReadedSegmentCount(segment: string) {
    return new Promise((resolve, reject) => {
      let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
      db.transaction((tx) => {
        let sql = `SELECT * FROM ${ArticleTableName} WHERE (readed = 1 OR readed = 2) AND title like ?`;
        tx.executeSql(sql, [`%${segment}%`], (tx, results) => {
          resolve(results.rows.length)
        }, (transaction, error) => {
          reject(error)
        });
      });
    })
  }

  ReadedCount() {
    return new Promise((resolve, reject) => {
      let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
      db.transaction((tx) => {
        tx.executeSql(`SELECT * FROM ${ArticleTableName} WHERE readed = 1 `, [], (tx, results) => {
          resolve(results.rows.length)
        }, (transaction, error) => {
          reject(error)
        });
      });
    })
  }

  ReadedSegmentCount(segment: string) {
    return new Promise((resolve, reject) => {
      let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
      db.transaction((tx) => {
        tx.executeSql(`SELECT * FROM ${ArticleTableName} WHERE readed = 1 AND title LIKE ?`, [`%${segment}%`], (tx, results) => {
          resolve(results.rows.length)
        }, (transaction, error) => {
          reject(error)
        });
      });
    })
  }

  calcP(entry: IArticle) {
    return new Promise((resolve) => {
      let segments: string[] = doSegment(entry.title);
      Promise.all(segments.map(segment => new Promise((resolve, reject) => this.calc(segment).then(pa => resolve(pa)))))
        .then(values => {
          var p = _.mean(values)
          resolve(p)
        })
    })
  }

  async calc(segment: string) {
    // pRead_Segment = pRead * pSegment_Read / pSegment
    // pRead = ReadCount/AllCount
    // pSegment_Read = SegmentReadCount / ReadCount
    // pSegment = SegmentCount / AllCount
    var AllCount = await articleStorage.ReadedAndMarkReadedCount()
    var ReadCount = await articleStorage.ReadedCount()
    var SegmentCount = await articleStorage.ReadedAndMarkReadedSegmentCount(segment)
    var SegmentReadCount = await articleStorage.ReadedSegmentCount(segment)
    var pRead = parseFloat(`${ReadCount}`) / parseFloat(`${AllCount}`)
    var pSegment_Read = parseFloat(`${SegmentReadCount}`) / parseFloat(`${ReadCount}`)
    var pSegment = parseFloat(`${SegmentCount}`) / parseFloat(`${AllCount}`)
    var pRead_Segment = pRead * pSegment_Read / pSegment
    console.log(`${segment}:AllCount:${AllCount},ReadCount:${ReadCount},pRead:${pRead},pRead_Segment:${pSegment_Read}`)
    return pRead;
  }

  updateP(id: string, p: number, pversion: number) {
    let db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
    db.transaction((tx) => {
      tx.executeSql(`UPDATE ${ArticleTableName} SET p=?,pversion=? WHERE id=? `, [p, pversion, id], (transaction, results) => {
      }, (transation, error) => {
      });
    });
  }

  incPVersion() {
    var pversion = this.getPVersion()
    localStorage.setItem("pversion", (pversion + 1).toString())
  }

  getPVersion() {
    var pversion = localStorage.getItem("pversion")
    if (pversion) {
      return parseInt(pversion)
    } else {
      localStorage.setItem("pversion", "0")
      return 0
    }
  }

  CalcPrimary() {
    var pversion = this.getPVersion()
    this.FindUnCalePromise(pversion)
      .then(articles => {
        for (var i = 0; i < articles.length; i++) {
          var article = articles[i];
          this.calcP(article)
            .then((p) => {
              this.updateP(article.id, p, pversion)
            })
        }
      })
  }
}

let articleStorage = new ArticleStorage();
articleStorage.Init();

export default articleStorage;
