import { css } from "lit";

export const commandInputStyles = css`
  .InputWrapper {
    gap: var(--space-2);
    border-bottom: var(--border-width-thin) solid var(--border);
    padding-inline: var(--space-3);
  }

  .SearchIcon {
    color: var(--muted-foreground);
    width: var(--space-4);
    height: var(--space-4);
  }

  .Input {
    height: var(--component-height-lg);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
  }

  .Input::placeholder {
    color: var(--muted-foreground);
  }
`;
