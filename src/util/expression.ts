/*
 * @Author: qiansc
 * @Date: 2018-09-30 10:21:45
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-05 17:23:32
 */
/**
 * @param expression `${ESexpression}`
 * @param length Number of parameters ...$
 * @example
 * const exp = new Expression("`${$ + $1 + $2}$3`", 2);
 * exp(1, 2, 3, 4); // "64";
 */
import * as _ from "underscore";
export default function Expression(
    expression?: string, length: number = 1): exp {
  let params = "_, $";
  for (let i = 1; i < length; i++) {
    params += ", $" + i;
  }
  let func: any; // like type exp , add _ as underscore
  if (expression && expression.match(/^`.*`$/)) {
    func = eval.call (null, `(${params}) => ${expression}`);
  } else if (expression) {
    func = eval.call (null, `(${params}) => "${expression}"`);
  } else {
    func = eval.call (null, `(${params}) => $.toString()`);
  }
  return (...args) => func.call(null, _, ...args);
}
/**
 * @hidden and @ignore
 * $0 ~ $9  matches RegExp.$
 */
type exp = (
  $?: any,
  $1?: any,
  $2?: any,
  $3?: any,
  $4?: any,
  $5?: any,
  $6?: any,
  $7?: any,
  $8?: any,
  $9?: any,
) => string;
