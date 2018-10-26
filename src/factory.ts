/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-25 20:43:51
 */
import {Condition, Copy, Deformat, Filter, Json, Modify, Regexp, Reverse, Split} from "./index";
import {Divider, Gather, Middleware, MiddlewareConfig, Noop} from "./index";
import * as M from "./index";

// export interface MiddlewareConfig {
//   [index: string]: any;
//   _: keyof A;
//   after?: MiddlewareConfig;
//   before?: MiddlewareConfig;
//   next?: MiddlewareConfig | string;
//   nextEach?: MiddlewareConfig;
//   nextList?: MiddlewareConfig[];
//   nextIndex?: Array<[string, MiddlewareConfig]> | {[key: string]: MiddlewareConfig};
// }
// const MiddlewareConfigIndexs = ["_", "next", "nextEach", "nextList", "nextIndex", "before", "after"];

// interface A {
//   Condition;
//   Copy;
// }

// const a = {
//   condition: Condition,
//   copy: Copy,
// };

interface ClassMaps {
  Condition: Condition;
  Copy: Copy;
  Deformat: Deformat;
  Gather: Gather;
  Json: Json;
  Modify: Modify;
  Noop: Noop;
  Regexp: Regexp;
  Reverse: Reverse;
  // series: Series;
  Split: Split;
}

export function MiddlewareFactory<T extends MiddlewareConfig, S = ClassMaps[T["_"]]>(config: T): S {
  const option = configToOption(config);
  // let middleware: config._;
  const middleware = new (M[config._] as any)(option) as S;
  return middleware as S;
}

/**
 * @hidden and @ignore
 */
function configToOption(config: MiddlewareConfig): any {
  const option = {};
  for (const index in config) {
    if (["_"].indexOf(index) > -1) {
      // do nothing
    } else {
      option[index] = config[index];
    }
  }
  return option;
}
