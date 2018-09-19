/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:10:51
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 10:39:15
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
  nextList?: MiddlewareOptions[];
  nextEach?: MiddlewareOptions;
  nextIndex?: MiddlewareAction;
  next?: MiddlewareAction;
  require?: string;
}

export type Result = [string, string];
export interface MiddlewareAction {
  [key: string]: MiddlewareOptions | Middleware;
}
export type GatherCallback = (data?: Result) => void;
