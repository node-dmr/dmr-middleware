/*
 * @Author: qiansc
 * @Date: 2018-09-18 00:29:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:16:08
 */
import {Finisher} from "../finisher";
import {GatherCallback, Result} from "../middleware";

/**
 * Gather (inherited from Finisher) can be used as the last middleware on the next call path,
 * it will call GatherCallback ,but return false instead of result
 *
 * Gather(继承Finisher)可以作为一个next调用路径上的最后一个middleware,
 * 它会调用GatherCallback，但不会返回result而是返回false
 */
export class Noop extends Finisher {
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
    gather();
  }
}
