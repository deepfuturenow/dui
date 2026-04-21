/**
 * Themed base styles — minor :host defaults.
 * Visual defaults (color, font-family, line-height, font-smoothing)
 * live on :root in tokens.css so they cascade naturally.
 */

import { css } from "lit";

export const themedBase = css`
  :host {
    font-size: inherit;
    letter-spacing: inherit;
    font-optical-sizing: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
