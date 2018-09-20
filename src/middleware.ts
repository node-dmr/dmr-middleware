/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:10:51
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-20 23:20:41
 */

export abstract class Middleware {
  protected options: MiddlewareOptions;
  constructor(options: MiddlewareOptions = {}) {
    this.options = options;
  }
  public handle(result: Result, gather: GatherCallback) {
    this._handle(result, gather);
  }
  protected abstract _handle(result: Result, gather: GatherCallback): void;
}
export interface MiddlewareOptions {
  [index: string]: any;
}
export type Result = [string, string];
export type GatherCallback = (data?: Result) => void;
