export { base } from "./base.ts";
export {
  getRootDocument,
  getComposedFocusableElements,
  queryComposedTree,
  queryComposedAutofocus,
} from "./dom.ts";
export type { GetRootDocumentOptions } from "./dom.ts";
export { customEvent } from "./event.ts";
export { applyTheme, getActiveTheme } from "./apply-theme.ts";
export type { DuiTheme, ApplyThemeOptions } from "./apply-theme.ts";
export { notifyPopupOpening, notifyPopupClosing } from "./popup-coordinator.ts";
export {
  waitForAnimationFrame,
  onTransitionEnd,
  renderArrow,
  computeFixedPosition,
  startFixedAutoUpdate,
} from "./floating-popup-utils.ts";
export type {
  AlignInnerOptions,
  FloatingPopupSide,
  ComputeFixedPositionOptions,
} from "./floating-popup-utils.ts";
export { FloatingPortalController } from "./floating-portal-controller.ts";
export type { FloatingPortalControllerOptions } from "./floating-portal-controller.ts";
export type { StackGap } from "./layout-types.ts";
