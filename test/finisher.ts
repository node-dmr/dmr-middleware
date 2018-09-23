/*
 * @Author: qiansc
 * @Date: 2018-09-17 23:00:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-23 19:30:07
 */
import {expect} from "chai";
import {Finisher, Noop, Result} from "../src/index";

describe("Abstract Finisher Test", () => {
  it("Make Twice Finisher", () => {
    class F extends Finisher {
      protected _handle(result: Result, gather) {
        super._handle(result, gather);
        gather(result);
      }
    }
    const f = new F();
    f.handle(["a", "b"], (result) => {
      if (result) {
        expect(result[0]).to.be.eq("a");
        expect(result[1]).to.be.eq("b");
      }
    });
  });
});
