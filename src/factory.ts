/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 10:34:17
 */
import {Copy, Deformat} from "./index";
import {Gather, Middleware, Noop, Result} from "./index";
import {CopyOptions, DeformatOptions, GatherCallback, MiddlewareOptions} from "./index";

export function MiddlewareFactory(options:
  MiddlewareOptions |
  DeformatOptions   |
  CopyOptions): Middleware {

  switch (options.require) {
    case "copy":
      return new Copy(options as CopyOptions);
    case "deformat":
      return new Deformat(options as DeformatOptions);
    case "gather":
      return new Gather(options);
  }

  return new Noop(options);
}
