import { css } from "lit";
import { DuiTabsIndicatorPrimitive } from "@dui/primitives/tabs";
import "../_install.ts";

const styles = css`
  :host {
    --tabs-indicator-height: var(--component-height-xs);
    --tabs-indicator-radius: var(--radius-sm);
    --tabs-indicator-bg: oklch(from var(--foreground) l c h / 0.08);
    --tabs-indicator-duration: var(--duration-normal);
    --tabs-indicator-easing: var(--ease-in-out-3);

    height: var(--tabs-indicator-height);
    border-radius: var(--tabs-indicator-radius);
    background: var(--tabs-indicator-bg);
    transition-duration: var(--tabs-indicator-duration);
    transition-timing-function: var(--tabs-indicator-easing);
  }
`;

export class DuiTabsIndicator extends DuiTabsIndicatorPrimitive {
  static override styles = [...DuiTabsIndicatorPrimitive.styles, styles];
}

customElements.define(DuiTabsIndicator.tagName, DuiTabsIndicator);
