import { css } from "lit";
import { DuiAlertDialogPopupPrimitive } from "@dui/primitives/alert-dialog";
import "../_install.ts";

const styles = css`
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
    padding: var(--space-6) var(--space-5) var(--space-5);
    border-radius: var(--radius-lg);
    border: var(--border-width-thin) solid var(--border);
    background: var(--surface-2);
    color: var(--text-1);
    font-family: var(--font-sans);
    box-shadow: var(--shadow-lg);
    transition-duration: var(--duration-fast);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  [part="popup"][data-starting-style],
  [part="popup"][data-ending-style] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }

  /* ── Title ── */

  [part="title"] {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--text-base--line-height);
    font-weight: var(--font-weight-semibold);
    color: var(--text-1);
    text-box: trim-both cap alphabetic;
    text-wrap: pretty;
  }

  /* ── Description ── */

  [part="description"] {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    color: var(--text-2);
    text-box: trim-both cap alphabetic;
  }

  /* ── Reduced motion ── */

  @media (prefers-reduced-motion: reduce) {
    [part="backdrop"],
    [part="popup"] {
      transition-duration: 0s;
    }
  }
`;

export class DuiAlertDialogPopup extends DuiAlertDialogPopupPrimitive {
  static override styles = [...DuiAlertDialogPopupPrimitive.styles, styles];
}

customElements.define(DuiAlertDialogPopup.tagName, DuiAlertDialogPopup);
