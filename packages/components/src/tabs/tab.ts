import { css } from "lit";
import { DuiTabPrimitive } from "@dui/primitives/tabs";
import "../_install.ts";

const styles = css`
  [part="tab"] {
    color: var(--text-2);
    font-size: var(--text-sm); line-height: var(--line-height-snug);
    font-weight: var(--font-weight-medium);
    text-box: trim-both cap alphabetic;
    padding-inline: var(--space-2);
    height: var(--component-height-md);
    transition-property: color, box-shadow, background, filter, transform;
    transition-duration: var(--duration-fast);
  }

  [part="tab"][data-active] {
    color: var(--text-1);
  }

  @media (hover: hover) {
    [part="tab"]:hover:not([data-disabled]) {
      color: var(--text-1);
    }
  }

  [part="tab"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    border-radius: var(--radius-sm);
    z-index: 1;
  }

  [part="tab"][data-disabled] {
    opacity: 0.4;
  }
`;

export class DuiTab extends DuiTabPrimitive {
  static override styles = [...DuiTabPrimitive.styles, styles];
}

customElements.define(DuiTab.tagName, DuiTab);
