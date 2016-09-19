import {ISuccessCallback} from "./history";
export abstract class Storage<T> {
  protected db: any = null

  protected open() {
    if (!this.db) {
      this.db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
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
