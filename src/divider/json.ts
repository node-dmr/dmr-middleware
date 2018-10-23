/*
 * @Author: qiansc
 * @Date: 2018-09-19 18:17:48
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-23 10:42:44
 */
import {Divider} from "../divider";
import {Result} from "../middleware";
/**
 * Json(extends Divider) can parse JsonString into pairs of [key, string].
 * Then each pair with be process by next Middleware
 *
 * @example
 * const txt = "{A: \'a\',\"B\":1,\"C\":\"20180909\"}";
 * const json = new Json().next(Gather);
 * json.handle(["json", txt], (result) => {
 *  console.log(result);
 * });
 * // ["A", "a"]   ["B", "1"]   ["C", "20180909"]
 */
export class Json extends Divider {
  constructor() {
    super({});
  }
  protected divide(result: Result): Result[] {
    let json = {};
    const results: Result[] = [];
    try {
      json = new Function("return " + result[1])();
    } catch (e) {
      // do nothing
    }
    Object.keys(json).forEach((key) => {
      results.push([key,
        isJSON(json[key]) ? JSON.stringify(json[key]) : json[key].toString(),
      ]);
    });
    return results;
  }
}
/**
 * @hidden and @ignore
 * $0 ~ $9  matches RegExp.$
 */
function isJSON(obj: any): boolean {
  return !!(typeof(obj) === "object" &&
  Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length);
}
