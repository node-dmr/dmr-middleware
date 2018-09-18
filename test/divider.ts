/*
 * @Author: qiansc
 * @Date: 2018-09-17 23:00:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 11:20:50
 */
import {expect} from "chai";
import {MiddlewareFactory as factory} from "../src/index";
import {Copy, Divider, Noop} from "../src/index";
import {GatherCallback, Middleware, MiddlewareOptions, Result} from "../src/index";

describe("Divider Test", () => {
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

  it("Abstract Divider Test", () => {
    class Twice extends Divider {
      protected divide(result: Result): Result[] {
        return [result, result];
      }
    }
    const twice = new Twice();
    let times = 0;
    twice.next({
      a: new Noop(),
    });
    twice.handle(["a", "b"], () => {
      console.log("gather of abstract twice %s", ++ times);
    });
    expect(times).to.be.eq(2);
  });

});
