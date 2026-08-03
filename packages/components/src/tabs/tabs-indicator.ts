import { css } from "lit";
import { DuiTabsIndicatorPrimitive } from "@dui/primitives/tabs";
import "../_install.ts";

const styles = css`
  :host {
    --tabs-indicator-bg: oklch(from var(--foreground) l c h / 0.08);
    --tabs-indicator-duration: var(--duration-normal);
    --tabs-indicator-easing: var(--ease-in-out-3);

    height: 100%;
    /* md default; <dui-tabs size="xs"> tightens this via the inheritable var.
     * Consumed with a fallback (not declared on :host) so the size cascade
     * from the container isn't shadowed. */
    border-radius: var(--tabs-indicator-radius, var(--radius-md));
    background: var(--tabs-indicator-bg);
    transition-duration: var(--tabs-indicator-duration);
    transition-timing-function: var(--tabs-indicator-easing);
  }
`;

export class DuiTabsIndicator extends DuiTabsIndicatorPrimitive {
  static override styles = [...DuiTabsIndicatorPrimitive.styles, styles];
}

customElements.define(DuiTabsIndicator.tagName, DuiTabsIndicator);
