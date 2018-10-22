/*
 * @Author: qiansc
 * @Date: 2018-09-18 20:54:14
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 17:11:02
 */
import {Divider} from "../divider";
import {Result} from "../index";

export class Split extends Divider<SplitOption> {
  constructor(option: SplitOption) {
    super(option);
  }
  protected divide(result: Result): Result[] {
    const parts = result[1].split((this.option as SplitOption).separater);
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
