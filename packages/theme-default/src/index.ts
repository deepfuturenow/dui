import type { DuiTheme } from "@dui/core/apply-theme";
import { themedBase } from "./base.ts";
import { accordionStyles } from "./components/accordion.ts";
import { accordionItemStyles } from "./components/accordion-item.ts";
import { buttonStyles } from "./components/button.ts";
import { switchStyles } from "./components/switch.ts";
import { badgeStyles } from "./components/badge.ts";
import { scrollAreaStyles } from "./components/scroll-area.ts";
import { comboboxStyles } from "./components/combobox.ts";
import { menuStyles } from "./components/menu.ts";
import { menuItemStyles } from "./components/menu-item.ts";
import { popoverStyles } from "./components/popover.ts";
import { popoverPopupStyles } from "./components/popover-popup.ts";
import { tooltipStyles } from "./components/tooltip.ts";
import { tooltipPopupStyles } from "./components/tooltip-popup.ts";
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
    ["dui-menu", menuStyles],
    ["dui-menu-item", menuItemStyles],
    ["dui-popover", popoverStyles],
    ["dui-popover-popup", popoverPopupStyles],
    ["dui-tooltip", tooltipStyles],
    ["dui-tooltip-popup", tooltipPopupStyles],
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
export { menuStyles } from "./components/menu.ts";
export { menuItemStyles } from "./components/menu-item.ts";
export { popoverStyles } from "./components/popover.ts";
export { popoverPopupStyles } from "./components/popover-popup.ts";
export { tooltipStyles } from "./components/tooltip.ts";
export { tooltipPopupStyles } from "./components/tooltip-popup.ts";
