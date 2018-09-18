/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-18 21:52:01
 */
import {Copy, Deformat, Split} from "./index";
import {Gather, Middleware, Noop, Result} from "./index";
import {CopyOptions, DeformatOptions, MiddlewareOptions, SplitOptions} from "./index";
import {GatherCallback} from "./index";

export function MiddlewareFactory(options:
  MiddlewareOptions |
  DeformatOptions   |
  CopyOptions |
  SplitOptions): Middleware {

  switch (options.require) {
    case "copy":
      return new Copy(options as CopyOptions);
    case "deformat":
      return new Deformat(options as DeformatOptions);
    case "gather":
      return new Gather(options);
    case "split":
      return new Split(options as SplitOptions);
  }

  return new Noop(options);
}
