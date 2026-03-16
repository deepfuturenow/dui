import { css } from "lit";

export const alertDialogPopupStyles = css`
  /* ── Backdrop ── */

  [part="backdrop"] {
    background-color: black;
    opacity: 0.2;
    transition: opacity var(--duration-fast) var(--ease-out-3);
  }

  @container style(--theme: dark) {
    [part="backdrop"] {
      opacity: 0.7;
    }
  }

  [part="backdrop"][data-starting-style],
  [part="backdrop"][data-ending-style] {
    opacity: 0;
  }

  /* ── Popup ── */

  [part="popup"] {
    margin-top: calc(-1 * var(--space-8));
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    border: var(--border-width-thin) solid var(--border);
    background-color: var(--card);
    color: var(--card-foreground);
    font-family: var(--font-sans);
    transition-duration: var(--duration-fast);
  }

  [part="popup"][data-starting-style],
  [part="popup"][data-ending-style] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }

  /* ── Title ── */

  [part="title"] {
    margin-top: calc(-1 * var(--space-1));
    margin-bottom: var(--space-1);
    font-family: var(--font-sans);
    font-size: var(--font-size-lg);
    letter-spacing: var(--letter-spacing-tighter);
    line-height: var(--line-height-tight);
    font-weight: var(--font-weight-medium);
    color: var(--foreground);
  }

  /* ── Description ── */

  [part="description"] {
    margin: 0 0 var(--space-6);
    font-family: var(--font-sans);
    font-size: var(--font-size-md);
    line-height: var(--line-height-normal);
    color: var(--muted-foreground);
  }

  /* ── Reduced motion ── */

  @media (prefers-reduced-motion: reduce) {
    [part="backdrop"],
    [part="popup"] {
      transition-duration: 0s;
    }
  }
`;
