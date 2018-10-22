/*
 * @Author: qiansc
 * @Date: 2018-09-16 21:51:07
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-22 15:05:38
 */
import {Condition, Copy, Deformat, Filter, Json, Modify, Regexp, Reverse, Series, Split} from "./index";
import {Divider, Gather, Middleware, Noop} from "./index";

export interface MiddlewareConfig {
  [index: string]: any;
  after?: MiddlewareConfig;
  before?: MiddlewareConfig;
  require: string;
  next?: MiddlewareConfig | string;
  nextEach?: MiddlewareConfig;
  nextList?: MiddlewareConfig[];
  nextIndex?: Array<[string, MiddlewareConfig]> | {[key: string]: MiddlewareConfig};
}
const MiddlewareConfigIndexs = ["require", "next", "nextEach", "nextList", "nextIndex", "before", "after"];

export function MiddlewareFactory(config: MiddlewareConfig): Middleware<any> {
  const option = configToOption(config);
  let middleware: Middleware<any>;
  switch (config.require) {
    case "condition":
      middleware = new Condition(option); break;
    case "copy":
      middleware = new Copy(option); break;
    case "deformat":
      middleware = new Deformat(option); break;
    case "gather":
      middleware = new Gather(); break;
    case "json":
      middleware = new Json(); break;
    case "modify":
      middleware = new Modify(option); break;
    case "regexp":
      middleware = new Regexp(option); break;
    case "reverse":
      middleware = new Reverse(); break;
    case "series":
      middleware = new Series(option); break;
    case "split":
      middleware = new Split(option); break;
    default:
      middleware = new Noop();
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
      const middlewares: Array<Middleware<any>> = [];
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
      middleware.before(MiddlewareFactory(config.before) as Filter<any>);
    }

    if (config.after) {
      middleware.after(MiddlewareFactory(config.after) as Filter<any>);
    }
  }
  return middleware;
}
/**
 * @hidden and @ignore
 */
function configToOption(config: MiddlewareConfig): any {
  const option = {};
  for (const index in config) {
    if (MiddlewareConfigIndexs.indexOf(index) > -1) {
      // do nothing
    } else {
      option[index] = config[index];
    }
  }
  return option;
}
