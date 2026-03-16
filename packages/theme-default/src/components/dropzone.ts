import { css } from "lit";

export const dropzoneStyles = css`
  :host([disabled]) {
    opacity: 0.5;
  }

  [part="root"] {
    border: 2px dashed var(--border);
    border-radius: var(--radius-md);
    background-color: var(--background);
    color: var(--foreground);
    padding: var(--space-4);
    transition-duration: var(--duration-fast);
  }

  [part="root"]:hover {
    border-color: var(--ring);
    background-color: var(--muted);
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }

  [part="root"][data-dragover] {
    border-color: var(--ring);
    background-color: var(--muted);
  }
`;
