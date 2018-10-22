/*
 * @Author: qiansc
 * @Date: 2018-05-18 00:15:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-01 17:53:44
 */
import {Finisher, GatherCallback, Middleware, Result} from "./index";
// import {PairOptions} from "./pair";

export abstract class Filter<FilterOption = {}> extends Middleware<FilterOption> {
  protected handler: Middleware<any>;
  constructor(options: FilterOption) {
    super(options);
  }

  public next(m: Middleware<any> | typeof Finisher): Filter<FilterOption> {
    if (m instanceof Middleware) {
      this.handler = m;
    } else {
      this.handler = new (m as typeof Finisher)() as Middleware<any>;
    }
    return this;
  }

  protected _handle(result: Result, gather: GatherCallback) {
    const rs = this.deal(result);
    if (rs) {
      if (this.handler) {
        this.handler.handle(rs, gather);
      } else {
        gather(rs);
      }
    }
  }

  protected abstract deal(result: Result): Result | false;
}
