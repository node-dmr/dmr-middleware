/*
 * @Author: qiansc
 * @Date: 2018-09-30 09:48:28
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 07:56:57
 */
import * as _ from "underscore";
import {Filter, FilterOption} from "../filter";
import {Result} from "../middleware";

export class Condition extends Filter<ConditionOption> {
  protected exp: ConditionFn;
  constructor(option: ConditionOption) {
    option.type = option.type ||  "white";
    super(option);
    // $ - index  $1 - value
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
  fn: ConditionFn | string;
  type?: "white" | "black";
}
type ConditionFn = (index: string, value: string, _?) => boolean;
