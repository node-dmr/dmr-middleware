/*
 * @Author: qiansc
 * @Date: 2018-06-10 13:59:35
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-23 10:42:39
 */
import deformat = require("deformat");
import {Divider} from "../divider";
import {Result} from "../middleware";
/**
 * Deformat(extends Divider) can split value to multiple parts, usually used when parsing logs.
 * Deformat API based on https://www.npmjs.com/package/deformat
 *
 * @example
 * const combined = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"`;
 * const log = `192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"`;
 * const deformat = new Deformat({
 *   combined,
 * });
 * deformat.next(Gather);
 * let times = 0;
 * deformat.handle(["log", log], (result) => {
 *   console.log(result);
 * });
 * // 192.168.203.111
 * //
 * // 03/Dec/2014:22:07:37 -0800
 * //...
 */
export class Deformat extends Divider<DeformatOption> {
  private handdler: any;
  /**
   * {string} option.combined - deformat expression, api : https://www.npmjs.com/package/deformat
   */
  constructor(option: DeformatOption) {
    super(option);
    this.handdler = deformat((this.option as DeformatOption).combined);
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
  /** deformat expression, api : https://www.npmjs.com/package/deformat */
  combined: string;
}
