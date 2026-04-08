import { css } from "lit";

export const badgeStyles = css`
  /* =================================================================
   * Two-axis variant system:
   *   variant    → semantic intent (neutral, primary, danger, …, info)
   *   appearance → visual treatment (filled, outline, ghost)
   * ================================================================= */

  /* ---------------------------------------------------------------
   * Layer 1 — Intent (sets --_intent-* private tokens)
   * --------------------------------------------------------------- */

  :host,
  :host([variant=""]),
  :host([variant="neutral"]) {
    --_intent-base: var(--neutral);
    --_intent-base-fg: var(--neutral-foreground);
    --_intent-subtle: var(--neutral-subtle);
    --_intent-subtle-fg: var(--neutral-subtle-foreground);
  }

  :host([variant="primary"]) {
    --_intent-base: var(--primary);
    --_intent-base-fg: var(--primary-foreground);
    --_intent-subtle: var(--primary-subtle);
    --_intent-subtle-fg: var(--primary-subtle-foreground);
  }

  :host([variant="danger"]) {
    --_intent-base: var(--danger);
    --_intent-base-fg: var(--danger-foreground);
    --_intent-subtle: var(--danger-subtle);
    --_intent-subtle-fg: var(--danger-subtle-foreground);
  }

  :host([variant="success"]) {
    --_intent-base: var(--success);
    --_intent-base-fg: var(--success-foreground);
    --_intent-subtle: var(--success-subtle);
    --_intent-subtle-fg: var(--success-subtle-foreground);
  }

  :host([variant="warning"]) {
    --_intent-base: var(--warning);
    --_intent-base-fg: var(--warning-foreground);
    --_intent-subtle: var(--warning-subtle);
    --_intent-subtle-fg: var(--warning-subtle-foreground);
  }

  :host([variant="info"]) {
    --_intent-base: var(--info);
    --_intent-base-fg: var(--info-foreground);
    --_intent-subtle: var(--info-subtle);
    --_intent-subtle-fg: var(--info-subtle-foreground);
  }

  /* ---------------------------------------------------------------
   * Layer 2 — Appearance (maps --_intent-* to --badge-*)
   * --------------------------------------------------------------- */

  :host,
  :host([appearance=""]),
  :host([appearance="filled"]) {
    --badge-bg: var(--_intent-base);
    --badge-fg: var(--_intent-base-fg);
    --badge-border: transparent;
  }

  :host([appearance="outline"]) {
    --badge-bg: transparent;
    --badge-fg: var(--_intent-base);
    --badge-border: var(--_intent-base);
  }

  :host([appearance="ghost"]) {
    --badge-bg: var(--_intent-subtle);
    --badge-fg: var(--_intent-subtle-fg);
    --badge-border: transparent;
  }

  /* ---------------------------------------------------------------
   * Sizing & base appearance
   * --------------------------------------------------------------- */

  :host {
    --badge-icon-size: var(--space-3);
    --icon-size: var(--badge-icon-size);
    --icon-color: var(--badge-fg);
  }

  [part="root"] {
    gap: var(--space-1);
    height: var(--space-5);
    padding: 0 var(--space-2);
    border-radius: var(--radius-full);
    background: var(--badge-bg);
    color: var(--badge-fg);
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-normal);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-snug);
    white-space: nowrap;
    border: var(--border-width-thin) solid var(--badge-border);
  }
`;
