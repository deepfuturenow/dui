import { css } from "lit";
import { type } from "../typography.ts";

export const truncStyles = css`
  [part="root"] {
    font-family: var(--font-sans);
    ${type("sm")}
    color: var(--text-1);
  }
`;
