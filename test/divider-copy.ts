/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:28:55
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-21 00:26:07
 */
import {expect} from "chai";
import {Copy, Gather, MiddlewareFactory as factory, Noop} from "../src/index";

describe("Divider.Copy Test", () => {

  it("Copy", () => {
    const copy = new Copy({times: 2});
    const noop = new Noop();
    let times = 0;
    // 2 times
    copy.nextIndex({0: noop});
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
      nextEach: {
        require: "noop",
      },
      // 3 time
      nextIndex: {
        key0: {
          require: "noop",
        },
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

  it("Copy && Gather 2", () => {
    const copy = factory({
      next: {
        require: "gather",
      },
      require: "copy",
      times: 2,
    });
    let times = 0;
    copy.handle(["key", "value"], () => {
      console.log("copy & gather run times %s", ++times);
    });
    expect(times).to.be.eq(2);
  });

  // it("Copy && Gather 3", () => {
  //   const copy = new Copy({times: 3});
  //   copy.next(Gather);
  //   copy.next(Noop);
  //   copy.next(Gather);
  //   let times = 0;
  //   copy.handle(["key", "value"], (result) => {
  //     if (result) {
  //       console.log("copy & gather run times %s", ++times);
  //     }
  //   });
  //   expect(times).to.be.eq(6);
  // });

});
