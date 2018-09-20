/*
 * @Author: qiansc
 * @Date: 2018-09-18 22:29:54
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-21 00:16:02
 */
import {expect} from "chai";
import {Deformat, Gather, MiddlewareFactory as factory} from "../src/index";

describe("Divider.Deformat Test", () => {

  it ("Divider.Deformat", () => {
    const combined = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"`;
    const log = `192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"`;
    const deformat = new Deformat({
      combined,
    });
    deformat.nextEach(new Gather());
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
