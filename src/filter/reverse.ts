/*
 * @Author: qiansc
 * @Date: 2018-09-25 10:26:59
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 07:57:55
 */
import {Filter, FilterOption} from "../filter";
import {Result} from "../middleware";

/**
 * Reverse(extends Filter) exchanges index and value.
 *
 * Reverse是一个会交换index与value的Filter
 *
 * @example
 * new Reverse().next(Gather).handle(
 *    ["a", "b"],
 *    (result) => console.log(result),
 * );
 * // ["b", "a"]
 */
export class Reverse extends Filter {
  constructor(option: FilterOption = {}) {
    super(option);
  }
  protected deal(result: Result): Result {
    return [result[1], result[0]];
  }
}
