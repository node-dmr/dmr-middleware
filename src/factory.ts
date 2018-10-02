/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-02 08:19:14
 */
import {Condition, Copy, Deformat, Filter, Json, Modify, Regexp, Reverse, Series, Split} from "./index";
import {Divider, Gather, Middleware, Noop} from "./index";
import {ConditionOptions, CopyOptions, DeformatOptions, MiddlewareOptions, ModifyOptions,
  RegexpOptions, SeriesOptions, SplitOptions} from "./index";

export interface MiddlewareConfig extends MiddlewareOptions {
  require: string;
  next?: MiddlewareConfig | string;
  nextEach?: MiddlewareConfig;
  nextList?: MiddlewareConfig[];
  nextIndex?: Array<[string, MiddlewareConfig]> | {[key: string]: MiddlewareConfig};
}
const MiddlewareConfigIndexs = ["require", "next", "nextEach", "nextList", "nextIndex"];

export function MiddlewareFactory(config: MiddlewareConfig): Middleware {
  const options: MiddlewareOptions = configToOption(config);
  let middleware: Middleware;
  switch (config.require) {
    case "condition":
      middleware = new Condition(options as ConditionOptions); break;
    case "copy":
      middleware = new Copy(options as CopyOptions); break;
    case "deformat":
      middleware = new Deformat(options as DeformatOptions); break;
    case "gather":
      middleware = new Gather(options); break;
    case "json":
      middleware = new Json(options); break;
    case "modify":
      middleware = new Modify(options as ModifyOptions); break;
    case "regexp":
      middleware = new Regexp(options as RegexpOptions); break;
    case "reverse":
      middleware = new Reverse(options); break;
    case "series":
      middleware = new Series(options as SeriesOptions); break;
    case "split":
      middleware = new Split(options as SplitOptions); break;
    default:
      middleware = new Noop(config);
  }

  if (middleware instanceof Divider) {
    if (config.nextIndex) {
      const nexts = config.nextIndex;
      const action = {};
      Object.keys(nexts).forEach((index) => {
        // if (nexts.hasOwnProperty(index)) {
          action[index] =  MiddlewareFactory(nexts[index]);
        // }
      });
      middleware.nextIndex(action);
    }

    if (config.nextEach) {
      middleware.nextEach(MiddlewareFactory(config.nextEach));
    }

    if (config.nextList) {
      const middlewares: Middleware[] = [];
      for (const conf of config.nextList) {
        middlewares.push(MiddlewareFactory(conf));
      }
      middleware.nextList(middlewares);
    }

    if (config.next) {
      if (typeof config.next === "string") {
        middleware.next(MiddlewareFactory({require: config.next as string}));
      } else {
        middleware.next(MiddlewareFactory(config.next as MiddlewareConfig));
      }
    }

    if (config.before) {
      middleware.before(MiddlewareFactory(config.before) as Filter);
    }

    if (config.after) {
      middleware.after(MiddlewareFactory(config.after) as Filter);
    }
  }
  return middleware;
}

function configToOption(config: MiddlewareConfig): MiddlewareOptions {
  const options: MiddlewareOptions = {};
  for (const index in config) {
    if (MiddlewareConfigIndexs.indexOf(index) > -1) {
      // do nothing
    } else {
      options[index] = config[index];
    }
  }
  return options;
}
