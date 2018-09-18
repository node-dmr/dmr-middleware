/*
 * @Author: qiansc
 * @Date: 2018-09-18 11:18:27
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 11:27:50
 */
import {expect} from "chai";
import {MiddlewareFactory as factory} from "../src/index";
import {Copy, Divider, Noop} from "../src/index";
import {GatherCallback, Middleware, MiddlewareOptions, Result} from "../src/index";

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
