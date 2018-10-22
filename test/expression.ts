/*
 * @Author: qiansc
 * @Date: 2018-09-30 11:23:21
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-11 17:19:31
 */
import {expect} from "chai";
import expression from "../src/util/expression";

describe("Expression Test", () => {
  it("`123` => 123", () => {
    const exp = expression("`123`");
    expect(exp()).to.be.eq("123");
  });

  it("`123${$}` => 123", () => {
    const exp = expression("`123${$}`");
    expect(exp("77")).to.be.eq("12377");
  });

  it("`${123 + $}` => 200", () => {
    const exp = expression("`${123  + $}`");
    expect(exp(77)).to.be.eq("200");
  });

  it("`N${123 + $2 + $3}` => 200", () => {
    const exp = expression("`N${123  + $2 + $3}`", 5);
    expect(exp(0, 1, 2, 3, 4)).to.be.eq("N128");
  });

  it("null expression" , () => {
    const exp = expression(undefined, 5);
    expect(exp(0, 1, 2, 3, 4)).to.be.eq("0");
  });

});
