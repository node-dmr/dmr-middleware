/*
 * @Author: qiansc
 * @Date: 2018-05-18 00:15:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-20 16:46:26
 */
import {MiddlewareFactory as factory} from "./factory";
import {GatherCallback, Middleware, MiddlewareAction, MiddlewareOptions, Result} from "./middleware";
import ResultsHandler from "./results-handler";
// import {PairOptions} from "./pair";

export abstract class Divider extends Middleware {
  protected handlers: ResultsHandler[] = [];
  constructor(options: DividerOptions = {}) {
    super(options);

    // next: {"key": MO, "key": M}
    if (options.nextIndex) {this.nextIndex(options.nextIndex); }
    // nextEach: MO
    if (options.nextEach) {this.nextEach(options.nextEach); }
    // nextList: [MO, MO, MO]
    if (options.nextList) {this.nextList(options.nextList); }

    if (options.next) {this.next(options.next); }
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
  public nextIndex(action: MiddlewareAction) {
    Object.keys(action).forEach((index) => {
      const M = action[index];
      const m: Middleware = M instanceof Middleware ? M : factory(M);
      this.handlers.push(new ResultsHandler(m, index.toString()));
    });
  }

  public next(options: MiddlewareOptions | Middleware | string) {
    if (options === "gather") {
      options = factory({require: "gather"});
    }
    this.nextEach(options as MiddlewareOptions | Middleware);
  }

  protected _handle(result: Result, gather: GatherCallback) {
    const parts = this.divide(result);
    this.handlers.forEach((handler) => {
        handler.handle(parts, gather);
    });
  }

  protected abstract divide(result: Result): Result[];
}

export interface DividerOptions extends MiddlewareOptions {
  nextList?: MiddlewareOptions[];
  nextEach?: MiddlewareOptions;
  nextIndex?: MiddlewareAction;
  next?: MiddlewareAction | string;
}
