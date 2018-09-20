/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:05:24
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-20 20:07:32
 */
import {Divider} from "../divider";
import {MiddlewareOptions, Result} from "../middleware";

export class Regexp extends Divider {
  private partten: RegExp;
  constructor(options: RegexpOptions) {
    super(options);
    if (options.partten instanceof RegExp) {
      this.partten = options.partten;
    } else {
      const part = options.partten.match(/^\/(.*)\/(\w)*$/);
      if (part) {
        this.partten = new RegExp(part[1], part[2]);
      }
    }
  }

  protected divide(result: Result): Result[] {
    const results: Result[] = [];
    if (this.partten) {
      const matches = result[1].match(this.partten);
      if (matches) {
        for (let index = 0; index < matches.length; index ++) {
          results.push([index.toString(), matches[index]]);
        }
      }
    }
    return results;
  }
}

export interface RegexpOptions extends MiddlewareOptions {
  partten: string | RegExp;
}
