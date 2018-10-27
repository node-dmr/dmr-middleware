/*
 * @Author: qiansc
 * @Date: 2018-09-18 00:29:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:15:44
 */
import {Finisher} from "../finisher";
import {GatherCallback, Result} from "../middleware";
/**
 * Gather (inherited from Finisher) can be used as the last middleware on the next call path,
 * it will call GatherCallback to return result
 *
 * Gather(继承Finisher)可以作为一个next调用路径上的最后一个middleware,
 * 它会调用GatherCallback返回result
 *
 * @example
 * new Copy().next(new Gather()).handle(":)", (result) => {
 *    console.log(result);
 * });
 * // :)  * 2
 */
export class Gather extends Finisher {
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
    gather(result);
  }
}
