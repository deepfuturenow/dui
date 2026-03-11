/**
 * Token Editor — Single token row (compact swatch + name, expandable OKLCH)
 *
 * For color tokens: compact row with swatch, name, value. Click to expand
 * the OKLCH editor. For non-color tokens: simple inline text input.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { isOklchValue, composeOklch, parseOklch } from "../lib/token-parser.ts";
import "./oklch-editor.ts";

@customElement("token-editor")
export class TokenEditorElement extends LitElement {
  static override styles = [
    base,
    css`
      :host {
        display: block;
      }

      /* ---- Color token: compact row ---- */
      .color-row {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-1_5) var(--space-1);
        border-radius: var(--radius-sm);
        cursor: pointer;
        user-select: none;
      }

      .color-row:hover {
        background: color-mix(in oklch, var(--muted) 50%, transparent);
      }

      .swatch {
        width: 28px;
        height: 28px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        flex-shrink: 0;
      }

      .color-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .token-name {
        font-size: var(--font-size-sm);
        font-family: var(--font-mono);
        font-weight: var(--font-weight-medium);
        color: var(--foreground);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .token-value {
        font-size: var(--font-size-xs);
        font-family: var(--font-mono);
        color: var(--muted-foreground);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .modified-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--ring);
        flex-shrink: 0;
      }

      .expand-area {
        padding: var(--space-1) var(--space-1) var(--space-2);
      }

      /* ---- Non-color token: inline row ---- */
      .text-row {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-1_5) var(--space-1);
      }

      .text-label {
        font-size: var(--font-size-sm);
        font-family: var(--font-mono);
        font-weight: var(--font-weight-medium);
        color: var(--foreground);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .text-input {
        flex: 1;
        min-width: 0;
        font-size: var(--font-size-xs);
        font-family: var(--font-mono);
        padding: var(--space-1) var(--space-1_5);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--input-bg);
        color: var(--foreground);
        box-sizing: border-box;
      }

      .text-input:focus {
        outline: 2px solid var(--ring);
        outline-offset: -1px;
        border-color: transparent;
      }
    `,
  ];

  @property({ type: String, attribute: "token-name" }) accessor tokenName = "";
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor theme: string | undefined = undefined;
  @property({ type: Boolean }) accessor modified = false;

  @state() accessor expanded = false;

  #toggleExpand = (): void => {
    this.expanded = !this.expanded;
  };

  #onTextChange = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent("token-change", {
        detail: { name: this.tokenName, value: input.value, theme: this.theme },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #onOklchChange = (e: CustomEvent<{ value: string }>): void => {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("token-change", {
        detail: { name: this.tokenName, value: e.detail.value, theme: this.theme },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render(): TemplateResult {
    const isColor = isOklchValue(this.value);

    if (isColor) {
      const parsed = parseOklch(this.value);
      const displayColor = parsed
        ? composeOklch(parsed.l, parsed.c, parsed.h, parsed.alpha)
        : this.value;

      return html`
        <div class="color-row" @click="${this.#toggleExpand}">
          <div class="swatch" style="background: ${displayColor}"></div>
          <div class="color-info">
            <span class="token-name">${this.tokenName}</span>
            <span class="token-value">${this.value}</span>
          </div>
          ${this.modified ? html`<span class="modified-dot"></span>` : nothing}
        </div>
        ${this.expanded
          ? html`
              <div class="expand-area">
                <oklch-editor
                  .value="${this.value}"
                  @token-change="${this.#onOklchChange}"
                ></oklch-editor>
              </div>
            `
          : nothing}
      `;
    }

    // Non-color: simple inline row
    return html`
      <div class="text-row">
        <span class="text-label">${this.tokenName}</span>
        <input
          class="text-input"
          .value="${this.value}"
          @change="${this.#onTextChange}"
        />
        ${this.modified ? html`<span class="modified-dot"></span>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "token-editor": TokenEditorElement;
  }
}
