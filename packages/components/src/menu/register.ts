import { DuiMenu } from "./menu.ts";
import { DuiMenuItem } from "./menu-item.ts";

if (!customElements.get(DuiMenu.tagName)) {
  customElements.define(DuiMenu.tagName, DuiMenu);
}

if (!customElements.get(DuiMenuItem.tagName)) {
  customElements.define(DuiMenuItem.tagName, DuiMenuItem);
}
