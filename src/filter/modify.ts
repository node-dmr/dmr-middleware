/*
 * @Author: qiansc
 * @Date: 2018-09-30 09:48:28
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 09:48:13
 */
import * as _ from "underscore";
import {Filter, FilterOption} from "../filter";
import {Result} from "../middleware";

export class Modify extends Filter<ModifyOption> {
  protected indexExp: ModifyFn;
  protected valueExp: ModifyFn;
  protected regexp: RegExp | false;
  constructor(option: ModifyOption) {
    super(option);
    if (option.index) {
      this.indexExp = exp(option.index);
    }
    if (option.value) {
      this.valueExp = exp(option.value);
    }
    if (option.regexp instanceof RegExp) {
      this.regexp = option.regexp;
    } else if (option.regexp) {
      const part = option.regexp.match(/^\/(.*)\/(\w)*$/);
      if (part) {
        this.regexp = new RegExp(part[1], part[2]);
      } else {
        this.regexp = false;
      }
    }
  }
  protected deal(result: Result): Result | false {
    const target = this.option.regexpTarget === "index" ? result[0] : result[1];
    let scope: any = this;
    if (this.regexp) {
      const matches = target.match(this.regexp);
      if (matches) {
        scope = RegExp;
      } else {
        return false;
      }
    } else if (this.regexp === false) {
      return false;
    }
    // try {
    return [
        this.indexExp && this.indexExp(result[0], result[1], _) || result[0],
        this.valueExp && this.valueExp(result[0], result[1], _) || result[1],
      ];
    // } catch (e) {
    //   console.warn(e);
    //   return false;
    // }

  }
}

export interface  ModifyOption extends FilterOption {
  index?: string | ModifyFn;
  value?: string | ModifyFn;
  regexp?: string | RegExp;
  regexpTarget?: "index" | "value";
}
function exp(expr: string | ModifyFn): ModifyFn {
  if (typeof expr === "string") {
    return eval.call(null, "(index, value, _) => (" + expr + ").toString()");
  } else {
    return expr;
  }
}

type ModifyFn = (index: string, value: string, _?) => string | undefined;
