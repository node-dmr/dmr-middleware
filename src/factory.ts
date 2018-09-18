/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 10:34:17
 */
import {Copy, Middleware, Noop, Result} from "./index";
import {CopyOptions, GatherCallback, MiddlewareOptions} from "./index";

export function MiddlewareFactory(options: MiddlewareOptions | CopyOptions): Middleware {
  switch (options.require) {
    case "copy":
      return new Copy(options as CopyOptions);
  }
  return new Noop(options);
}
