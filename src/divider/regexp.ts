/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:05:24
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 09:42:26
 */
import {Divider, DividerOption} from "../divider";
import {Result} from "../middleware";
/**
 * Regexp(extends Divider) can match strings by RegExp,
 * and then wrap the matches into Result<index:string, match: string> for the next Middleware.
 *
 * Regexp(继承Divider) 能够通过正则表达式匹配字符串, 并将匹配结果(matches)逐一
 * 包装成Result<index:string, part: string>供下一步处理
 *
 * @example
 * const txt = "www.typescript.com";
 * const Regexp = new Regexp({regexp: /[\w]+/g}).next(Gather);
 * json.handle(["url", txt], (result) => {
 *  console.log(result);
 * });
 * // ["0", "www"]   ["1", "typescript"]   ["2", "com"]
 */
export class Regexp extends Divider<RegexpOption> {
  protected regexp: RegExp;
  /**
   * {string | RegExp} option.regexp
   */
  constructor(option: RegexpOption) {
    super(option);
    if (option.regexp instanceof RegExp) {
      this.regexp = option.regexp;
    } else {
      const part = option.regexp.match(/^\/(.*)\/(\w)*$/);
      if (part) {
        this.regexp = new RegExp(part[1], part[2]);
      }
    }
  }

  protected divide(result: Result): Result[] {
    const results: Result[] = [];
    if (this.regexp) {
      const matches = result[1].match(this.regexp);
      if (matches) {
        for (let index = 0; index < matches.length; index ++) {
          results.push([index.toString(), matches[index]]);
        }
      }
    }
    return results;
  }
}

export interface RegexpOption extends DividerOption {
  /**
   * RegExp or regexpString
   * @example
   * option.regexp = /(\w+)=(\w+)/g;
   * option.regexp = "/(\\w+)=(\\w+)/g";
   */
  regexp: string | RegExp;
}
