import { css } from "lit";

export const numberFieldStyles = css`
  :host {
    --number-field-bg: transparent;
    --number-field-fg: var(--text-1);
    --number-field-border: var(--border);
    --number-field-height: var(--component-height-sm);
    --number-field-radius: var(--radius-md);
    --number-field-font-size: var(--font-size-xs);
    --number-field-value-align: center;

    /* Label tokens */
    --number-field-label-bg: var(--surface-2, var(--muted, hsl(0 0% 90%)));
    --number-field-label-fg: var(--text-2);
    --number-field-label-width: var(--space-5);

    /* Private display toggles — hidden by default */
    --_label-display: none;
    --_icon-display: none;
    --_unit-display: none;
  }

  /* -----------------------------------------------------------
   * Label visibility
   * ----------------------------------------------------------- */

  :host([label]:not([label=""])) {
    --_label-display: flex;
  }

  [part="label"] {
    display: var(--_label-display);
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* -----------------------------------------------------------
   * Label position: inside-left
   *
   * Host becomes the bordered container so the label sits
   * visually inside the border alongside the root content.
   * ----------------------------------------------------------- */

  :host([label-position="inside-left"]) {
    display: inline-flex;
    align-items: center;
    background: var(--number-field-bg);
    border: var(--border-width-thin) solid var(--number-field-border);
    border-radius: var(--number-field-radius);
    overflow: hidden;
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
  }

  :host([label-position="inside-left"]:hover) {
    border-color: var(--ring, var(--border));
  }

  :host([label-position="inside-left"]:focus-within) {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  :host([label-position="inside-left"]) [part="label"] {
    width: var(--number-field-label-width);
    height: var(--number-field-height);
    background: var(--number-field-label-bg);
    color: var(--number-field-label-fg);
    font-size: var(--font-size-2xs);
    font-weight: var(--font-weight-medium, 500);
  }

  :host([label-position="inside-left"]) [part="root"] {
    border: none;
    border-radius: 0;
    background: none;
  }

  :host([label-position="inside-left"]) [part="root"]:focus-within {
    box-shadow: none;
  }

  /* -----------------------------------------------------------
   * Label position: above
   * ----------------------------------------------------------- */

  :host([label-position="above"]) {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--space-1);
  }

  :host([label-position="above"]) [part="label"] {
    font-size: var(--font-size-xs);
    color: var(--text-2);
  }

  /* -----------------------------------------------------------
   * Label position: below
   * ----------------------------------------------------------- */

  :host([label-position="below"]) {
    display: flex;
    flex-direction: column-reverse;
    gap: var(--space-1);
  }

  :host([label-position="below"]) [part="label"] {
    font-size: var(--font-size-xs);
    color: var(--text-2);
  }

  /* -----------------------------------------------------------
   * Label position: outside-left
   * ----------------------------------------------------------- */

  :host([label-position="outside-left"]) {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  :host([label-position="outside-left"]) [part="label"] {
    font-size: var(--font-size-xs);
    color: var(--text-2);
  }

  /* -----------------------------------------------------------
   * Icon position
   * ----------------------------------------------------------- */

  :host([icon-position]) {
    --_icon-display: flex;
  }

  :host([icon-position=""]) {
    --_icon-display: none;
  }

  :host([icon-position="inside-left"]) [part="icon"] {
    order: -1;
    padding-left: var(--space-2);
    color: var(--text-2);
  }

  :host([icon-position="inside-right"]) [part="icon"] {
    order: 99;
    padding-right: var(--space-2);
    color: var(--text-2);
  }

  :host([icon-position="outside-left"]) [part="icon"] {
    order: -2;
    color: var(--text-2);
  }

  /* -----------------------------------------------------------
   * Unit suffix visibility
   * ----------------------------------------------------------- */

  :host([unit]:not([unit=""])) {
    --_unit-display: inline;
  }

  /* -----------------------------------------------------------
   * Base appearance (root)
   * ----------------------------------------------------------- */

  [part="root"] {
    height: var(--number-field-height);
    background: var(--number-field-bg);
    border: var(--border-width-thin) solid var(--number-field-border);
    border-radius: var(--number-field-radius);
    font-size: var(--number-field-font-size);
    color: var(--number-field-fg);
    cursor: text;
    transition-duration: var(--duration-fast);
    overflow: hidden;
  }

  [part="root"]:hover {
    border-color: var(--ring, var(--border));
  }

  [part="root"]:focus-within {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  :host([aria-invalid="true"]) [part="root"] {
    border-color: var(--destructive);
  }

  [part="root"][data-dragging] {
    cursor: ew-resize;
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
  }

  /* -----------------------------------------------------------
   * Parts
   * ----------------------------------------------------------- */

  [part="icon"] {
    display: var(--_icon-display);
  }

  [part="unit"] {
    display: var(--_unit-display, none);
    font-size: var(--font-size-2xs);
    color: var(--text-2);
    padding-right: var(--space-2);
  }

  [part="input"] {
    text-align: var(--number-field-value-align);
    padding: 0 var(--space-2);
  }

  :host([disabled]) {
    opacity: 0.5;
  }
`;
