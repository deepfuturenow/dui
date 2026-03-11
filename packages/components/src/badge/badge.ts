import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "info";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }
`;

/**
 * `<dui-badge>` — A badge/chip component for status indicators and labels.
 *
 * @slot - Badge content — text and/or icons.
 * @csspart root - The badge span element.
 */
export class DuiBadge extends LitElement {
  static tagName = "dui-badge" as const;

  static override styles = [base, styles];

  @property({ reflect: true })
  accessor variant: BadgeVariant = "default";

  override render(): TemplateResult {
    return html`
      <span part="root">
        <slot></slot>
      </span>
    `;
  }
}
