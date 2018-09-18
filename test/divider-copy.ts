/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:28:55
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 22:33:23
 */
import {expect} from "chai";
import {Copy, MiddlewareFactory as factory, Noop} from "../src/index";

describe("Divider.Copy Test", () => {

  it("Copy", () => {
    const copy = new Copy({times: 2});
    const noop = new Noop();
    let times = 0;
    // 2 times
    copy.next({0: noop});
    // 2 times
    copy.nextEach(noop);
    // 2 times
    copy.nextList([noop]);
    copy.handle(["0", "value"], () => {
      console.log("gather of instance run times %s", ++times);
    });
    expect(times).to.be.eq(6);
  });

  it("Copy by Config", () => {
    const copy = factory({
      // 3 time
      next: {
        key0: {
          require: "noop",
        },
      },
      // 3 time
      nextEach: {
        require: "noop",
      },
      // 0 time cause list deal with key = 0 1 2 3 but not "key0"
      nextList: [{
        require: "noop",
      }, {
        require: "noop",
      }],
      require: "copy",
      times: 3,
    });
    let times = 0;
    copy.handle(["key0", "value"], () => {
      console.log("gather of config run times %s", ++times);
    });
    expect(times).to.be.eq(6);
  });
});
