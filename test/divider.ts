/*
 * @Author: qiansc
 * @Date: 2018-09-17 23:00:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 01:28:26
 */
import {expect} from "chai";
import {Copy, GatherCallback, Middleware, MiddlewareOptions, Result} from "../src/index";

describe("Divider Test", () => {
  it("Copy", () => {
    const copy = new Copy({times: 2});
    const con = new Con();
    let times = 0;
    copy.next({key: con});
    copy.nextEach(con);
    copy.handle(["key", "value"], () => {
      console.log("gather times %s", ++times);
    });
    expect(times).to.be.eq(4);
  });
});

class Con extends Middleware {
  constructor(options: MiddlewareOptions = {}) {
    super(options);
  }
  public _handle(result: Result, gather: GatherCallback) {
    console.log("Enter Con handle result => ", result);
    gather(result);
  }
}
