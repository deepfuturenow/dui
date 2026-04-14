import { css } from "lit";

/**
 * Shared :host styles for block components (card appearance).
 * Use with Lit's style array: `static override styles = [blockBase, css`...`]`
 * Padding is NOT included — add it per-block since it varies.
 */
export const blockBase = css`
  :host {
    display: block;
    position: relative;
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface-1);
    color: var(--text-1);
  }

  :host::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      repeating-linear-gradient(
        0deg,
        var(--foreground) 0 1px,
        transparent 1px 4px
      ),
      repeating-linear-gradient(
        90deg,
        var(--foreground) 0 1px,
        transparent 1px 4px
      );
    opacity: var(--block-grid-opacity, 0);
    z-index: 999;
    border-radius: inherit;
    transition: opacity 0.15s ease;
  }
`;
