/**
 * Created by liubinbin on 2016/8/23.
 */
// 载入模块
var Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

// 开始分词
console.log(segment.doSegment('这是一个基于Node.js的中文分词模块。'));
export function doSegment(s:string){
  var r = segment.doSegment(s);
  return r.map((v)=>v.w);
}
