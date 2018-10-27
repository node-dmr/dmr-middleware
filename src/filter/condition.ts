/*
 * @Author: qiansc
 * @Date: 2018-09-30 09:48:28
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 07:56:57
 */
import * as _ from "underscore";
import {Filter, FilterOption} from "../filter";
import {Result} from "../middleware";

/**
 * Condition is a conditional filter that determines whether to continue the next operation,
 * that based on the boolean value returned by the ConditionFn method.
 *
 * Condition 是一个条件过滤器, 根据ConditionFn方法返回的boolean值决定是否继续next操作
 * @example
 * const filter = new Condition({
 *  fn: (index, value) => parseInt(value) > 0,
 * }).next(Gather);
 * filter.handle("100", (result) => console.log(result)); // ["undefined", "100"];
 * filter.handle("-100", (result) => console.log(result));
 */
export class Condition extends Filter<ConditionOption> {
  protected exp: ConditionFn;
  constructor(option: ConditionOption) {
    option.type = option.type ||  "white";
    super(option);
    if (typeof option.fn === "string") {
      this.exp = eval.call(null, "(index, value, _) => (" + option.fn + ")");
    } else if (option.fn) {
      this.exp = option.fn;
    }
  }
  protected deal(result: Result): Result | false {
    if (this.exp) {
      if (!!this.exp(result[0], result[1], _) === true) {
        if (this.option.type === "black") {
          // black && true => drop
          return false;
        }
      } else {
        if (this.option.type === "white") {
          // white && false => drop
          return false;
        }
      }
    } else {
      return false;
    }
    return result;
  }
}

export interface ConditionOption extends FilterOption {
  /**
   * fn is a ConditionFn or ConditionFnLike string
   * _ is underscore
   * @example
   * option.fn = (index: string, value: string, _?) => parseInt(value) > 1;
   * option.fn = "value > 1";
   */
  fn: ConditionFn | string;
  /**
   * type of Condition filter ( whitelisted / blacklisted ). The default is whitelist.
   * type参数指定该Condition过滤器是白名单过滤还是黑名单, 默认是白名单
   */
  type?: "white" | "black";
}
/**
 * ConditionFn (index: string, value: string, _?) => boolean
 * _ is underscore
 */
type ConditionFn = (index: string, value: string, _?) => boolean;
