/*
 * @Author: qiansc
 * @Date: 2018-09-23 20:36:53
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 21:47:41
 */
import {expect} from "chai";
import {Filter, Gather, MiddlewareFactory as factory,  Result, Reverse, Series} from "../src";

describe("Filter Abstruct Test", () => {
  class F extends Filter {
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
    const series = new Series({
      partten: "/(\\w+)=(\\w+)/g",
    });
    series.next(new Gather());
    series.before(new F());
    series.after(new F().next(new F()));
    const param: {[index: string]: string} = {};
    let times = 0;
    series.handle(["word=abc pn=10 rn=20", "url"], (result) => {
      if (result) {
        param[result[0]] = result[1];
        console.log(result);
        times++;
      }
    });
    expect(times).to.be.eq(3);
    expect(param.word).to.be.eq("abc");
    expect(param.pn).to.be.eq("10");
    expect(param.rn).to.be.eq("20");
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
      next: "gather",
      require: "reverse",
    });
    r.handle(["key", "value"], (result: Result) => {
      expect(result[0]).to.be.eq("value");
      expect(result[1]).to.be.eq("key");
    });
  });
});
