/*
 * @Author: qiansc
 * @Date: 2018-09-17 23:00:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 08:04:06
 */
import {expect} from "chai";
import {Divider, DividerOption, Gather, Noop, Result, Reverse} from "../src/index";

describe("Abstract Divider Test", () => {
  class Twice extends Divider<DividerOption> {
    constructor(option?: DividerOption) {
      super(option || {});
    }
    protected divide(result: Result): Result[] {
      return [result, result];
    }
  }
  it("Make Twice Divider", () => {
    const twice = new Twice();
    let times = 0;
    twice.nextIndex({
      b: new Gather(),
    });
    twice.before(new Reverse());
    twice.after(new Reverse().next(new Reverse()));
    twice.handle(["a", "b"], (result) => {
      console.log("gather of abstract twice %s", ++ times, result);
    });
    expect(times).to.be.eq(2);
  });

  it("Make Twice Divider", () => {
    const twice = new Twice({
      after: {
        _: "Reverse",
        next: {
          _: "Reverse",
        },
      },
      before: {
        _: "Reverse",
      },
      nextIndex: {
        b: {
          _: "Gather",
        },
      },
    });
    let times = 0;
    twice.handle(["a", "b"], (result) => {
      console.log("gather of abstract twice %s", ++ times, result);
    });
    expect(times).to.be.eq(2);
  });
});
