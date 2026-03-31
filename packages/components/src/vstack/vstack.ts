/** Ported from original DUI: deep-future-app/app/client/components/dui/vstack */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type StackGap } from "@dui/core/layout-types";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    --vstack-gap: var(--space-4);
    display: block;
    width: 100%;
  }

  :host([gap="0"]) {
    --vstack-gap: var(--space-0);
  }
  :host([gap="1"]) {
    --vstack-gap: var(--space-1);
  }
  :host([gap="2"]) {
    --vstack-gap: var(--space-2);
  }
  :host([gap="3"]) {
    --vstack-gap: var(--space-3);
  }
  :host([gap="4"]) {
    --vstack-gap: var(--space-4);
  }
  :host([gap="5"]) {
    --vstack-gap: var(--space-5);
  }
  :host([gap="6"]) {
    --vstack-gap: var(--space-6);
  }
  :host([gap="8"]) {
    --vstack-gap: var(--space-8);
  }
  :host([gap="10"]) {
    --vstack-gap: var(--space-10);
  }
  :host([gap="12"]) {
    --vstack-gap: var(--space-12);
  }
  :host([gap="16"]) {
    --vstack-gap: var(--space-16);
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    gap: var(--vstack-gap);
  }
`;

/**
 * `<dui-vstack>` — A vertical stack layout component.
 *
 * @slot - Stack content.
 * @csspart root - The stack container.
 * @cssprop --vstack-gap - Override gap between items.
 */
export class DuiVstack extends LitElement {
  static tagName = "dui-vstack" as const;

  static override styles = [base, styles];

  /** Gap between stack items. Maps to space tokens. */
  @property({ reflect: true })
  accessor gap: StackGap = "4";

  override render(): TemplateResult {
    return html`
      <div part="root">
        <slot></slot>
      </div>
    `;
  }
}
