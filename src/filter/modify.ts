/*
 * @Author: qiansc
 * @Date: 2018-09-30 09:48:28
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 09:48:13
 */
import * as _ from "underscore";
import {Filter, FilterOption} from "../filter";
import {Result} from "../middleware";
/**
 * Modify(extends Filter) can modify the index or value by modifying the expression or method.
 * See ModifyOption for details.
 *
 * Modify(extends Filter) 能够对index或value进行修改, 修改的方式是提供表达式或方法, 详见ModifyOption
 *
 * @example
 * new Modify({
 *    index: "`prefix_${index}`",
 *    value: "value + 'ms'" ,
 *    next: "Gather"
 * }).handle(["load", "1000"], (result) => console.log(result));
 * // ["prefix_load", "1000ms"]
 *
 * new Modify({
 *    index: "`${index}-${RegExp.$1}`",
 *    value: (index, value) => (RegExp.$2 + "ms"),
 *    regexp: /(\w+)=(\w+)/g, // or "/(\\w+)=(\\w+)/g"
 *    next: "Gather",
 *    // regexpTarget: "index",
 * }).handle(["20180901", "load=1000"], (result) => console.log(result));
 * // ["20180901-load", "1000ms"]
 */
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
  /**
   * New index template string or function
   * 新的index模板或function方法, 格式同value
   */
  index?: string | ModifyFn;
  /**
   * New value template string or function
   * 新的value模板或function方法
   * @example
   * // ["i", "v"]
   * option.value = "value"; // new Value => v
   * option.value = "'_' + value"; // new Value => _v
   * option.value = "`@${value}`"; // new Value => @v
   * option.value = (index, value, _) => index + value; // iv
   */
  value?: string | ModifyFn;
  /**
   * process index/value by using RegExp
   * 使用正则表达式去处理value, 如果需要处理index, 需要设定regexpTarget为"index"
   * @example
   * option.regexp = /(\w+)=(\w+)/g;
   * option.regexp = "/(\\w+)=(\\w+)/g";
   */
  regexp?: string | RegExp;
  /**
   * regexp target
   * 正则表达式的目标
   */
  regexpTarget?: "index" | "value";
}

/**
 * @hidden and @ignore
 */
function exp(expr: string | ModifyFn): ModifyFn {
  if (typeof expr === "string") {
    return eval.call(null, "(index, value, _) => (" + expr + ").toString()");
  } else {
    return expr;
  }
}
/**
 * ModifyFn (index: string, value: string, _?) => string | undefined;
 * _ is underscore
 */
type ModifyFn = (index: string, value: string, _?) => string | undefined;
