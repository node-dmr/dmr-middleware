/*
 * @Author: qiansc
 * @Date: 2018-09-17 21:55:59
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 19:15:02
 */
import {Divider} from "../divider";
import {Result} from "../middleware";
/**
 * Copy extends Divider, can copy results
 * @example
 * ```Typescript
 *
 * const copy = new Copy({times: 3});
 * copy.next(Gather);
 * copy.handle(["key", "value"], (result) => console.log(result));
 * // ["key", "value"] * 3 times
 * ```
 */
export class Copy extends Divider<CopyOption> {
  /**
   * {number} option.times - Copy number
   */
  constructor(option: CopyOption) {
    super(option);
  }
  protected divide(result: Result): Result[] {
    const results: Result[] = [];
    for (let index = 0; index < (this.option as CopyOption).times; index++) {
      results.push(result);
    }
    return results;
  }
}

export interface CopyOption {
  /** Copy number */
  times: number;
}
