/*
 * @Author: qiansc
 * @Date: 2018-09-16 23:50:34
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:30:38
 */
import {GatherCallback, Middleware, Result} from "./middleware";

export class Finisher extends Middleware<{}> {
  constructor() {
    super({});
  }
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
  }
}
