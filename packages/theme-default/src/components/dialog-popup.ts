import { css } from "lit";
import { type } from "../typography.ts";

export const dialogPopupStyles = css`
  /* ── Backdrop ── */

  [part="backdrop"] {
    background: var(--scrim);
    transition: opacity var(--duration-fast) var(--ease-out-3);
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
    background: var(--surface-2);
    color: var(--text-1);
    font-family: var(--font-sans);
    box-shadow: var(--shadow-lg);
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
    ${type("lg", { letterSpacing: "var(--letter-spacing-tighter)", lineHeight: "var(--line-height-tight)" })}
    font-weight: var(--font-weight-medium);
    color: var(--text-1);
  }

  /* ── Description ── */

  [part="description"] {
    margin: 0 0 var(--space-6);
    font-family: var(--font-sans);
    ${type("md")}
    color: var(--text-2);
  }

  /* ── Reduced motion ── */

  @media (prefers-reduced-motion: reduce) {
    [part="backdrop"],
    [part="popup"] {
      transition-duration: 0s;
    }
  }
`;
