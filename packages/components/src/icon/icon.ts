/** Ported from original DUI: deep-future-app/app/client/components/dui/icon */

import { css, html, LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

const styles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size, var(--space-4_5));
    height: var(--icon-size, var(--space-4_5));
  }

  .icon {
    color: var(--icon-fg, currentColor);
    font-family: "Material Symbols Outlined";
    font-weight: normal;
    font-style: normal;
    font-size: var(--icon-size, var(--space-4_5));
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: "liga";
    -webkit-font-smoothing: antialiased;
    text-align: center;
    display: block;
    width: 100%;
    height: 100%;
  }
`;

/**
 * `<dui-icon>` — Material Symbols icon component.
 *
 * Use the `size` property for direct sizing, or let `--icon-size` cascade
 * from a parent component (e.g. button, badge).
 *
 * @cssprop [--icon-size=var(--space-4_5)] - Icon dimensions.
 * @cssprop [--icon-fg=currentColor] - Icon color.
 */
export class DuiIcon extends LitElement {
  static tagName = "dui-icon" as const;
  static override styles = [base, styles];

  /** Material Symbols icon name. */
  @property({ type: String })
  accessor icon = "";

  /**
   * Icon color as a CSS color value.
   * When set, overrides `--icon-fg` on the host.
   */
  @property({ reflect: true })
  accessor color: string | undefined = undefined;

  /**
   * Icon size as a CSS length value.
   * When set, overrides `--icon-size` on the host.
   */
  @property({ reflect: true })
  accessor size: string | undefined = undefined;

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("size")) {
      if (this.size) {
        this.style.setProperty("--icon-size", this.size);
      } else {
        this.style.removeProperty("--icon-size");
      }
    }
    if (changed.has("color")) {
      if (this.color) {
        this.style.setProperty("--icon-fg", this.color);
      } else {
        this.style.removeProperty("--icon-fg");
      }
    }
  }

  override render() {
    return html`<div class="icon">${this.icon}</div>`;
  }
}
