import { css } from "lit";

export const tabsPanelStyles = css`
  :host {
    --tabs-panel-padding: var(--space-3);
    --tabs-panel-border-width: 0px;
    --tabs-panel-border-color: var(--border);
  }

  :host(:not([data-hidden])) {
    flex: 1;
    min-height: 0;
    padding: var(--tabs-panel-padding);
    border: var(--tabs-panel-border-width) solid var(--tabs-panel-border-color);
  }

  [part="panel"] {
    transition-property: box-shadow;
    transition-duration: var(--duration-fast);
  }

  [part="panel"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    border-radius: var(--radius-md);
  }
`;
