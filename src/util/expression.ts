/*
 * @Author: qiansc
 * @Date: 2018-09-30 10:21:45
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-30 17:28:51
 */
/**
 * @param expression `${ESexpression}`
 * @param length Number of parameters ...$
 * @example
 * const exp = new Expression("`${$ + $1 + $2}$3`", 2);
 * exp(1, 2, 3, 4); // "64";
 */
export default function Expression(
    expression?: string, length: number = 1): exp {
  let params = "$";
  for (let i = 1; i < length; i++) {
    params += ", $" + i;
  }
  if (expression && expression.match(/^`.*`$/)) {
    return eval.call (null, `(${params}) => ${expression}`);
  } else if (expression) {
    return eval.call (null, `(${params}) => "${expression}"`);
  } else {
    return eval.call (null, `(${params}) => $.toString()`);
  }
}
// $0 ~ $9  matches RegExp.$
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
