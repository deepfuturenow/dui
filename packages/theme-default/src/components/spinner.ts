import { css } from "lit";

export const spinnerStyles = css`
  :host {
    --spinner-size: var(--component-height-xxs);
    --spinner-color: currentColor;
    width: var(--spinner-size);
    height: var(--spinner-size);
    color: var(--spinner-color);
  }

  :host([size="md"]) {
    --spinner-size: var(--component-height-sm);
  }

  :host([size="lg"]) {
    --spinner-size: var(--component-height-xl);
  }

  @media (prefers-reduced-motion: reduce) {
    [part="svg"][data-rotate] {
      animation-duration: 3s;
    }
  }
`;
