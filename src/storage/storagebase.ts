import {ISuccessCallback} from "./history";
export abstract class Storage<T> {
  protected db: any = null

  protected open() {
    if (!this.db) {
      this.db = openDatabase("mydb", "", "Test DB", 2 * 1024 * 1024);
      if (this.db.version === "1.0") {
        this.db.changeVersion("1.0", "2", (tx) => {
          tx.executeSql("ALTER TABLE ARTICLES6 ADD COLUMN segments")
        })
      }
      if (this.db.version === "2") {
        this.db.changeVersion("2", "3", tx => {
          tx.executeSql("DROP TABLE ARTICLES")
          tx.executeSql("DROP TABLE ARTICLES3")
          tx.executeSql("ALTER TABLE ARTICLES6 RENAME TO ARTICLES")
        })
      }
      if (this.db.version === "3") {
        this.db.changeVersion("3", "4", tx => {
          tx.executeSql("DROP TABLE ARTICLES2")
          tx.executeSql("DROP TABLE ARTICLES4")
          tx.executeSql("DROP TABLE ARTICLES5")
        })
      }
    }
    return this.db;
  }

  protected executeSql(s: string, extracted: any[], callback) {
    this.open().transaction((tx) => {
      tx.executeSql(s, extracted, (transaction, results) => {
        console.log(s)
        if (callback)callback();
      }, (transation, error) => {
        console.log(error);
      });
    });
  }

  abstract Find({}, callback: ISuccessCallback<T[]>): void;

  FindAsync() {
    return new Promise<T[]>((resolve, reject) => {
      this.Find({}, (error: any, data: T[]) => {
        resolve(data)
      })
    })
  }
}
