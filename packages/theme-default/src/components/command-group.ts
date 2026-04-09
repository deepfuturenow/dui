import { css } from "lit";
import { type } from "../typography.ts";

export const commandGroupStyles = css`
  .Group {
    padding: var(--space-1_5);
  }

  .Heading {
    padding: var(--space-1_5) var(--space-2);
    ${type("xs")}
    font-weight: var(--font-weight-medium);
    color: var(--text-2);
  }
`;
