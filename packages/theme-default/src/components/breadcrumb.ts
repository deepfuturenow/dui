import { css } from "lit";
import { type } from "../typography.ts";

export const breadcrumbStyles = css`
  [part="root"] {
    gap: var(--space-2);
    ${type("sm")}
    font-family: var(--font-sans);
    color: var(--text-2);
  }
`;
