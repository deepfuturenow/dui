import { css } from "lit";

export const sidebarMenuButtonStyles = css`
  :host {
    --smb-height: var(--component-height-md);
    --smb-padding-x: var(--sidebar-button-inset);
    --smb-gap: var(--space-2);
    --smb-icon-size: var(--space-4);
    --smb-font-size: var(--font-size-sm);
    --smb-radius: var(--radius-md);
  }

  :host([size="sm"]) {
    --smb-height: var(--component-height-sm);
    --smb-font-size: var(--font-size-xs);
  }

  :host([size="lg"]) {
    --smb-height: var(--component-height-lg);
    --smb-font-size: var(--font-size-sm);
    --smb-gap: var(--space-2_5);
  }

  .Row {
    height: var(--smb-height);
    border-radius: var(--smb-radius);
    margin: 0 var(--space-2);
    transition-property: background;
    transition-duration: var(--duration-faster);
    transition-timing-function: var(--ease-out-3);
  }

  .Row:hover {
    background: oklch(from var(--foreground) l c h / 0.05);
  }

  .Row[data-active] {
    background: oklch(from var(--foreground) l c h / 0.10);
  }

  .Row[data-icon-collapsed] {
    width: var(--sidebar-width-icon);
    margin: 0 auto;
  }

  .Button {
    gap: var(--smb-gap);
    padding: 0 var(--smb-padding-x);
    color: var(--sidebar-button-fg);
    font-family: var(--font-sans);
    font-size: var(--smb-font-size);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-snug);
    --icon-size: var(--smb-icon-size);
    --icon-color: var(--sidebar-muted-fg);
  }

  .Button:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--sidebar-ring);
    border-radius: var(--smb-radius);
  }

  :host([disabled]) .Row {
    opacity: 0.4;
  }

  :host([active]) .Button {
    color: var(--sidebar-fg);
    font-weight: var(--font-weight-medium);
    --icon-color: var(--sidebar-fg);
  }
`;
