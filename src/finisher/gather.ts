/*
 * @Author: qiansc
 * @Date: 2018-09-18 00:29:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:15:44
 */
import {Finisher} from "../finisher";
import {GatherCallback, Result} from "../middleware";

export class Gather extends Finisher {
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
    gather(result);
  }
}
