import { css } from "lit";

export const collapsibleStyles = css`
  /* ── Trigger ── */

  [part="trigger"] {
    gap: var(--space-4);
    padding-block: var(--space-2);
    padding-inline: var(--space-4);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
    height: var(--component-height-md);
    line-height: var(--line-height-normal);
    border-radius: var(--radius-sm);
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  @media (hover: hover) {
    [part="trigger"]:hover {
      background: color-mix(in oklch, var(--muted) 50%, transparent);
    }
  }

  [part="trigger"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    z-index: 1;
  }

  [part="trigger"][data-disabled] {
    opacity: 0.5;
  }

  /* ── Indicator ── */

  [part="indicator"] {
    width: var(--space-4);
    height: var(--space-4);
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  [part="trigger"][data-open] [part="indicator"] {
    transform: rotate(180deg);
  }

  /* ── Panel ── */

  [part="panel"] {
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  [part="panel"][data-starting-style],
  [part="panel"][data-ending-style] {
    height: 0;
  }

  [part="content"] {
    padding: var(--space-1) var(--space-4) var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    color: color-mix(in oklch, var(--foreground) 80%, transparent);
  }

  /* ── Reduced motion ── */

  @media (prefers-reduced-motion: reduce) {
    [part="trigger"],
    [part="indicator"],
    [part="panel"] {
      transition-duration: 0s;
    }
  }
`;
