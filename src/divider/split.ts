/*
 * @Author: qiansc
 * @Date: 2018-09-18 20:54:14
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 21:24:22
 */
import {Divider} from "../divider";
import {MiddlewareOptions, Result} from "../middleware";

export class Split extends Divider {
  constructor(options: SplitOptions) {
    super(options);
  }
  protected divide(result: Result): Result[] {
    const parts = result[1].split((this.options as SplitOptions).separater);
    const results: Result[] = [];
    for (let index = 0; index < parts.length; index++) {
      results.push([index.toString(), parts[index]]);
    }
    return results;
  }
}

export interface SplitOptions extends MiddlewareOptions {
  separater: string;
}
