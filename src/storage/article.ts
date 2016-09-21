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
import {error} from "util";
import {Storage} from "./storagebase"
const ArticleTableName = "ARTICLES";
enum Readed{
  Unread = 0,
  Readed = 1,
  MarkReaded = 2,
}
export class ArticleEvents {
  static MarkReaded = "article_markreaded"
  static MarkAdded = "article_added"
  static PriorityUpdated = "article_primary_updated"
}
class ArticleStorage extends Storage<IArticle> {
  Find({}:{}, callback: ISuccessCallback<IArticle[]>): void {
    this.open().transaction((tx) => {
      tx.executeSql(`SELECT * FROM ${ArticleTableName}`, [], (tx, results) => {
        var d: IArticle[] = [];
        for (var i = 0; i < results.rows.length; i++) {
          d.push(results.rows.item(i))
        }
        callback(null, d)
      }, (transaction, error) => {
        callback(error)
      });
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

  Add({title, link, feed_xmlurl}, callback: any) {
    this.executeSql(`INSERT INTO ${ArticleTableName}  (id, title,link,feed_xmlurl,readed,p,pversion) VALUES (? ,?,?,?,?,0,0)`, [link, title, link, feed_xmlurl, Readed.Unread], (tx, results) => {
      emitter.emit(ArticleEvents.Added, {})
      callback(null, results)
    }, (tx, error) => {
      callback(error)
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
    this.open().transaction((tx) => {
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
    this.open().transaction((tx) => {
      tx.executeSql(`UPDATE ${ArticleTableName} SET readed = 2 WHERE id = ? `, [id], (transaction, results) => {
        console.log(`MarkUnreaded:${id}`)
        this.incPVersion()
        emitter.emit(ArticleEvents.MarkReaded, id)
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
      })
      .catch((error) => {
        if (callback)
          callback(error)
      })
    ;
  }

  Init() {

    this.open().transaction((tx) => {
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
    this.open().transaction((tx) => {
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
      this.open().transaction(tx => {
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

  FindUnCalePromise(pversion: number, limit?: number) {
    return new Promise((resolve, reject) => {
      this.open().transaction(tx => {
        let sql = `SELECT * FROM ${ArticleTableName}  WHERE readed = 0 AND pversion < ? ORDER BY pversion ASC ,rowid DESC`
        if (limit) {
          sql = `${sql} LIMIT ${limit}`;
        }
        tx.executeSql(sql, [pversion], (tx, results) => {
          var d: IFeed[] = [];
          for (var i = 0; i < results.rows.length; i++) {
            d.push(results.rows.item(i))
          }
          // console.log(`pversion:${pversion},FindUnCalePromise:${JSON.stringify(d)}`)
          resolve(d)
        }, (tx, error) => {
          reject(error);
        });
      });
    })
  }

  ReadedAndMarkReadedCount() {
    return new Promise((resolve, reject) => {
      this.open().transaction((tx) => {
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
      this.open().transaction((tx) => {
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
      this.open().transaction((tx) => {
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
      this.open().transaction((tx) => {
        tx.executeSql(`SELECT * FROM ${ArticleTableName} WHERE readed = 1 AND title LIKE ?`, [`%${segment}%`], (tx, results) => {
          resolve(results.rows.length)
        }, (transaction, error) => {
          reject(error)
        });
      });
    })
  }

  async calcP2(entry: IArticle): Promise<number> {
    /*
     * p(C|M1...Mn)  = p(C) * p(C|M1)..p(C|Mn) / ( p(M1)..p(Mn) )
     *               = count(C)/count(ALL) * count(C|M1)/count(M1)..count(C|Mn)/count(Mn) / ( count(M1)/count(ALL)..count(Mn)/count(ALL) )
     *               = count(C)/count(ALL) * (count(C|M1)..count(C|Mn)/count(M1)..count(Mn)) / (count(M1)..count(Mn)/count(ALL)^n) 
     *               = count(C)/count(ALL) * (count(C|M1)..count(C|Mn) * count(ALL)^n)/( count(M1)..count(Mn) ^2 )
     *               = count(C)*count(ALL)^(n-1) * count(C|M1)..count(C|Mn) / (count(M1)..count(Mn))^2
     * 
     * */
    var AllCount = await articleStorage.ReadedAndMarkReadedCount()
    var ReadCount = await articleStorage.ReadedCount()
    var up = 1
    var down = 1
    let segments: string[] = doSegment(entry.title);
    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      var SegmentReadCount = await articleStorage.ReadedSegmentCount(segment)
      var SegmentCount = await articleStorage.ReadedAndMarkReadedSegmentCount(segment)
      up = up * Math.max(1, parseInt(`${SegmentReadCount}`))
      down = down * Math.max(1, parseInt(`${SegmentCount}`))
    }
    let count_all = parseInt(`${AllCount}`);
    let count_readed = parseInt(`${ReadCount}`);
    var pRead_Segments = count_readed * Math.pow(count_all, segments.length - 1) * up / Math.pow(down, 2)
    return pRead_Segments
  }

  updatePriorityPromise(id: string, p: number, pversion: number) {
    return new Promise((resolve, reject) => {
      console.log(`updateP(id:${id},p:${p},pversion:${pversion})`)
      this.open()
        .transaction((tx) => {
          tx.executeSql(`UPDATE ${ArticleTableName} SET p=?,pversion=? WHERE id=? `, [p, pversion, id],
            (transaction, results) => {
              emitter.emit(ArticleEvents.PriorityUpdated, {})
              resolve(results)
            },
            (transation, error) => reject(error)
          );
        });
    })
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

  calcPrimarying = false

  CalcPrimary() {
    if (this.calcPrimarying)return;
    this.calcPrimarying = true;
    var pversion = this.getPVersion()
    this.FindUnCalePromise(pversion, 20)
      .then((articles: IArticle[]) => {
        for (var i = 0; i < articles.length; i++) {
          var article = articles[i];
          this.calcP2(article)
            .then((p: number) => {
              return this.updatePriorityPromise(article.id, p, pversion)
            })
            .catch((reason: any) => {
              console.error(reason)
            })
        }
        this.calcPrimarying = false
      })
      .catch((reason: any) => {
        this.calcPrimarying = false
        console.error(reason)
      })
  }
}

let articleStorage = new ArticleStorage();
articleStorage.Init();

export default articleStorage;
