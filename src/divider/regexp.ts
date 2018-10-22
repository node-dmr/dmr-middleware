/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:05:24
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 17:10:46
 */
import {Divider} from "../divider";
import {Result} from "../middleware";

export class Regexp extends Divider<RegexpOption> {
  protected partten: RegExp;
  constructor(option: RegexpOption) {
    super(option);
    if (option.partten instanceof RegExp) {
      this.partten = option.partten;
    } else {
      const part = option.partten.match(/^\/(.*)\/(\w)*$/);
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
