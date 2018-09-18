/*
 * @Author: qiansc
 * @Date: 2018-09-17 23:00:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 22:32:08
 */
import {expect} from "chai";
import {Divider, Noop, Result} from "../src/index";

describe("Abstract Divider Test", () => {
  it("Make Twice Divider", () => {
    class Twice extends Divider {
      protected divide(result: Result): Result[] {
        return [result, result];
      }
    }
    const twice = new Twice();
    let times = 0;
    twice.next({
      a: new Noop(),
    });
    twice.handle(["a", "b"], () => {
      console.log("gather of abstract twice %s", ++ times);
    });
    expect(times).to.be.eq(2);
  });
});
