/**
 * Created by liubinbin on 15/08/2016.
 */
import * as _ from "lodash";
import values = require("lodash/values");
import {IArticle} from "../../definitions/storage/article";
import {Storage} from "./storagebase"

export interface ISuccessCallback<TData> {
  (error: any, data: TData): void
}
export interface IHistory {
  id: number,
  articleId: string
}
export class History implements IHistory {
  id: number;
  articleId: string;
}
class HistoryStorage extends Storage<History> {
  Find({}:{}, callback: ISuccessCallback<History[]>): void {
  }

  tableName() {
    return "HISTORY"
  }

  columnList() {
    return "articleId";
  }

  columnValues(model: IHistory) {
    var values: any[] = [];
    values.push(model.articleId)
    return values;
  }

  Add(model: IHistory, callback: ISuccessCallback<any>) {
    this.open().transaction((tx) => {
      tx.executeSql(`INSERT INTO ${this.tableName()}  (${this.columnList()}) VALUES (?)`, this.columnValues(model), (transaction, results) => {
        if (callback)callback(null, null);
      }, (transation, error) => {
        console.log(error);
      });
    });
  }

  AddAsync(model: IHistory) {
    return new Promise((resolve, reject) => {
      this.Add(model, () => {
        resolve(model)
      })
    })
  }

  Init() {
    this.open().transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ${this.tableName()} (id UNIQUE, ${this.columnList()})`);
      console.log("<p>created </p>");
    });
  }

  AddRange(items: any[], feed_xmlurl: string, callback: any) {
    _(items).forEach((value) => {
      this.Add({title: value.title, link: value.link, feed_xmlurl: feed_xmlurl}, () => {
      });
    });
  }

  FindArticle({}, callback: ISuccessCallback<IArticle[]>) {
    this.open().transaction((tx) => {
      tx.executeSql(`SELECT h.id AS hId,a.* FROM  ${this.tableName()} h LEFT JOIN ARTICLE3 a ON h.articleId=a.id ORDER BY rowid DESC LIMIT 100`, [], (tx, results) => {
        var d: IArticle[] = [];
        for (var i = 0; i < results.rows.length; i++) {
          d.push(results.rows.item(i))
        }
        callback(null, d);
      }, null);
    });
  }

  FindAsync() {
    return new Promise((resolve, reject) => {
      this.FindArticle({}, (error: any, data: IArticle[]) => {
        resolve(data)
      })
    })
  }
}

let historyStorage = new HistoryStorage();
historyStorage.Init();

export default historyStorage;
