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
    --sidebar-bg: color-mix(
      in oklch,
      var(--background) 97%,
      var(--foreground)
    );
    --sidebar-fg: var(--card-foreground);
    --sidebar-separator: color-mix(
      in oklch,
      var(--foreground) 10%,
      oklch(0 0 0 / 0)
    );
    --sidebar-border: var(--border);
    --sidebar-button-bg: oklch(0 0 0 / 0);
    --sidebar-button-fg: var(--foreground);
    --sidebar-muted-fg: var(--muted-foreground);
    --sidebar-ring: var(--ring);
  }
`;
