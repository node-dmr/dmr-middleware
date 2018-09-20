/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:31:04
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-21 00:02:54
 */
import {expect} from "chai";
import {Gather, MiddlewareFactory as factory, Regexp} from "../src/index";

describe("Divider.Regexp Test", () => {

  it ("Divider.Regexp Factory", () => {
    const  url = "https://github.com/node-dmr/dmr-middleware";
    const regexp = factory({
      nextEach: {
        require: "gather",
      },
      partten: "/^(?:([A-Za-z]+):)?(\\/{0,3})([0-9.\\-A-Za-z]+)(?::(\\d+))?(?:\\/([^?#]*))?(?:\\?)?(?:#(.*))?$/",
      require: "regexp",
    });
    let times = 0;
    const rs: string[] = [];
    regexp.handle(["url", url], (result) => {
      console.log(result);
      if (result) {
        times ++;
        rs.push(result[1]);
      }
    });
    expect(rs[1]).to.be.eq("https");
    expect(rs[3]).to.be.eq("github.com");
    expect(times).to.be.eq(7);
  });

  it ("Divider.Regexp Class", () => {
    const  url = "https://github.com/node-dmr/dmr-middleware";
    const regexp = new Regexp({
      partten:
      /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?)?(?:#(.*))?$/,
    });
    regexp.nextIndex({
      1: new Gather(),
      3: new Gather(),
    });

    let times = 0;
    const rs: string[] = [];
    regexp.handle(["url", url], (result) => {
      console.log(result);
      if (result) {
        times ++;
        rs.push(result[1]);
      }
    });
    expect(rs[0]).to.be.eq("https");
    expect(rs[1]).to.be.eq("github.com");
    expect(times).to.be.eq(2);
  });

  it ("Divider.Regexp Not Matched", () => {
    const  url = "git://aaa.com";
    const regexp = new Regexp({
      partten: /^http:\/\/(.*)%/,
    });
    regexp.nextEach(new Gather());

    let times = 0;
    regexp.handle(["url", url], (result) => {
      console.log(result);
      if (result) {
        times ++;
      }
    });
    expect(times).to.be.eq(0);
  });

  it ("Divider.Regexp Wrong Regexp", () => {
    const  url = "git://aaa.com";
    const regexp = new Regexp({
      partten: "/ssss??",
    });
    regexp.nextEach(new Gather());

    let times = 0;
    regexp.handle(["url", url], (result) => {
      console.log(result);
      if (result) {
        times ++;
      }
    });
    expect(times).to.be.eq(0);
  });
});
