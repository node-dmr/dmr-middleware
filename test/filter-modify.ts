/*
 * @Author: qiansc
 * @Date: 2018-09-30 11:23:21
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-30 18:18:49
 */
import {expect} from "chai";
import {MiddlewareFactory as factory, Modify, Result, Series} from "../src";

describe("Filter Modify", () => {
  it("value => new", () => {
    const m = new Modify({
      expr: "new",
    });
    let rs;
    m.handle(["key", "value"], (result) => {
      console.log(rs = result);
    });
    expect(rs[0]).to.be.eq("key");
    expect(rs[1]).to.be.eq("new");
  });

  it("filter modify", () => {
    const m = new Modify({
      expr: "`${$ * 2}`",
      indexExpr: "`prefix_${$ + $1}`",
    });
    let rs;
    m.handle(["key", "123"], (result) => {
      console.log(rs = result);
    });
    expect(rs[0]).to.be.eq("prefix_key123");
    expect(rs[1]).to.be.eq("246");
  });

  it("filter modify factory", () => {
    const m = factory({
      expr: "`${$ / 1000}s`",
      indexExpr: "`front_${$}`",
      require: "modify",
    });
    let rs;
    m.handle(["load", "1000"], (result) => {
      console.log(rs = result);
    });
    expect(rs[0]).to.be.eq("front_load");
    expect(rs[1]).to.be.eq("1s");
  });

  it("filter modify whith series", () => {
    const s = factory({
      after: {
        expr: "`${$ / 1000}s`",
        indexExpr: "`front_${$}`",
        require : "modify",
      },
      before: {
        expr: "`${$}&cus=2800`",
        require: "modify",
      },
      next: {
        expr: "`${$.replace('s', '')}`",
        next: "gather",
        require: "modify",
      },
      partten: "/(\\w+)=(\\w+)/g",
      require: "series",
    });
    const rs: Result[] = [];
    s.handle(["url", "/s?doc=1200&load=1500&paint=2300"], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(4);
    expect(rs[0][0]).to.be.eq("front_doc");
    expect(rs[1][1]).to.be.eq("1.5");
    expect(rs[2][0]).to.be.eq("front_paint");
    expect(rs[3][1]).to.be.eq("2.8");
  });

  it("filter modify whith series", () => {
    const s = new Series({
      partten: "/(\\w+)=(\\w+)/g",
    })
    .before(new Modify({expr: "`${$}&cus=2800`"}))
    .after(new Modify({
      expr: "`${$ / 1000}s`",
      indexExpr: "`front_${$}`",
    }))
    .next(new Modify({expr: "`${$.replace('s', '')}`"}));

    const rs: Result[] = [];
    s.handle(["url", "/s?doc=1200&load=1500&paint=2300"], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(4);
    expect(rs[0][0]).to.be.eq("front_doc");
    expect(rs[1][1]).to.be.eq("1.5");
    expect(rs[2][0]).to.be.eq("front_paint");
    expect(rs[3][1]).to.be.eq("2.8");
  });

});
