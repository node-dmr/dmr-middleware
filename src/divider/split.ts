/*
 * @Author: qiansc
 * @Date: 2018-09-18 20:54:14
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:17:19
 */
import {Divider} from "../divider";
import {Result} from "../index";

export class Split extends Divider<SplitOption> {
  constructor(options: SplitOption) {
    super(options);
  }
  protected divide(result: Result): Result[] {
    const parts = result[1].split((this.options as SplitOption).separater);
    const results: Result[] = [];
    for (let index = 0; index < parts.length; index++) {
      results.push([index.toString(), parts[index]]);
    }
    return results;
  }
}

export interface SplitOption {
  separater: string;
}
