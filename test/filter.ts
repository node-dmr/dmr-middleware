/*
 * @Author: qiansc
 * @Date: 2018-09-23 20:36:53
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 08:00:29
 */
import {expect} from "chai";
import {Filter, Gather, MiddlewareFactory as factory,  Result, Reverse} from "../src";

describe("Filter Abstruct Test", () => {
  class F extends Filter {
    constructor() {
      super({});
    }
    protected deal(result: Result): Result {
      return [result[1], result[0]];
    }
  }
  it("Extends Filter", () => {
    const f = new F();
    f.handle(["key", "value"], (result: Result) => {
      console.log(result);
      expect(result[0]).to.be.eq("value");
      expect(result[1]).to.be.eq("key");
    });
  });

  it("Filter In Divider", () => {
    const f = new F();
    f.next(new Gather());
    let rs: Result = ["x", "x"];
    f.handle(["a", "b"], (result) => {
      if (result) {
        rs = result;
      }
    });
    expect(rs[0]).to.be.eq("b");
    expect(rs[1]).to.be.eq("a");
  });

  it("Extends Filter", () => {
    const f = new F();
    f.next(Gather);
    f.handle(["key", "value"], (result: Result) => {
      console.log(result);
      expect(result[0]).to.be.eq("value");
      expect(result[1]).to.be.eq("key");
    });
  });

  it("Reverse Test", () => {
    const r = new Reverse();
    r.next(Gather);
    r.handle(["key", "value"], (result: Result) => {
      console.log(result);
      expect(result[0]).to.be.eq("value");
      expect(result[1]).to.be.eq("key");
    });
  });

  it("Reverse Factory Test", () => {
    const r = factory({
      _: "Reverse",
      next: "Gather",
    });
    r.handle(["key", "value"], (result: Result) => {
      expect(result[0]).to.be.eq("value");
      expect(result[1]).to.be.eq("key");
    });
  });
});
