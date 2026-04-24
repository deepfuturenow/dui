import { css } from "lit";
import { DuiCardPrimitive } from "@dui/primitives/card";
import "../_install.ts";

const styles = css`
  /* ---------------------------------------------------------------
   * Size tokens
   * --------------------------------------------------------------- */

  :host {
    --card-gap: var(--space-5);
    --card-px: var(--space-5);
    --card-py-top: var(--space-6);
    --card-py-bottom: var(--space-5);
    --card-action-offset-top: calc(-1 * var(--space-2_5));
    --card-action-offset-end: calc(-1 * var(--space-1));
  }

  :host([size="sm"]) {
    --card-gap: var(--space-4);
    --card-px: var(--space-4);
    --card-py-top: var(--space-4);
    --card-py-bottom: var(--space-4);
  }

  /* ---------------------------------------------------------------
   * Root
   * --------------------------------------------------------------- */

  [part="root"] {
    gap: var(--card-gap);
    padding: 0;
    border-radius: var(--radius-lg);
    background: var(--surface-1);
    color: var(--text-1);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    border: var(--border-width-thin) solid var(--border);
  }

  /* ---------------------------------------------------------------
   * Header
   * --------------------------------------------------------------- */

  [part="header"] {
    padding: var(--space-6) var(--card-px) var(--space-2);
    gap: var(--space-2);
  }

  [part="action"] {
    margin-top: var(--card-action-offset-top);
    margin-right: var(--card-action-offset-end);
  }

  [part="header-text"] {
    gap: var(--space-3);
  }

  ::slotted([slot="title"]) {
    text-wrap: balance;
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-snug);
    text-box: trim-both cap alphabetic;
  }

  ::slotted([slot="description"]) {
    text-wrap: pretty;
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    color: var(--text-2);
    text-box: trim-both cap alphabetic;
  }

  /* ---------------------------------------------------------------
   * Content
   * --------------------------------------------------------------- */

  [part="content"] {
    padding: 0 var(--card-px);
  }

  /* ---------------------------------------------------------------
   * Footer
   * --------------------------------------------------------------- */

  [part="footer"] {
    padding: 0 var(--card-px) var(--card-py-bottom);
    gap: var(--space-2);
    justify-content: flex-end;
  }
`;

export class DuiCard extends DuiCardPrimitive {
  static override styles = [...DuiCardPrimitive.styles, styles];
}

customElements.define(DuiCard.tagName, DuiCard);
