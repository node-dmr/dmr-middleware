/*
 * @Author: qiansc
 * @Date: 2018-09-18 00:29:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:16:08
 */
import {Finisher} from "../finisher";
import {GatherCallback, MiddlewareOptions, Result} from "../middleware";

export class Noop extends Finisher {
  constructor(options: MiddlewareOptions = {}) {
    super(options);
  }
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
    gather();
  }
}