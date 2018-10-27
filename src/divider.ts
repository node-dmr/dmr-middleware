/*
 * @Author: qiansc
 * @Date: 2018-05-18 00:15:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 07:52:14
 */
import {Filter, Finisher, FinisherLike, GatherCallback,
  Middleware, MiddlewareConfig, MiddlewareFactory, Result} from "./index";
import ResultsHandler from "./results-handler";

/**
 * Divider splits a result into multiple results by using the divide method,
 * and then assigns Middleware to process each subsequent result through the next method.
 * In addition, Divider provides a before/after method to specify the Filter to process
 * result/results before/after divide.
 *
 * Divider通过divide方法将一个result分裂为多个results，然后通过next方法指定Middleware处理后续每个result,
 * 此外Divider提供before/after方法可在divide前后指定Filter对result/results进行处理
 */
export abstract class Divider<Option extends DividerOption> extends Middleware<Option> {
  private handlers: ResultsHandler[] = [];
  private beforeFilter: Filter<any>;
  private afterFilter: Filter<any>;
  constructor(option: Option) {
    super(option);
  // if (middleware instanceof Divider) {
    if (option.nextIndex) {
      const nexts = option.nextIndex;
      const action = {};
      Object.keys(nexts).forEach((index) => {
        // if (nexts.hasOwnProperty(index)) {
          action[index] =  MiddlewareFactory(nexts[index]);
        // }
      });
      this.nextIndex(action);
    }

    if (option.nextEach) {
      this.nextEach(MiddlewareFactory(option.nextEach));
    }

    if (option.nextList) {
      const middlewares: Array<Middleware<any>> = [];
      for (const conf of option.nextList) {
        middlewares.push(MiddlewareFactory(conf));
      }
      this.nextList(middlewares);
    }

    if (option.next) {
      if (typeof option.next === "string") {
        this.next(MiddlewareFactory({_: option.next as any}));
      } else {
        this.next(MiddlewareFactory(option.next as MiddlewareConfig));
      }
    }

    if (option.before) {
      this.before(MiddlewareFactory(option.before) as Filter<any>);
    }

    if (option.after) {
      this.after(MiddlewareFactory(option.after) as Filter<any>);
    }
  // }
  }

  /**
   * The nextList method accepts Middleware array, and each Middleware processes result corresponding to index.
   *
   * nextList方法接受Middleware数组, 每个Middleware处理对应index的result
   */
  public nextList(list: Array<Middleware<any>>) {
    for (let index = 0; index < list.length ; index++) {
      const M = list[index];
      this.handlers.push(new ResultsHandler(M, index.toString()));
    }
    return this;
  }

  /**
   * The nextEach method accepts a Middleware to handle each result.
   *
   * nextEach方法接受一个Middleware处理每个result
   */
  public nextEach(m: Middleware<any>) {
    this.handlers.push(new ResultsHandler(m));
    return this;
  }
  /**
   * The nextList method accepts {[index:string]: Middleware} / Middleware[],
   * and each Middleware handles the result corresponding to its index.
   *
   *  nextList方法接受一个索引对象, 每个Middleware处理对应其index对应的result
   */
  public nextIndex(action: Array<Middleware<any>> | {[key: string]: Middleware<any>}) {
    Object.keys(action).forEach((index) => {
      const m = action[index];
      this.handlers.push(new ResultsHandler(m, index.toString()));
    });
    return this;
  }
  /**
   * The next method is same as the nextEach method when accepts Middleware
   * However it provides a simple way by using Finisher Type.
   *
   * next方法同nextEach方法可以接受一个Middleware, 或者next可以接受Finisher类类型作为一种简写方式
   * @example
   *  // Gather extends Finisher
   *  divider.next(new Gather());
   *  divider.next(Gather);
   */
  public next(option: Middleware<any> | typeof Finisher) {
    if (option instanceof Middleware) {
      this.nextEach(option as Middleware<any>);
    } else {
      this.nextEach(new option());
    }
    return this;
  }
  /**
   * The before method can specify Filter to process the original result before divide.
   *
   * before方法可在divide前指定Filter对原始result进行处理
   */
  public before(f: Filter<any>) {
    this.beforeFilter = f;
    return this;
  }
  /**
   * The after method can specify Filter to process results after divide.
   *
   * after方法可在divide后指定Filter对分裂后的results进行处理
   */
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
  /**
   * The divide method splits the incoming hanle result data through various processing methods.
   *
   * divide方法将hanle传入的result数据, 通过各种不同的处理方法进行分裂
   */
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

export interface DividerOption {
  /** next should be MiddlewareConfig or "Gather"/"Noop" */
  next?: MiddlewareConfig | FinisherLike;
  nextEach?: MiddlewareConfig;
  nextList?: MiddlewareConfig[];
  nextIndex?: Array<[string, MiddlewareConfig]> | {[key: string]: MiddlewareConfig};
  after?: MiddlewareConfig;
  before?: MiddlewareConfig;
}
