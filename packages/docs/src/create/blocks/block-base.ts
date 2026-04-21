import { css } from "lit";

/**
 * 4 × 4 baseline grid overlay for visual debugging.
 * Controlled by --block-grid-opacity (default 0 = hidden).
 * Compose into any block's styles array.
 */
export const gridOverlay = css`
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

  /* Baseline grid trim — prose elements inside blocks */
  h1, h2, h3, h4, h5, h6,
  p, li, blockquote, dt, dd {
    text-box: trim-both cap alphabetic;
  }
`;
