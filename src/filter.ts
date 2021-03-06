/*
 * @Author: qiansc
 * @Date: 2018-05-18 00:15:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 08:07:19
 */
import {Finisher, FinisherLike, GatherCallback, Middleware, MiddlewareConfig, MiddlewareFactory, Result} from "./index";
// import {Pairoption} from "./pair";

/**
 * Filter is a Middleware that processes single Result.
 * Filter processing can be filtering, key-value conversion, calculation, deformation and other operations.
 * After processing, Filter call the next Middleware to continue.
 *
 * Filter是加工单个Result的Middleware, 处理完后调用next预先指定的Middleware继续下一步处理.
 * Filter的处理的过程可以是过滤、键值转换、计算、变形等操作.
 */
export abstract class Filter<Option extends FilterOption = {}> extends Middleware<Option> {
  protected handler: Middleware<any>;
  constructor(option: Option) {
    super(option);

    if (option.next) {
      if (typeof option.next === "string") {
        this.next(MiddlewareFactory({_: option.next as any}));
      } else {
        this.next(MiddlewareFactory(option.next as MiddlewareConfig));
      }
    }
  }
  /**
   * The next method accepts a Middleware class or Finisher class type to specify the next step after data processing.
   *
   * next方法接受一个Middleware类或Finisher类类型以指定数据处理后下一步操作
   * @example
   * deformat.nextEach(filterA);
   * filterA.next(filterB);
   * filterB.next(Gather);
   */
  public next(m: Middleware<any> | typeof Finisher): Filter<Option> {
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

export interface FilterOption {
  /** next should be MiddlewareConfig or "Gather"/"Noop" */
  next?: MiddlewareConfig | FinisherLike;
}
