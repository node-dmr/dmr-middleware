/*
 * @Author: qiansc
 * @Date: 2018-09-17 21:55:59
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 00:09:59
 */
import {Divider} from "../divider";
import {MiddlewareOptions, Result} from "../middleware";

export class Copy extends Divider {
  constructor(options: CopyOptions) {
    super(options);
  }
  protected divide(result: Result): Result[] {
    const results = [];
    for (let index = 0; index < (this.options as CopyOptions).times; index++) {
      results.push(result);
    }
    return results;
  }
}

export interface CopyOptions extends MiddlewareOptions {
  times: number;
}
