import { css } from "lit";
import { DuiTextareaPrimitive } from "@dui/primitives/textarea";
import "../_install.ts";

const styles = css`
  :host {
    --font-size: var(--text-sm);
  }

  :host([size="xs"]) {
    --font-size: var(--text-xs);
  }

  :host([size="sm"]) {
    --font-size: var(--text-xs);
  }

  :host([size="lg"]) {
    --font-size: var(--text-sm);
  }

  [part="textarea"] {
    padding: var(--space-2);
    font-family: var(--font-sans);
    font-size: var(--font-size);
    line-height: var(--line-height-snug);
    color: var(--text-1);
    border: var(--border-width-thin) solid var(--border);
    background: transparent;
    border-radius: var(--radius-md);
    transition-property: border-color, box-shadow, background, filter, transform;
    transition-duration: var(--duration-fast);
  }

  [part="textarea"][data-resize="auto"] {
    min-height: var(--component-height-md);
  }

  :host([size="xs"]) [part="textarea"][data-resize="auto"] {
    min-height: var(--component-height-xs);
  }

  :host([size="sm"]) [part="textarea"][data-resize="auto"] {
    min-height: var(--component-height-sm);
  }

  :host([size="lg"]) [part="textarea"][data-resize="auto"] {
    min-height: var(--component-height-lg);
  }

  /* Symmetric padding is what drives (and differentiates) the single-line
   * height AND keeps one line vertically centered — min-height above is only
   * a floor. Scale padding, not just min-height, or the sizes look identical. */
  :host([size="xs"]) [part="textarea"] {
    padding: var(--space-1);
    border-radius: calc(var(--radius-md) * 0.75);
  }

  :host([size="sm"]) [part="textarea"] {
    padding: var(--space-1_5);
  }

  /* Scrollbar */
  [part="textarea"] {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--text-2) 50%, transparent) transparent;
  }

  [part="textarea"]::-webkit-scrollbar {
    width: 0.5rem;
  }

  [part="textarea"]::-webkit-scrollbar-track {
    background: transparent;
  }

  [part="textarea"]::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--text-2) 50%, transparent);
    border-radius: var(--radius-sm);
    border: 0.125rem solid transparent;
    background-clip: padding-box;
  }

  [part="textarea"]::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--text-2) 70%, transparent);
  }

  [part="textarea"]::placeholder {
    color: var(--text-3);
  }

  [part="textarea"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="textarea"]:disabled {
    opacity: 0.4;
  }

  :host([aria-invalid="true"]) [part="textarea"] {
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

export class DuiTextarea extends DuiTextareaPrimitive {
  static override styles = [...DuiTextareaPrimitive.styles, styles];
}

customElements.define(DuiTextarea.tagName, DuiTextarea);
