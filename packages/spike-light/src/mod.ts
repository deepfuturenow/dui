/** Barrel for the Phase 0 probe package. */
import "./core/install.ts";

export { lightDom } from "./core/light-dom.ts";
export { applyProps, spread } from "./core/spread.ts";
export { type Bag, type BagValues, markBag, type Ref } from "./core/bags.ts";
export {
  Controller,
  type ControllerHost,
  type LifecycleHooks,
} from "./core/controller-host.ts";
export { attach } from "./core/lit.ts";
export {
  CompoundController,
  type PartHost,
} from "./core/compound-controller.ts";
export { type BagExpectation, DevCheck } from "./core/dev-check.ts";
