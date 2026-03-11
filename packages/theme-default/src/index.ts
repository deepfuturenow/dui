import type { DuiTheme } from "@dui/core/apply-theme";
import { themedBase } from "./base.ts";
import { buttonStyles } from "./components/button.ts";
import { switchStyles } from "./components/switch.ts";
import { badgeStyles } from "./components/badge.ts";
import { tokenSheet } from "./tokens.ts";

export const defaultTheme: DuiTheme = {
  tokens: tokenSheet,
  base: themedBase,
  styles: new Map([
    ["dui-button", buttonStyles],
    ["dui-switch", switchStyles],
    ["dui-badge", badgeStyles],
  ]),
};

export { themedBase } from "./base.ts";
export { buttonStyles } from "./components/button.ts";
export { switchStyles } from "./components/switch.ts";
export { badgeStyles } from "./components/badge.ts";
