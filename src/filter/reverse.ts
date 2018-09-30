/*
 * @Author: qiansc
 * @Date: 2018-09-25 10:26:59
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-30 09:48:53
 */
import {Filter} from "../filter";
import {Result} from "../middleware";

export class Reverse extends Filter {
  protected deal(result: Result): Result {
    return [result[1], result[0]];
  }
}
