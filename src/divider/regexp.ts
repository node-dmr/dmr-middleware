/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:05:24
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-22 22:27:00
 */
import {Divider} from "../divider";
import {Result} from "../middleware";

export class Regexp extends Divider<RegexpOption> {
  protected partten: RegExp;
  constructor(options: RegexpOption) {
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

export interface RegexpOption {
  partten: string | RegExp;
}
