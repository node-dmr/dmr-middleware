/*
 * @Author: qiansc
 * @Date: 2018-10-25 19:48:11
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-26 07:59:30
 */

import {
  ConditionOption, CopyOption, DeformatOption, FilterOption,
  JsonOption, ModifyOption, RegexpOption, SplitOption} from "./index";

interface ConditionConfig extends ConditionOption {
  _: "Condition";
}
interface CopyConfig extends CopyOption {
  _: "Copy";
}
interface DeformatConfig extends DeformatOption {
  _: "Deformat";
}
interface GatherConfig {
  _: "Gather";
}
interface JsonConfig extends JsonOption {
  _: "Json";
}
interface ModifyConfig extends ModifyOption {
  _: "Modify";
}
interface NoopConfig {
  _: "Noop";
}
interface RegexpConfig extends RegexpOption {
  _: "Regexp";
}
interface ReverseConfig extends FilterOption {
  _: "Reverse";
}
interface SplitConfig extends SplitOption {
  _: "Split";
}

/**
 * A set of Config types that can be nested in the next(and others) method in Config
 *
 * 可以在Config中的next类方法中嵌套使用的Config类型集合
 */
export type MiddlewareConfig = ConditionConfig
| CopyConfig
| DeformatConfig
| GatherConfig
| JsonConfig
| ModifyConfig
| NoopConfig
| RegexpConfig
| ReverseConfig
| SplitConfig
;
/**
 * A set of Finisher types that can be use in the next method in Config
 *
 * 可以在Config中的next方法中嵌套使用的Config类型集合
 */
export type FinisherLike = "Gather" | "Noop";
