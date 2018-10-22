/*
 * @Author: qiansc
 * @Date: 2018-09-18 01:12:09
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:16:49
 */
import {GatherCallback, Result} from "./index";
import {Middleware} from "./middleware";
/**
 * @hidden and @ignore
 */
export default class ResultsHandler {
  private index: string | undefined;
  private middleware: Middleware<any>;
  constructor(middleware: Middleware<any> , index?: string) {
      this.index = index;
      this.middleware = middleware;
  }
  public handle(results: Result[], gather: GatherCallback) {
    results.forEach((result) => {
      if (this.index && result[0] === this.index || !this.index) {
        this.middleware.handle(result, gather);
      }
    });
  }
}
