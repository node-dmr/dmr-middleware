/*
 * @Author: qiansc
 * @Date: 2018-09-30 11:23:21
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 09:51:08
 */
import {expect} from "chai";
import {MiddlewareFactory as factory, Modify, Result} from "../src";

describe("Filter Modify Regexp", () => {
  it("filter modify whith Regexp", () => {
    const s = factory({
      _: "Regexp",
      after: {
        _ : "Modify",
        index: "`front_${index}_${RegExp.$1}`",
        regexp: "/(\\w+)=(\\w+)/",
        value: "`${RegExp.$2 / 1000}s`",
      },
      before: {
        _: "Modify",
        value: "`${value}&cus=2800`",
      },
      next: {
        _: "Modify",
        next: "Gather",
        value: "value.replace('s', '')",
      },
      regexp: "/(\\w+)=(\\w+)/g",
    });
    const rs: Result[] = [];
    s.handle(["url", "/s?doc=1200&load=1500&paint=2300"], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(4);
    expect(rs[0][0]).to.be.eq("front_0_doc");
    expect(rs[1][1]).to.be.eq("1.5");
    expect(rs[2][0]).to.be.eq("front_2_paint");
    expect(rs[3][1]).to.be.eq("2.8");
  });

  it("filter modify whith Regexp Mini", () => {
    const s = new Modify({
      index: "`front_${index}_${RegExp.$1}`",
      regexp: /(\w+)=(\w+)/,
      value: "`${RegExp.$2 / 1000}s`",
    });
    const rs: Result[] = [];
    s.handle(["url", "a-b"], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(0);
  });

  it("filter modify whith Wrong Regexp", () => {
    const s = new Modify({
      index: "`front_${index}_${RegExp.$1}`",
      regexp: "???",
      value: "`${RegExp.$2 / 1000}s`",
    });
    const rs: Result[] = [];
    s.handle(["url", "a-b"], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(0);
  });

  it("filter modify whith Target Index", () => {
    const s = new Modify({
      index: "`front-${RegExp.$2}`",
      regexp: /(\w+)-(\w+)/,
      regexpTarget: "index",
    });
    const rs: Result[] = [];
    s.handle(["url-abc", "1000"], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(1);
    expect(rs[0][0]).to.be.eq("front-abc");
    expect(rs[0][1]).to.be.eq("1000");
  });
});
