/*
 * @Author: qiansc
 * @Date: 2018-09-19 18:17:48
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-20 16:49:47
 */
import {Divider, DividerOptions} from "../divider";
import {Result} from "../middleware";

export class Json extends Divider {
  constructor(options: DividerOptions = {}) {
    super(options);
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

function isJSON(obj: any): boolean {
  return !!(typeof(obj) === "object" &&
  Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length);
}
