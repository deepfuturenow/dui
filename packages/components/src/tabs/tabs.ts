import { css } from "lit";
import { DuiTabsPrimitive } from "@dui/primitives/tabs";
import "../_install.ts";

const styles = css``;

export class DuiTabs extends DuiTabsPrimitive {
  static override styles = [...DuiTabsPrimitive.styles, styles];
}

customElements.define(DuiTabs.tagName, DuiTabs);
