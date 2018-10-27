/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-25 20:43:51
 */
import {Condition, Copy, Deformat, Json, Modify, Regexp, Reverse, Split} from "./index";
import {Gather, MiddlewareConfig, Noop} from "./index";
import * as M from "./index";

/**
 * The factory method can accept MiddlewareConfig and return the generated middleware instance.
 * MiddlewareFactory will automatically infer the type of the instance and return based on config
 *
 * Dmr-middleware的工厂方法可以接受MiddlewareConfig, 并返回生成的middleware实例
 * MiddlewareFactory会根据config自动推断实例的类型并返回.
 *
 * @example
 * const split =  MiddlewareFactory({_: "Split", separater: ",", next: "Gather"});
 * split.handle("A,B,C,D", (result) => {console.log(result); });
 */
export function MiddlewareFactory<T extends MiddlewareConfig, S = ClassMaps[T["_"]]>(config: T): S {
  const option = configToOption(config);
  const middleware = new (M[config._] as any)(option) as S;
  return middleware as S;
}

/**
 * @hidden and @ignore
 * Type map of all middlewares
 */
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
  Split: Split;
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
