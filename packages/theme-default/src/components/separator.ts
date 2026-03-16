import { css } from "lit";

export const separatorStyles = css`
  [part="root"] {
    border: none;
  }

  :host([orientation="horizontal"]) [part="root"] {
    height: 0;
    border-top: var(--border-width-thin) solid var(--border);
  }

  :host([orientation="vertical"]) [part="root"] {
    width: 0;
    height: 100%;
    border-left: var(--border-width-thin) solid var(--border);
  }
`;
