/*
 * @Author: qiansc
 * @Date: 2018-09-17 21:55:59
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-20 19:39:27
 */
import {Divider} from "../divider";
import {Result} from "../middleware";

export class Copy extends Divider<CopyOption> {
  constructor(options: CopyOption) {
    super(options);
  }
  protected divide(result: Result): Result[] {
    const results: Result[] = [];
    for (let index = 0; index < (this.options as CopyOption).times; index++) {
      results.push(result);
    }
    return results;
  }
}

export interface CopyOption {
  times: number;
}
