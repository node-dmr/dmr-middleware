/*
 * @Author: qiansc
 * @Date: 2018-05-18 00:15:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-21 00:12:42
 */
import {Gather, GatherCallback, Middleware, MiddlewareOptions, Result} from "./index";
import ResultsHandler from "./results-handler";
// import {PairOptions} from "./pair";

export abstract class Divider extends Middleware {
  protected handlers: ResultsHandler[] = [];
  constructor(options: MiddlewareOptions = {}) {
    super(options);

    // // next: {"key": MO, "key": M}
    // if (options.nextIndex) {this.nextIndex(options.nextIndex); }
    // // nextEach: MO
    // if (options.nextEach) {this.nextEach(options.nextEach); }
    // // nextList: [MO, MO, MO]
    // if (options.nextList) {this.nextList(options.nextList); }

    // if (options.next) {this.next(options.next); }
  }

  // nextList 重载实现
  public nextList(list: Middleware[]): Divider {
    for (let index = 0; index < list.length ; index++) {
      const M = list[index];
      this.handlers.push(new ResultsHandler(M, index.toString()));
    }
    return this;
  }
  // nextEach 重载实现
  public nextEach(m: Middleware): Divider {
    this.handlers.push(new ResultsHandler(m));
    return this;
  }
  // next 重载实现
  public nextIndex(action: Middleware[] | {[key: string]: Middleware}): Divider {
    Object.keys(action).forEach((index) => {
      const m = action[index];
      this.handlers.push(new ResultsHandler(m, index.toString()));
    });
    return this;
  }

  public next(options: Middleware | typeof Gather): Divider {
    if (options instanceof Middleware) {
      this.nextEach(options as Middleware);
    } else {
      this.nextEach(new options());
    }
    return this;
  }

  protected _handle(result: Result, gather: GatherCallback) {
    const parts = this.divide(result);
    this.handlers.forEach((handler) => {
        handler.handle(parts, gather);
    });
  }

  protected abstract divide(result: Result): Result[];
}
