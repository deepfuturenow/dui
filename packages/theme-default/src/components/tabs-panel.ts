import { css } from "lit";

export const tabsPanelStyles = css`
  :host {
    --tabs-panel-padding: var(--space-3);
    --tabs-panel-border-width: var(--border-width-thin);
    --tabs-panel-border-color: var(--border);
    --tabs-panel-border-radius: var(--radius-md);
    --tabs-panel-background: none;
  }

  :host(:not([data-hidden])) {
    flex: 1;
    min-height: 0;
    padding: var(--tabs-panel-padding);
    border: var(--tabs-panel-border-width) solid var(--tabs-panel-border-color);
    border-radius: var(--tabs-panel-border-radius);
    background: var(--tabs-panel-background);
  }

  [part="panel"] {
    transition-property: box-shadow;
    transition-duration: var(--duration-fast);
    font-family: var(--font-sans);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    font-weight: var(--font-weight-regular);
    color: var(--text-2);
  }

  [part="panel"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
        var(--focus-ring-color);
    border-radius: var(--radius-md);
  }
`;
