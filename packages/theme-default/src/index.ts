import type { DuiTheme } from "@dui/core/apply-theme";
import { themedBase } from "./base.ts";
import { accordionStyles } from "./components/accordion.ts";
import { accordionItemStyles } from "./components/accordion-item.ts";
import { buttonStyles } from "./components/button.ts";
import { switchStyles } from "./components/switch.ts";
import { badgeStyles } from "./components/badge.ts";
import { scrollAreaStyles } from "./components/scroll-area.ts";
import { comboboxStyles } from "./components/combobox.ts";
import { tokenSheet } from "./tokens.ts";

export const defaultTheme: DuiTheme = {
  tokens: tokenSheet,
  base: themedBase,
  styles: new Map([
    ["dui-accordion", accordionStyles],
    ["dui-accordion-item", accordionItemStyles],
    ["dui-button", buttonStyles],
    ["dui-switch", switchStyles],
    ["dui-badge", badgeStyles],
    ["dui-scroll-area", scrollAreaStyles],
    ["dui-combobox", comboboxStyles],
  ]),
};

export { themedBase } from "./base.ts";
export { accordionStyles } from "./components/accordion.ts";
export { accordionItemStyles } from "./components/accordion-item.ts";
export { buttonStyles } from "./components/button.ts";
export { switchStyles } from "./components/switch.ts";
export { badgeStyles } from "./components/badge.ts";
export { scrollAreaStyles } from "./components/scroll-area.ts";
export { comboboxStyles } from "./components/combobox.ts";
