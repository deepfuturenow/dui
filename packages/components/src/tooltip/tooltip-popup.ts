import { css } from "lit";
import { DuiTooltipPopupPrimitive } from "@dui/primitives/tooltip";
import "../_install.ts";

const styles = css`
  .Popup {
    padding: var(--space-2) var(--space-2);
    border-radius: var(--radius-sm);
    background: color-mix(
      in oklch,
      var(--foreground) 90%,
      oklch(0 0 0 / 0)
    );
    backdrop-filter: var(--filter-blur-sm);
    color: var(--background);
    font-family: var(--font-sans);
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
    text-box: trim-both cap alphabetic;
    box-shadow: var(--shadow-sm);
    max-width: var(--space-80);
    transition-duration: var(--duration-fastest);
    transition-timing-function: var(--ease-out-3);
  }

  .Arrow .arrow-fill {
    fill: color-mix(in oklch, var(--foreground) 90%, oklch(0 0 0 / 0));
  }

  .Arrow .arrow-stroke {
    fill: none;
    stroke: none;
  }
`;

export class DuiTooltipPopup extends DuiTooltipPopupPrimitive {
  static override styles = [...DuiTooltipPopupPrimitive.styles, styles];
}

customElements.define(DuiTooltipPopup.tagName, DuiTooltipPopup);
