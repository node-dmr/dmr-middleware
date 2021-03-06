/*
 * @Author: qiansc
 * @Date: 2018-09-20 16:13:50
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 15:59:49
 */
import {expect} from "chai";
import {Gather, Json, MiddlewareFactory as factory, Result} from "../src/index";

describe("Divider.JSON Test", () => {

  it ("Divider.Json easy New", () => {
    const txt = "{A: \'a\',\"B\":1,\"C\":\"20180909\"}";
    const json = new Json();

    // result.json().each().when({index: A}).;

    // fxa = divide(json).each().when(filter).modify();
    // fxb = copy(json).fx(
    //   each(1).modify(A),
    //   index(2).modify(B)
    // );
    // fxc = fxb.each(1).modify(A);
    // fxd = fxb.index(2).modify(B);

    // results = fxa(result);

    // results = fx(fxc,fxd) (result);
    // result =

    // json.done((result: Result) => {
    //   // return result.whenIndex("a");
    //   return result.modify();
    // }).fetch();

    // (result) => result[];

    json.next(Gather);
    const rs: Result[] = [];
    console.log("JSON String : ", txt);
    json.handle(txt, (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(3);
    expect(rs[0][0] + rs[0][1]).to.be.eq("Aa");
    expect(rs[1][0] + rs[1][1]).to.be.eq("B1");
    expect(rs[2][0] + rs[2][1]).to.be.eq("C20180909");
  });

  it ("Divider.Json Factory", () => {
    const txt = JSON.stringify({
      A: "HAHA",
      B: [1, "cc", "dd"],
      C: {
        1: "NO1",
        2: "NO2",
      },
    });
    const json = factory({
      _: "Json",
      nextIndex: {
          B: {
            _: "Gather",
          },
          C: {
            _: "Json",
            next: "Gather",
          },
        },
    });
    const rs: Result[] = [];
    console.log("JSON String : ", txt);
    json.handle(["json", txt], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(3);
    expect(rs[0][0] + rs[0][1]).to.be.eq("B1,cc,dd");
    expect(rs[1][0] + rs[1][1]).to.be.eq("1NO1");
    expect(rs[2][0] + rs[2][1]).to.be.eq("2NO2");
  });

  it ("Divider.Json New", () => {
    const txt = JSON.stringify({
      A: "HAHA",
      B: [1, "cc", "dd"],
      C: {
        1: "NO1",
        2: "NO2",
        3: {P: 99},
      },
    });
    const json = new Json();
    json.nextIndex({
      A: new Gather(),
      C: new Json().next(Gather),
    });
    const rs: Result[] = [];
    console.log("JSON String : ", txt);
    json.handle(["json", txt], (result) => {
      console.log(result);
      if (result) {
        rs.push(result);
      }
    });
    expect(rs.length).to.be.eq(4);
    expect(rs[0][0] + rs[0][1]).to.be.eq("AHAHA");
    expect(rs[1][0] + rs[1][1]).to.be.eq("1NO1");
    expect(rs[2][0] + rs[2][1]).to.be.eq("2NO2");
    expect(rs[3][1]).to.be.eq(JSON.stringify({P: 99}));
  });

});
