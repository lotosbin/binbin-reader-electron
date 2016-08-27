import {ISuccessCallback} from "./history";
export abstract class Storage<T> {
  abstract Find({}, callback: ISuccessCallback<T[]>): void;

  FindAsync() {
    return new Promise<T[]>((resolve, reject)=> {
      this.Find({}, (error: any, data: T[])=> {
        resolve(data)
      })
    })
  }
}
