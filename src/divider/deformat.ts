/*
 * @Author: qiansc
 * @Date: 2018-06-10 13:59:35
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-20 20:06:58
 */
import deformat = require("deformat");
import {Divider} from "../divider";
import {Result} from "../middleware";
export class Deformat extends Divider<DeformatOption> {
  private handdler: any;
  constructor(options: DeformatOption) {
    super(options);
    this.handdler = deformat((this.options as DeformatOption).combined);
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
export interface DeformatOption {
  combined: string;
}
