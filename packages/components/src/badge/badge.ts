import { css } from "lit";
import { DuiBadgePrimitive } from "@dui/primitives/badge";
import "../_install.ts";

const styles = css`
  /* =================================================================
   * Two-axis variant system:
   *   variant    → semantic intent (neutral, accent, danger)
   *   appearance → visual treatment (filled, outline, ghost)
   * ================================================================= */

  /* ---------------------------------------------------------------
   * Layer 1 — Intent (sets --_intent-* private tokens)
   * --------------------------------------------------------------- */

  :host,
  :host([variant=""]),
  :host([variant="neutral"]) {
    --_intent-base: var(--foreground);
    --_intent-base-fg: var(--background);
    --_intent-subtle: oklch(from var(--foreground) l c h / 0.08);
    --_intent-subtle-fg: var(--text-2);
    --_intent-border: var(--border-strong);
  }

  :host([variant="primary"]) {
    --_intent-base: var(--accent);
    --_intent-base-fg: oklch(from var(--accent) 0.98 0.01 h);
    --_intent-subtle: var(--accent-subtle);
    --_intent-subtle-fg: var(--accent-text);
    --_intent-border: oklch(from var(--accent) l c h / 0.5);
  }

  :host([variant="danger"]) {
    --_intent-base: var(--destructive);
    --_intent-base-fg: oklch(from var(--destructive) 0.98 0.01 h);
    --_intent-subtle: var(--destructive-subtle);
    --_intent-subtle-fg: oklch(from var(--destructive-text) l c h / 0.8);
    --_intent-border: oklch(from var(--destructive) l c h / 0.5);
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
    --badge-fg: var(--_intent-subtle-fg);
    --badge-border: var(--_intent-border);
  }

  :host([appearance="soft"]) {
    --badge-bg: var(--_intent-subtle);
    --badge-fg: var(--_intent-subtle-fg);
    --badge-border: transparent;
  }

  /* ---------------------------------------------------------------
   * Sizing & base appearance
   * --------------------------------------------------------------- */

  :host {
    --badge-height: var(--space-5);
    --badge-padding-x: var(--space-2);
    --badge-gap: var(--space-1);
    --badge-radius: var(--radius-full);
    --badge-font-size: var(--text-xs);
    --badge-icon-size: var(--space-3);
    --icon-size: var(--badge-icon-size);
    --icon-color: var(--badge-fg);
    vertical-align: middle;
    line-height: 0;
  }

  :host([size="sm"]) {
    --badge-height: var(--space-4_5);
    --badge-padding-x: var(--space-1_5);
    --badge-gap: var(--space-0_5);
    --badge-font-size: var(--text-xs);
    --badge-icon-size: var(--space-2_5);
  }

  [part="root"] {
    gap: var(--badge-gap);
    height: var(--badge-height);
    padding: 0 var(--badge-padding-x);
    border-radius: var(--badge-radius);
    background: var(--badge-bg);
    color: var(--badge-fg);
    font-family: var(--font-sans);
    font-size: var(--badge-font-size);
    letter-spacing: var(--letter-spacing-normal);
    line-height: var(--line-height-snug);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
    border: var(--border-width-thin) solid var(--badge-border);
  }
`;

export class DuiBadge extends DuiBadgePrimitive {
  static override styles = [...DuiBadgePrimitive.styles, styles];
}

customElements.define(DuiBadge.tagName, DuiBadge);
