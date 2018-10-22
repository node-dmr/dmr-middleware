/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:10:51
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 17:15:00
 */

/**
 *
 * Middleware is abstract class of all dmr-middleware which provides handle method for process or other middleware.
 * The dmr-middleware classes inherit three classes (divider / finisher / filter) which inherit Middleware.
 *
 * Middleware是所有dmr-middleware的抽象父类, 主要提供handle句柄方法供进程或其他middleware调用.
 * dmr-middleware的类分为三种类型, 分别继承自divider / finisher / filter抽象类, 而这三种抽象类也继承Middleware.
 */
export abstract class Middleware<MiddlewareOption> {
  protected option: MiddlewareOption;
  constructor(option: MiddlewareOption) {
    this.option = option;
  }
  /**
   * Handle is invoke method of Middleware.
   * Result is the data to be processed. GatherCallback is a callback for processing.
   * GatherCallback accepts Result | undefined.
   *
   * handle是Middleware类被调用时使用的方法, Result为待处理数据,
   * GatherCallback为处理完毕时的回调, GatherCallback接受的参数为Result | undefined
   */
  public handle(result: Result, gather: GatherCallback) {
    this._handle(result, gather);
  }
  protected abstract _handle(result: Result, gather: GatherCallback): void;
}
export type Result = [string, string];
export type GatherCallback = (data?: Result) => void;
