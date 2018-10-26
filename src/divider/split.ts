/*
 * @Author: qiansc
 * @Date: 2018-09-18 20:54:14
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 17:11:02
 */
import {Divider, DividerOption} from "../divider";
import {Result} from "../index";
/**
 * Split(extends Divider) can split the string by separator,
 * and then wrap the each result element into Result<index:string, element: string> for the next step
 *
 * Split(继承Divider) 能够通过分隔符切分字符串, 并将结果数组元素逐一
 * 包装成Result<index:string, element: string>供下一步处理
 *
 * @example
 * const txt = "www.typescript.com";
 * const Regexp = new Regexp({separater: "."}).next(Gather);
 * json.handle(["url", txt], (result) => {
 *  console.log(result);
 * });
 * // ["0", "www"]   ["1", "typescript"]   ["2", "com"]
 */
export class Split extends Divider<SplitOption> {
  /**
   * {string} option.separater
   */
  constructor(option: SplitOption) {
    super(option);
  }
  protected divide(result: Result): Result[] {
    const parts = result[1].split((this.option as SplitOption).separater);
    const results: Result[] = [];
    for (let index = 0; index < parts.length; index++) {
      results.push([index.toString(), parts[index]]);
    }
    return results;
  }
}

export interface SplitOption extends DividerOption {
  separater: string;
}
