/*
 * @Author: qiansc
 * @Date: 2018-09-18 00:29:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 00:34:43
 */
import {GatherCallback, Middleware, MiddlewareOptions, Result} from "./middleware";

export class Noop extends Middleware {
  constructor(options: MiddlewareOptions = {}) {
    super(options);
  }
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
  }
}
