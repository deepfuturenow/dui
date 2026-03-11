/**
 * Themed base styles — visual defaults for :host.
 * These are the opinionated visual properties that come from the theme,
 * as opposed to the structural resets in @dui/core/base.
 */

import { css } from "lit";

export const themedBase = css`
  :host {
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: inherit;
    letter-spacing: inherit;
    line-height: var(--line-height-normal);
    font-optical-sizing: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
