/*
 * @Author: qiansc
 * @Date: 2018-09-17 23:00:31
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 21:57:44
 */
import {expect} from "chai";
import {MiddlewareFactory as factory} from "../src/index";
import {Copy, Deformat, Divider, Noop, Split} from "../src/index";
import {GatherCallback, Middleware, MiddlewareOptions, Result} from "../src/index";

describe("Abstract Divider Test", () => {
  it("Make Twice Divider", () => {
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

describe("Divider.Deformat Test", () => {

  it ("Divider.Deformat", () => {
    const combined = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"`;
    const log = `192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"`;
    const deformat = new Deformat({
      combined,
      nextEach: {
        require: "gather",
      },
    });
    let times = 0;
    deformat.handle(["log", log], (result) => {
      console.log(result);
      if (result && result[0] && result[1]) {
        times ++;
      }
    });
    expect(times).to.be.eq(combined.split("$").length - 1);
  });

  it ("Divider.Deformat Null", () => {
    const combined = "A$sssB";
    const log = `192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"`;
    const deformat = factory({
      combined,
      nextEach: {
        require: "gather",
      },
      require: "deformat",
    });
    let times = 0;
    deformat.handle(["log", log], (result) => {
      console.log(result);
      if (result && result[0] && result[1]) {
        times ++;
      }
    });
    expect(times).to.be.eq(0);
  });
});

describe("Divider.Split Test : Should gather C && A", () => {

  it ("Divider.Split", () => {
    const spliter = new Split({
      next: {
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
