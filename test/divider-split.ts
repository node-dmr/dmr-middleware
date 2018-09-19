/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:31:04
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 22:33:24
 */
import {expect} from "chai";
import {MiddlewareFactory as factory, Split} from "../src/index";

describe("Divider.Split Test : Should gather C && A", () => {

  it ("Divider.Split", () => {
    const spliter = new Split({
      nextIndex: {
        2: {
          require: "gather",
        },
        3: {
          require: "noop",
        },
      },
      nextList: [{
        require: "gather",
      }],
      separater: "|",
    });
    // should gather 66 && Undefined && 88
    let sum = 0;
    spliter.handle(["key", "88|77|66|55"], (result) => {
      console.log("split gather", result);
      if (result) {
        sum += parseInt(result[1], 10);
      }
    });
    expect(sum).to.be.eq(66 + 88);
  });

  it ("Divider.Split Factory", () => {
    const spliter = factory({
      nextEach: {
        require: "gather",
      },
      require: "split",
      separater: ",",
    });
    let sum = 0;
    let times = 0;
    spliter.handle(["key", "999,12,77"], (result) => {
      if (result) {
        sum += parseInt(result[1], 10);
        times ++;
      }
    });
    expect(sum).to.be.eq(999 + 12 + 77);
    expect(times).to.be.eq(3);
  });
});
