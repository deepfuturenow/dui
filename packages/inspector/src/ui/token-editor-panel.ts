/**
 * Token Editor Panel — edit design tokens used by the inspected component.
 *
 * Shows tokens grouped by type (colors, spacing, etc.) with live editors.
 * Changes can be applied globally (via setToken) or scoped (via setComponentToken).
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ComponentInspection, TokenInfo } from "../lib/types.ts";
import { setToken, setComponentToken } from "../lib/mutate.ts";

@customElement("dui-inspector-token-editor")
export class TokenEditorPanelElement extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .scope-toggle {
      display: flex;
      padding: 8px 14px;
      gap: 8px;
      border-bottom: 1px solid #313244;
    }

    .scope-btn {
      background: none;
      border: 1px solid #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .scope-btn[data-active] {
      background: oklch(0.65 0.2 250);
      border-color: oklch(0.65 0.2 250);
      color: white;
    }

    .token-row {
      display: flex;
      align-items: center;
      padding: 6px 14px;
      gap: 8px;
      border-bottom: 1px solid #313244 / 0.5;
    }

    .token-row:hover {
      background: #181825;
    }

    .token-name {
      color: #cba6f7;
      font-size: 11px;
      flex: 1;
      min-width: 0;
      word-break: break-all;
    }

    .token-input {
      background: #181825;
      border: 1px solid #45475a;
      color: #cdd6f4;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 3px;
      width: 120px;
      flex-shrink: 0;
    }

    .token-input:focus {
      outline: none;
      border-color: oklch(0.65 0.2 250);
    }

    .color-input {
      width: 24px;
      height: 24px;
      padding: 0;
      border: 1px solid #45475a;
      border-radius: 3px;
      cursor: pointer;
      flex-shrink: 0;
      background: none;
    }

    .color-input::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    .color-input::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }

    .swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      border: 1px solid #45475a;
      flex-shrink: 0;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 12px 14px;
    }

    .section-label {
      padding: 8px 14px 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #585b70;
      border-bottom: 1px solid #313244;
    }
  `;

  @property({ attribute: false })
  accessor data: ComponentInspection | null = null;

  /** The element selector for scoped changes. */
  @property({ type: String })
  accessor selector = "";

  @state() accessor _scope: "global" | "instance" = "global";

  override render(): TemplateResult {
    if (!this.data) return html`<div class="empty">Select a component</div>`;

    const tokens = this.data.tokens;
    if (tokens.length === 0) return html`<div class="empty">No tokens</div>`;

    // Group tokens by category
    const colors = tokens.filter((t) => t.hex);
    const others = tokens.filter((t) => !t.hex);

    return html`
      <div class="scope-toggle">
        <button
          class="scope-btn"
          ?data-active=${this._scope === "global"}
          @click=${() => (this._scope = "global")}
        >Global</button>
        <button
          class="scope-btn"
          ?data-active=${this._scope === "instance"}
          @click=${() => (this._scope = "instance")}
        >This instance</button>
      </div>

      <div class="body">
        ${colors.length > 0
          ? html`
              <div class="section-label">Colors</div>
              ${colors.map((t) => this.#renderColorToken(t))}
            `
          : nothing}

        ${others.length > 0
          ? html`
              <div class="section-label">Other</div>
              ${others.map((t) => this.#renderTextToken(t))}
            `
          : nothing}
      </div>
    `;
  }

  #renderColorToken(token: TokenInfo): TemplateResult {
    return html`
      <div class="token-row">
        <span class="swatch" style="background:${token.hex}"></span>
        <span class="token-name">${token.name}</span>
        <input
          type="color"
          class="color-input"
          .value=${token.hex ?? "#000000"}
          @change=${(e: Event) => this.#onTokenChange(token.name, (e.target as HTMLInputElement).value)}
        />
        <input
          type="text"
          class="token-input"
          .value=${token.computed}
          @change=${(e: Event) => this.#onTokenChange(token.name, (e.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  #renderTextToken(token: TokenInfo): TemplateResult {
    return html`
      <div class="token-row">
        <span class="token-name">${token.name}</span>
        <input
          type="text"
          class="token-input"
          .value=${token.computed}
          @change=${(e: Event) => this.#onTokenChange(token.name, (e.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  #onTokenChange(name: string, value: string): void {
    if (this._scope === "global") {
      setToken(name, value);
    } else {
      setComponentToken(this.selector, name, value);
    }

    // Dispatch event so inspector-view can re-inspect
    this.dispatchEvent(
      new CustomEvent("token-changed", { bubbles: true, composed: true }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dui-inspector-token-editor": TokenEditorPanelElement;
  }
}
