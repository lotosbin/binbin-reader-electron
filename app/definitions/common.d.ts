/**
 * Created by liubinbin on 02/09/2016.
 */
export interface ICallback<TError, TResult>{
  (error: TError, result: TResult) : void
}
