/*
 * @Author: qiansc
 * @Date: 2018-05-18 00:15:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-30 18:18:39
 */
import {Filter, Finisher, GatherCallback, Middleware, Result} from "./index";
import ResultsHandler from "./results-handler";
// import {PairOptions} from "./pair";

export abstract class Divider<DividerOption = {}> extends Middleware<DividerOption> {
  private handlers: ResultsHandler[] = [];
  private beforeFilter: Filter<any>;
  private afterFilter: Filter<any>;
  constructor(options: DividerOption) {
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
  public nextList(list: Array<Middleware<any>>): this {
    for (let index = 0; index < list.length ; index++) {
      const M = list[index];
      this.handlers.push(new ResultsHandler(M, index.toString()));
    }
    return this;
  }
  // nextEach 重载实现
  public nextEach(m: Middleware<any>): this {
    this.handlers.push(new ResultsHandler(m));
    return this;
  }
  // next 重载实现
  public nextIndex(action: Array<Middleware<any>> | {[key: string]: Middleware<any>}): this {
    Object.keys(action).forEach((index) => {
      const m = action[index];
      this.handlers.push(new ResultsHandler(m, index.toString()));
    });
    return this;
  }

  public next(options: Middleware<any> | typeof Finisher): this {
    if (options instanceof Middleware) {
      this.nextEach(options as Middleware<any>);
    } else {
      this.nextEach(new options());
    }
    return this;
  }

  public before(f: Filter<any>) {
    this.beforeFilter = f;
    return this;
  }

  public after(f: Filter<any>) {
    this.afterFilter = f;
    return this;
  }

  protected _handle(result: Result, gather: GatherCallback) {
    this.dealBefore(result, (bfResult: Result) => {
      const parts = this.divide(bfResult);
      this.dealAfter(parts, (afResults) => {
        this.handlers.forEach((handler) => {
            handler.handle(afResults, gather);
        });
      });
    });

  }
  protected abstract divide(results: Result): Result[];

  private dealBefore(result: Result, cb: (bfResult: Result) => void) {
    if (this.beforeFilter) {
      this.beforeFilter.handle(result, (rs: Result) => {
        cb(rs);
      });
    } else {
      cb(result);
    }
  }

  private dealAfter(results: Result[], cb: (afResults: Result[]) => void) {
    if (this.afterFilter) {
      const afResults: Result[] = [];
      results.forEach((result) => {
        this.afterFilter.handle(result, (rs: Result) => {
          afResults.push(rs);
        });
      });
      cb (afResults);
    } else {
      cb(results);
    }
  }

}
