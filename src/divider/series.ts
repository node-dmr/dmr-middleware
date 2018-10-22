/*
 * @Author: qiansc
 * @Date: 2018-09-22 17:52:09
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 17:10:59
 */

import {Result} from "../middleware";
import {Regexp, RegexpOption} from "./regexp";

export class Series extends Regexp {
  protected spartten: RegExp;
  protected index: ($: RegExpMatchArray) => string;
  protected value: ($: RegExpMatchArray) => string;
  constructor(option: SeriesOption) {
    super(option);
    if (option.spartten instanceof RegExp) {
      this.spartten = option.spartten;
    } else if (option.spartten) {
      const part = option.spartten.match(/^\/(.*)\/(\w)*$/);
      if (part) {
        this.spartten = new RegExp(part[1]);
      }
    } else {
      this.spartten = new RegExp(this.partten.source);
    }

    if (option.index && option.index.match(/^`.*`$/)) {
      this.index = eval.call (null, "($) => " + option. index);
    }
    if (option.value && option.value.match(/^`.*`$/)) {
      this.value = eval.call (null, "($) => " + option. value);
    }
  }
  protected divide(result: Result): Result[] {
    const results = super.divide(result);
    const series: Result[] = [];
    results.forEach(([index, value]) => {
      const matches = value.match(this.spartten);
      if (matches) {
        let i: string | undefined;
        let v: string | undefined;
        if (this.index) {
          i = this.index(matches);
        } else if (matches[1]) {
          i = matches [1];
        }
        if (this.value) {
          v = this.value(matches);
        } else if (!this.value && matches[2]) {
          v = matches[2];
        }
        if (i !== undefined && v !== undefined) {
          series.push([i , v]);
        }
      }
    });
    return series;
  }
}

export interface SeriesOption extends RegexpOption {
  partten: string | RegExp;
  spartten?: string | RegExp;
  index?: string;
  value?: string;
}
