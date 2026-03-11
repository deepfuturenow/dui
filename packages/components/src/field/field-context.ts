import { createContext } from "@lit/context";

export type FieldContext = {
  readonly fieldId: string;
  readonly labelId: string;
  readonly controlId: string;
  readonly descriptionId: string;
  readonly errorId: string;
  readonly disabled: boolean;
  readonly invalid: boolean;
  readonly dirty: boolean;
  readonly touched: boolean;
  readonly filled: boolean;
  readonly focused: boolean;
  readonly markTouched: () => void;
  readonly markDirty: () => void;
  readonly setFocused: (focused: boolean) => void;
  readonly setFilled: (filled: boolean) => void;
};

export const fieldContext = createContext<FieldContext>(Symbol("dui-field"));
