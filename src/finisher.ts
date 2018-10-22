/*
 * @Author: qiansc
 * @Date: 2018-09-16 23:50:34
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 19:35:47
 */
import {GatherCallback, Middleware, Result} from "./middleware";

/**
 * Finisher is the Middleware that handles the last call to the data, usually at the very end of the next operation.
 * Finisher's handle is very simple, usually do nothing (Noop class),
 * or call the GatherCallback (Gather class) that has been passed down, and pass in the processed data.
 *
 * Finisher是处理数据最后调用的Middleware, 通常出现在next操作的最末端.
 * Finisher的handle很简单, 通常是什么都不做(Noop类), 或者调用一直传递下来的GatherCallback（Gather类）, 并传入处理好的数据.
 */
export class Finisher extends Middleware<{}> {
  constructor() {
    super({});
  }
  protected _handle(result: Result, gather: GatherCallback) {
    // do nothing
  }
}
