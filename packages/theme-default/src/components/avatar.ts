import { css } from "lit";

export const avatarStyles = css`
  :host {
    --avatar-bg: oklch(from var(--foreground) l c h / 0.08);
    --avatar-fg: var(--text-2);
  }

  [part="root"] {
    --icon-size: calc(var(--avatar-size) * 0.5);
    --icon-color: var(--avatar-fg);
    border-radius: var(--radius-full);
    background: var(--avatar-bg);
    color: var(--avatar-fg);
  }

  [part="fallback"] {
    font-family: var(--font-sans);
    font-size: calc(var(--avatar-size) * 0.4);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-none);
  }
`;
