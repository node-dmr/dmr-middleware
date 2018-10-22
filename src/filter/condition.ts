/*
 * @Author: qiansc
 * @Date: 2018-09-30 09:48:28
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-02 08:38:55
 */
import {Filter} from "../filter";
import {Result} from "../middleware";
import expression from "../util/expression";

export class Condition extends Filter<ConditionOption> {
  protected exp: (value: string, index: string) => string;
  constructor(options: ConditionOption) {
    options.type = options.type ||  "white";
    super(options);
    // $ - index  $1 - value
    if (options.expr) {
      this.exp = expression(options.expr, 2);
    }
  }
  protected deal(result: Result): Result | false {
    if (this.exp) {
      if (this.exp(result[1], result[0]) === "true") {
        if (this.options.type === "black") {
          // black && true => drop
          return false;
        }
      } else {
        if (this.options.type === "white") {
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

export interface ConditionOption {
  expr: string | undefined;
  type?: string;
}
