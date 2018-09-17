/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 00:32:38
 */
import {Copy, Middleware, Noop, Result} from "./index";
import {CopyOptions, GatherCallback, MiddlewareOptions} from "./index";

export default function(options: MiddlewareOptions): Middleware {
  switch (options.require) {
    case "copy":
      return new Copy(options as CopyOptions);
  }
  return new Noop();
}
