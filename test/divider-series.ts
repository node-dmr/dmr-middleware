/*
 * @Author: qiansc
 * @Date: 2018-09-22 22:11:52
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 18:51:38
 */

import {expect} from "chai";
import {Gather, MiddlewareFactory as factory, Noop, Series} from "../src/index";

describe("Divider.Series Test", () => {
  it("Series factory", () => {
    const series = factory({
      next: "gather",
      partten: "/(\\w+)=(\\w+)/g",
      require: "series",
    });
    const param: {[index: string]: string} = {};
    let times = 0;
    series.handle(["url", "/s?word=abc&pn=10&rn=20"], (result) => {
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

  it("Series factory ESTemplate", () => {
    const series = factory({
      index: "`K${$[1]}`",
      next: "gather",
      partten: "/(\\w+)=(\\w+)/g",
      require: "series",
      value: "`${$[1]+$[2]}`",
    });
    const param: {[index: string]: string} = {};
    let times = 0;
    series.handle(["url", "/s?word=abc&pn=10&rn=20"], (result) => {
      if (result) {
        param[result[0]] = result[1];
        console.log(result);
        times++;
      }
    });
    expect(times).to.be.eq(3);
    expect(param.Kword).to.be.eq("wordabc");
    expect(param.Kpn).to.be.eq("pn10");
    expect(param.Krn).to.be.eq("rn20");
  });

  it("Series New", () => {
    const series = new Series({
      index: "ERR",
      partten: "/(\\w+)=(\\w+)/g",
      spartten: "/(\\w+)=(\\w+)/",
      value: "ERR",
    });
    series.next(new Gather());
    const param: {[index: string]: string} = {};
    let times = 0;
    series.handle(["url", "word=abc pn=10 rn=20"], (result) => {
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

  it("Series with spartten", () => {
    const series = new Series({
      index: "ERR",
      partten: "/(\\w+)=(\\w+)/g",
      spartten: /(\w+)=(\w+)/,
      value: "ERR",
    });
    series.next(new Gather());
    let times = 0;
    series.handle(["url", "word=abc pn=10 rn=20"], (result) => {
      if (result) {
        times++;
      }
    });
    expect(times).to.be.eq(3);
  });

  it("Series Err spartten string", () => {
    const series = new Series({
      index: "ERR",
      partten: "/(\\w+)=(\\w+)/g",
      spartten: "/(\\w+):(\\w+)/",
      value: "ERR",
    });
    series.next(new Gather());
    let times = 0;
    series.handle(["url", "word=abc pn=10 rn=20"], (result) => {
      if (result) {
        times++;
      }
    });
    expect(times).to.be.eq(0);
  });

  it("Series Err spartten string", () => {
    const series = new Series({
      index: "ERR",
      partten: "/(\\w+)=(\\w+)/g",
      spartten: "ERR",
      value: "ERR",
    });
    series.next(new Gather());
    let times = 0;
    series.handle(["url", "word=abc pn=10 rn=20"], (result) => {
      if (result) {
        times++;
      }
    });
    expect(times).to.be.eq(0);
  });

});
