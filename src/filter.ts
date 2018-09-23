/*
 * @Author: qiansc
 * @Date: 2018-05-18 00:15:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 21:42:06
 */
import {Finisher, GatherCallback, Middleware, MiddlewareOptions, Result} from "./index";
// import {PairOptions} from "./pair";

export abstract class Filter extends Middleware {
  protected handler: Middleware;
  constructor(options: MiddlewareOptions = {}) {
    super(options);
  }

  public next(m: Middleware | typeof Finisher): Filter {
    if (m instanceof Middleware) {
      this.handler = m;
    } else {
      this.handler = new m();
    }
    return this;
  }

  protected _handle(result: Result, gather: GatherCallback) {
    const rs = this.deal(result);
    if (this.handler) {
      this.handler.handle(rs, gather);
    } else {
      gather(rs);
    }
  }

  protected abstract deal(result: Result): Result;
}
