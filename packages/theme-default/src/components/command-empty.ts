import { css } from "lit";
import { type } from "../typography.ts";

export const commandEmptyStyles = css`
  .Empty {
    padding: var(--space-6);
    ${type("sm")}
    color: var(--text-2);
  }
`;
