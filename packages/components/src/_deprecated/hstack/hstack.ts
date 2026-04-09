/** Ported from original DUI: deep-future-app/app/client/components/dui/hstack */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type StackGap } from "@dui/core/layout-types";

export type HstackAlignment =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";

export type HstackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly"
  | "stretch";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    --hstack-gap: var(--space-4);
    --hstack-align: center;
    --hstack-justify: stretch;
    display: block;
    width: 100%;
  }

  :host([gap="0"]) {
    --hstack-gap: var(--space-0);
  }
  :host([gap="1"]) {
    --hstack-gap: var(--space-1);
  }
  :host([gap="2"]) {
    --hstack-gap: var(--space-2);
  }
  :host([gap="3"]) {
    --hstack-gap: var(--space-3);
  }
  :host([gap="4"]) {
    --hstack-gap: var(--space-4);
  }
  :host([gap="5"]) {
    --hstack-gap: var(--space-5);
  }
  :host([gap="6"]) {
    --hstack-gap: var(--space-6);
  }
  :host([gap="8"]) {
    --hstack-gap: var(--space-8);
  }
  :host([gap="10"]) {
    --hstack-gap: var(--space-10);
  }
  :host([gap="12"]) {
    --hstack-gap: var(--space-12);
  }
  :host([gap="16"]) {
    --hstack-gap: var(--space-16);
  }

  :host([align="start"]) {
    --hstack-align: flex-start;
  }
  :host([align="center"]) {
    --hstack-align: center;
  }
  :host([align="end"]) {
    --hstack-align: flex-end;
  }
  :host([align="stretch"]) {
    --hstack-align: stretch;
  }
  :host([align="baseline"]) {
    --hstack-align: baseline;
  }

  :host([justify="start"]) {
    --hstack-justify: flex-start;
  }
  :host([justify="center"]) {
    --hstack-justify: center;
  }
  :host([justify="end"]) {
    --hstack-justify: flex-end;
  }
  :host([justify="between"]) {
    --hstack-justify: space-between;
  }
  :host([justify="around"]) {
    --hstack-justify: space-around;
  }
  :host([justify="evenly"]) {
    --hstack-justify: space-evenly;
  }
  :host([justify="stretch"]) {
    --hstack-justify: stretch;
  }

  [part="root"] {
    display: flex;
    flex-direction: row;
    gap: var(--hstack-gap);
    align-items: var(--hstack-align);
    justify-content: var(--hstack-justify);
  }
`;

/**
 * `<dui-hstack>` — A horizontal stack layout component.
 *
 * @slot - Stack content.
 * @csspart root - The stack container.
 * @cssprop --hstack-gap - Override gap between items.
 * @cssprop --hstack-align - Override align-items.
 * @cssprop --hstack-justify - Override justify-content.
 */
export class DuiHstack extends LitElement {
  static tagName = "dui-hstack" as const;

  static override styles = [base, styles];

  /** Gap between stack items. Maps to space tokens. */
  @property({ reflect: true })
  accessor gap: StackGap = "4";

  /** Alignment of items on the cross axis. */
  @property({ reflect: true })
  accessor align: HstackAlignment = "center";

  /** Justification of items on the main axis. */
  @property({ reflect: true })
  accessor justify: HstackJustify = "stretch";

  override render(): TemplateResult {
    return html`
      <div part="root">
        <slot></slot>
      </div>
    `;
  }
}
