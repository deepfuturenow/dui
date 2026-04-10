import { css } from "lit";

export const dropzoneStyles = css`
  :host([disabled]) {
    opacity: 0.4;
  }

  [part="root"] {
    border: var(--border-width-medium) dashed var(--border);
    border-radius: var(--radius-md);
    background: var(--background);
    color: var(--text-1);
    padding: var(--space-4);
    transition-property: border-color, background, color, box-shadow, filter, transform;
    transition-duration: var(--duration-fast);
  }

  [part="root"]:hover {
    border-color: var(--accent);
    background: var(--surface-1);
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"][data-dragover] {
    border-color: var(--accent);
    background: var(--accent-subtle);
  }
`;
