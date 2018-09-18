/*
 * @Author: qiansc
 * @Date: 2018-09-16 22:35:06
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 10:55:14
 */
import {MiddlewareFactory as factory} from "./factory";
import {GatherCallback, Middleware, MiddlewareAction, MiddlewareOptions, Result} from "./middleware";
import ResultsHandler from "./results-handler";
// import {PairOptions} from "./pair";

export abstract class Divider extends Middleware {
  protected handlers: ResultsHandler[] = [];
  constructor(options: MiddlewareOptions = {}) {
    super(options);

    // next: {"key": MO, "key": M}
    if (options.next) {this.next(options.next); }
    // nextEach: MO
    if (options.nextEach) {this.nextEach(options.nextEach); }
    // nextList: [MO, MO, MO]
    if (options.nextList) {this.nextList(options.nextList); }
    // this.parseNextHandler(options);
  }

  // nextList 重载实现
  public nextList(list: MiddlewareOptions[] | Middleware[]) {
    for (let index = 0; index < list.length ; index++) {
      const M = list[index];
      const m: Middleware = M instanceof Middleware ? M : factory(M);
      this.handlers.push(new ResultsHandler(m, index.toString()));
    }
  }
  // nextEach 重载实现
  public nextEach(M: MiddlewareOptions | Middleware) {
    const m: Middleware = M instanceof Middleware ? M : factory(M);
    this.handlers.push(new ResultsHandler(m));
  }
  // next 重载实现
  public next(action: MiddlewareAction) {
    Object.keys(action).forEach((index) => {
      const M = action[index];
      const m: Middleware = M instanceof Middleware ? M : factory(M);
      this.handlers.push(new ResultsHandler(m, index.toString()));
    });
  }
  protected _handle(result: Result, gather: GatherCallback) {
    const parts = this.divide(result);
    this.handlers.forEach((handler) => {
        handler.handle(parts, gather);
    });
  }

  protected abstract divide(result: Result): Result[];
}

// export interface DividerOptions extends MiddlewareOptions {
//   [index: string]: Array<PairOptions | DividerOptions>
// }
