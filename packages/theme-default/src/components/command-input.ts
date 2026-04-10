import { css } from "lit";
import { type } from "../typography.ts";

export const commandInputStyles = css`
  .InputWrapper {
    gap: var(--space-2);
    border-bottom: var(--border-width-thin) solid var(--border);
    padding-inline: var(--space-3);
  }

  .SearchIcon {
    color: var(--text-2);
    width: var(--space-4);
    height: var(--space-4);
  }

  .Input {
    height: var(--component-height-lg);
    border-radius: var(--radius-md);
    ${type("sm")}
  }

  .Input::placeholder {
    color: var(--text-3);
  }
`;
