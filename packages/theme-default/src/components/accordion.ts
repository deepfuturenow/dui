import { css } from "lit";

export const accordionStyles = css`
  ::slotted(:last-child) {
    --accordion-item-border: none;
  }
`;
