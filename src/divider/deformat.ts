/*
 * @Author: qiansc
 * @Date: 2018-06-10 13:59:35
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-07-18 10:43:15
 */
import deformat = require("deformat");
import {Divider, DividerOptions} from "../divider";
import {Result} from "../middleware";
export class Deformat extends Divider {
  private handdler: any;
  constructor(options: DeformatOptions) {
    super(options);
    this.handdler = deformat((this.options as DeformatOptions).combined);
  }
  protected divide(result: Result): Result[] {
    const results: Result[] = [];
    const rs: JSON | null = this.handdler.exec(result[1]);
    if (rs === null) {return results; }
    Object.keys(rs).forEach((key) => {
      results.push([key, rs[key]]);
    });
    return results;
  }
}
export interface DeformatOptions extends DividerOptions {
  combined: string;
}
