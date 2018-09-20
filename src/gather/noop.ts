/*
 * @Author: qiansc
 * @Date: 2018-09-18 00:29:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-21 00:14:07
 */
import { Gather } from "../gather";
import {GatherCallback, MiddlewareOptions, Result} from "../middleware";

export class Noop extends Gather {
  constructor(options: MiddlewareOptions = {}) {
    super(options);
  }
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
    gather();
  }
}
