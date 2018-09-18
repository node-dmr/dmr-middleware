/*
 * @Author: qiansc
 * @Date: 2018-09-18 11:18:27
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 11:27:50
 */
import {expect} from "chai";
import {Gather} from "../src/index";
import {GatherCallback, Middleware, Result} from "../src/index";

describe("Abstrct Class Test", () => {
  it("Middleware", () => {
    class M extends Middleware {
      protected _handle(result: Result, gather: GatherCallback) {
        gather(result);
      }
    }
    const m = new M();
    let gathered = false;
    m.handle(["key", "value"], (result) => {
      if (result) {
        expect(result[0]).to.be.eq("key");
        expect(result[1]).to.be.eq("value");
      }
      gathered = true;
    });
    expect(gathered).to.be.eq(true);
  });

});

describe("Gather Test", () => {
  it("Middleware", () => {
    const gather = new Gather();
    return new Promise((resolve, reject) => {
      gather.handle(["a", "b"], (result) => {
        if (result) {
          expect(result[0]).to.be.eq("a");
          expect(result[1]).to.be.eq("b");
          resolve();
        } else {
          reject();
        }
      });
    });
  });
});
