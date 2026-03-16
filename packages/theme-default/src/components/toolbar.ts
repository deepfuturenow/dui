import { css } from "lit";

export const toolbarStyles = css`
  /* ── Root ── */

  [part="root"] {
    column-gap: var(--space-2);
  }

  :host([inset]) [part="root"] {
    padding-top: var(--space-2);
    padding-bottom: var(--space-2);
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }

  :host([inset][has-button-left]) [part="root"] {
    padding-left: var(--space-2);
  }

  :host([inset][has-button-right]) [part="root"] {
    padding-right: var(--space-2);
  }

  /* ── Size variants ── */

  :host([size="sm"]) [part="root"] {
    height: var(--component-height-sm);
  }

  :host([size="md"]) [part="root"] {
    height: var(--component-height-md);
  }

  :host([size="lg"]) [part="root"] {
    height: var(--component-height-lg);
  }

  :host([size="xl"]) [part="root"] {
    height: var(--component-height-xl);
  }

  /* ── Slot containers ── */

  [part="left"],
  [part="center"],
  [part="right"] {
    gap: var(--space-2);
  }
`;
