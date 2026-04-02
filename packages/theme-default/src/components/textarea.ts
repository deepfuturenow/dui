import { css } from "lit";

export const textareaStyles = css`
  :host {
    --font-size: var(--font-size-sm);
  }

  [part="textarea"] {
    padding: var(--space-2);
    font-family: var(--font-sans);
    font-size: var(--font-size);
    line-height: var(--line-height-snug);
    color: var(--foreground);
    border: var(--border-width-thin) solid var(--input);
    background: var(--input-bg);
    border-radius: var(--radius-md);
    transition-duration: var(--duration-fast);
  }

  [part="textarea"][data-resize="auto"] {
    min-height: var(--component-height-md);
  }

  /* Scrollbar */
  [part="textarea"] {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--muted-foreground) 50%, transparent) transparent;
  }

  [part="textarea"]::-webkit-scrollbar {
    width: 0.5rem;
  }

  [part="textarea"]::-webkit-scrollbar-track {
    background: transparent;
  }

  [part="textarea"]::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--muted-foreground) 50%, transparent);
    border-radius: var(--radius-sm);
    border: 0.125rem solid transparent;
    background-clip: padding-box;
  }

  [part="textarea"]::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--muted-foreground) 70%, transparent);
  }

  [part="textarea"]::placeholder {
    color: var(--muted-foreground);
  }

  [part="textarea"]:focus-visible {
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }

  [part="textarea"]:disabled {
    opacity: 0.5;
  }

  [part="textarea"][data-invalid] {
    border-color: var(--destructive);
  }

  /* Ghost variant */
  :host([variant="ghost"]) [part="textarea"] {
    border-color: transparent;
    background: transparent;
    padding: 0;
  }

  :host([variant="ghost"]) [part="textarea"]:focus-visible {
    box-shadow: none;
  }
`;
