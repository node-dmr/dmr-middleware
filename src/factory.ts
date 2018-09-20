/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-20 16:15:46
 */
import {Copy, Deformat, Regexp, Split} from "./index";
import {Gather, Middleware, Noop} from "./index";
import {CopyOptions, DeformatOptions, DividerOptions,
  Json, MiddlewareOptions, RegexpOptions, SplitOptions} from "./index";

export function MiddlewareFactory(options:
  MiddlewareOptions |
  DeformatOptions |
  CopyOptions |
  RegexpOptions |
  SplitOptions |
  DividerOptions): Middleware {

  switch (options.require) {
    case "copy":
      return new Copy(options as CopyOptions);
    case "deformat":
      return new Deformat(options as DeformatOptions);
    case "gather":
      return new Gather(options);
    case "json":
      return new Json(options);
    case "regexp":
      return new Regexp(options as RegexpOptions);
    case "split":
      return new Split(options as SplitOptions);
  }

  return new Noop(options);
}
