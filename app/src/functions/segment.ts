///<reference path="../../typings/globals/node/index.d.ts"/>
/**
 * Created by liubinbin on 2016/8/23.
 */
import {Segment} from "segment"
export interface ISegment {
  w: string,
}
// 创建实例
let segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

// 开始分词
export function doSegment(s: string) {
  let r = segment.doSegment(s);
  return r.map((v: ISegment) => v.w);
}
