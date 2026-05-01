import "./toast-region.ts";
import "./toast.ts";
import "./toast-action.ts";
import "./toast-close.ts";
import { toast } from "@dui/primitives/toast";

export { DuiToastRegion } from "./toast-region.ts";
export { DuiToast } from "./toast.ts";
export { DuiToastAction } from "./toast-action.ts";
export { DuiToastClose } from "./toast-close.ts";
export { toast };

export type {
  PromiseMessages,
  ToastAction,
  ToastApi,
  ToastConfig,
  ToastDismissDetail,
  ToastDismissReason,
  ToastItemContext,
  ToastOpenChangeDetail,
  ToastOptions,
  ToastPosition,
  ToastPriority,
  ToastRegionContext,
  ToastType,
} from "@dui/primitives/toast";

export {
  toastDismissEvent,
  toastOpenChangeEvent,
  toastRegionDismissEvent,
} from "@dui/primitives/toast";
