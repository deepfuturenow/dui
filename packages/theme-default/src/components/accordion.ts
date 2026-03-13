import { css } from "lit";

export const accordionStyles = css`
  :host([hide-last-border]) ::slotted(:last-child) {
    --accordion-item-border: none;
  }
`;
