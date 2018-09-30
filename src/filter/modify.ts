/*
 * @Author: qiansc
 * @Date: 2018-09-30 09:48:28
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-30 18:09:04
 */
import {Filter} from "../filter";
import {MiddlewareOptions, Result} from "../middleware";
import expression from "../util/expression";

export class Modify extends Filter {
  protected indexExp: (index: string, value: string) => string;
  protected valueExp: (value: string, index: string) => string;
  constructor(options: ModifyOptions) {
    super(options);
    // $ - index  $1 - value
    this.indexExp = expression(options.indexExpr, 2);
    this.valueExp = expression(options.expr, 2);
  }
  protected deal(result: Result): Result {
    return [
      this.indexExp(result[0], result[1]),
      this.valueExp(result[1], result[0]),
    ];
  }
}

export interface ModifyOptions extends  MiddlewareOptions {
  indexExpr?: string | undefined;
  expr?: string | undefined;
}
