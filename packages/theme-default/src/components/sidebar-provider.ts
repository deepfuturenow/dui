import { css } from "lit";

export const sidebarProviderStyles = css`
  :host {
    --sidebar-width: var(--space-64);
    --sidebar-width-mobile: var(--space-72);
    --sidebar-width-icon: var(--space-12);
    --sidebar-group-padding-y: var(--space-4);
    --sidebar-group-label-inset: var(--space-6);
    --sidebar-button-inset: var(--space-4);
    --sidebar-header-content-gap: var(--space-4);
    --sidebar-bg: var(--surface-1);
    --sidebar-fg: var(--text-1);
    --sidebar-separator: var(--border);
    --sidebar-border: var(--border);
    --sidebar-button-bg: oklch(0 0 0 / 0);
    --sidebar-button-fg: var(--text-1);
    --sidebar-muted-fg: var(--text-2);
    --sidebar-ring: var(--accent);
  }
`;
