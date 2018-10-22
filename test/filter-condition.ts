/*
 * @Author: qiansc
 * @Date: 2018-09-30 11:23:21
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-05 17:37:02
 */
import {expect} from "chai";
import {Condition, MiddlewareFactory as factory, Result, Series} from "../src";

describe("Filter Condition", () => {
  it("Condition White True", () => {
    const c = new Condition({
      expr: "true",
    });
    const rs: Result [] = [];
    c.handle(["count", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(1);
  });

  it("Condition White Expr === 119", () => {
    const c = new Condition({
      expr: "`${$ * 1 === 119}`",
      type: "white",
    });
    const rs: Result [] = [];
    c.handle(["count", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(1);
    expect(rs[0][0]).to.be.eq("count");
    expect(rs[0][1]).to.be.eq("119");
  });

  it("Condition White Expr Factory === 200", () => {
    const c = factory({
      expr: "`${$ * 1 === 200}`",
      require: "condition",
    });
    const rs: Result [] = [];
    c.handle(["count", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(0);
  });

  it("Condition Black Expr === 119", () => {
    const c = factory({
      expr: "`${$ * 1 === 119}`",
      require: "condition",
      type: "black",
    });
    const rs: Result [] = [];
    c.handle(["count", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(0);
  });

  it("Condition Black Expr Key === count", () => {
    const c = new Condition({
      expr: "`${$1 !== 'count'}`",
      type: "black",
    });
    const rs: Result [] = [];
    c.handle(["count", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(1);
    c.handle(["name", "kitty"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(1);
  });

  it("Condition Error: None Expr", () => {
    const c = factory({
      require: "condition",
    });
    const rs: Result [] = [];
    c.handle(["count", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(0);
  });

  it("Condition _ Test", () => {
    const c = factory({
      expr: "`${_.indexOf(['sum', 'count', 'avg'], $1) > -1}`",
      require: "condition",
    });
    const rs: Result [] = [];
    c.handle(["count", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    c.handle(["avg", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    c.handle(["speed", "119"], (result) => {
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(2);
    expect(rs[0][0]).to.be.eq("count");
    expect(rs[1][0]).to.be.eq("avg");
  });
});
