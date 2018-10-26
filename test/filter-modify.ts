/*
 * @Author: qiansc
 * @Date: 2018-09-30 11:23:21
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 08:38:27
 */
import {expect} from "chai";
import {MiddlewareFactory as factory, Modify, Result} from "../src";

describe("Filter Modify", () => {
  it("value => new", () => {
    const m = new Modify({
      value: () => "new",
    });
    let rs;
    m.handle(["key", "value"], (result) => {
      console.log(rs = result);
    });
    expect(rs[0]).to.be.eq("key");
    expect(rs[1]).to.be.eq("new");
  });

  it("index => new", () => {
    const m = new Modify({
      index: (index, value, _) => index + index,
    });
    let rs;
    m.handle(["key", "value"], (result) => {
      console.log(rs = result);
    });
    expect(rs[0]).to.be.eq("keykey");
    expect(rs[1]).to.be.eq("value");
  });

  it("filter modify", () => {
    const m = new Modify({
      index: "`prefix_${index + value}`",
      value: "`${value * 2}`",
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
      _: "Modify",
      index: "`front_${index}`",
      value: "`${value / 1000}s`",
    });
    let rs;
    m.handle(["load", "1000"], (result) => {
      console.log(rs = result);
    });
    expect(rs[0]).to.be.eq("front_load");
    expect(rs[1]).to.be.eq("1s");
  });

  // it("filter modify whith series", () => {
  //   const s = factory({
  //     _: "series",
  //     after: {
  //       _ : "modify",
  //       index: "`front_${$}`",
  //       value: "`${$ / 1000}s`",
  //     },
  //     before: {
  //       _: "modify",
  //       value: "`${$}&cus=2800`",
  //     },
  //     next: {
  //       _: "modify",
  //       next: "gather",
  //       value: "`${$.replace('s', '')}`",
  //     },
  //     partten: "/(\\w+)=(\\w+)/g",
  //   });
  //   const rs: Result[] = [];
  //   s.handle(["url", "/s?doc=1200&load=1500&paint=2300"], (result) => {
  //     console.log(result);
  //     if (result) {
  //       rs.push(result);
  //     }
  //   });
  //   expect(rs.length).to.be.eq(4);
  //   expect(rs[0][0]).to.be.eq("front_doc");
  //   expect(rs[1][1]).to.be.eq("1.5");
  //   expect(rs[2][0]).to.be.eq("front_paint");
  //   expect(rs[3][1]).to.be.eq("2.8");
  // });

  // it("filter modify whith series", () => {
  //   const s = new Series({
  //     partten: "/(\\w+)=(\\w+)/g",
  //   })
  //   .before(new Modify({value: "`${$}&cus=2800`"}))
  //   .after(new Modify({
  //     index: "`front_${$}`",
  //     value: "`${$ / 1000}s`",
  //   }))
  //   .next(new Modify({value: "`${$.replace('s', '')}`"}));

  //   const rs: Result[] = [];

  //   s.handle(["url", "/s?doc=1200&load=1500&paint=2300"], (result) => {
  //     console.log(result);
  //     if (result) {
  //       rs.push(result);
  //     }
  //   });
  //   expect(rs.length).to.be.eq(4);
  //   expect(rs[0][0]).to.be.eq("front_doc");
  //   expect(rs[1][1]).to.be.eq("1.5");
  //   expect(rs[2][0]).to.be.eq("front_paint");
  //   expect(rs[3][1]).to.be.eq("2.8");
  // });

});
