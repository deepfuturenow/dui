import { css } from "lit";

export const badgeStyles = css`
  :host {
    --badge-bg: var(--primary);
    --badge-fg: var(--primary-foreground);
    --badge-border: transparent;
    --badge-icon-size: var(--space-3);
  }

  :host([variant="secondary"]) {
    --badge-bg: var(--secondary);
    --badge-fg: var(--secondary-foreground);
  }

  :host([variant="destructive"]) {
    --badge-bg: var(--destructive);
    --badge-fg: var(--destructive-foreground);
  }

  :host([variant="outline"]) {
    --badge-bg: transparent;
    --badge-fg: var(--primary);
    --badge-border: color-mix(in oklch, var(--primary) 25%, transparent);
  }

  :host([variant="success"]) {
    --badge-bg: var(--success);
    --badge-fg: var(--success-foreground);
  }

  :host([variant="warning"]) {
    --badge-bg: var(--warning);
    --badge-fg: var(--warning-foreground);
  }

  :host([variant="info"]) {
    --badge-bg: var(--info);
    --badge-fg: var(--info-foreground);
  }

  [part="root"] {
    --icon-size: var(--badge-icon-size);
    --icon-color: var(--badge-fg);
    gap: var(--space-1);
    height: var(--space-5);
    padding: 0 var(--space-2);
    border-radius: var(--radius-full);
    background-color: var(--badge-bg);
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
