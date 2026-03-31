/**
 * Inspector Panel — detail view for an inspected DUI component.
 * Fixed to the right side, shows properties, tokens, style layers, slots, and parts.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { ComponentInspection } from "../lib/types.ts";

@customElement("inspector-panel")
export class InspectorPanelElement extends LitElement {
  static override styles = css`
    :host {
      position: fixed;
      top: 0;
      right: 0;
      width: 340px;
      height: 100dvh;
      background: #1e1e2e;
      color: #cdd6f4;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .tag-name {
      font-size: 14px;
      font-weight: 700;
      color: #89b4fa;
    }

    .class-name {
      font-size: 11px;
      color: #6c7086;
    }

    .close-btn {
      background: none;
      border: none;
      color: #6c7086;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      line-height: 1;
    }

    .close-btn:hover {
      color: #cdd6f4;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    /* Sections */
    details {
      border-bottom: 1px solid #313244;
    }

    summary {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #a6adc8;
      list-style: none;
      user-select: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::before {
      content: "▸";
      margin-right: 6px;
      font-size: 10px;
      transition: transform 0.15s ease;
    }

    details[open] > summary::before {
      transform: rotate(90deg);
    }

    summary .count {
      margin-left: auto;
      color: #585b70;
      font-weight: 400;
    }

    .section-content {
      padding: 4px 14px 10px;
    }

    /* Table rows */
    .row {
      display: flex;
      padding: 3px 0;
      gap: 8px;
      align-items: baseline;
    }

    .row-name {
      color: #cba6f7;
      flex-shrink: 0;
      min-width: 0;
    }

    .row-value {
      color: #a6e3a1;
      word-break: break-all;
      min-width: 0;
    }

    .row-type {
      color: #585b70;
      font-size: 10px;
      margin-left: auto;
      flex-shrink: 0;
    }

    .row-meta {
      color: #585b70;
      font-size: 10px;
      flex-shrink: 0;
    }

    /* Color swatches */
    .swatch {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 2px;
      border: 1px solid #45475a;
      vertical-align: middle;
      margin-right: 4px;
      flex-shrink: 0;
    }

    /* Style layer */
    .layer-name {
      color: #f9e2af;
      font-weight: 600;
    }

    .layer-props {
      color: #585b70;
      font-size: 10px;
      padding-left: 16px;
      padding-bottom: 4px;
      word-break: break-all;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 4px 14px 10px;
    }

    .shadow-summary {
      padding: 4px 14px 10px;
      color: #6c7086;
    }
  `;

  @property({ attribute: false })
  accessor data: ComponentInspection | null = null;

  override render(): TemplateResult {
    if (!this.data) return html`${nothing}`;
    const d = this.data;

    return html`
      <div class="header">
        <div class="header-info">
          <span class="tag-name">&lt;${d.tagName}&gt;</span>
          <span class="class-name">${d.className}</span>
        </div>
        <button class="close-btn" @click=${this.#onClose}>&times;</button>
      </div>

      <div class="body">
        <!-- Properties -->
        <details open>
          <summary>Properties <span class="count">${d.properties.length}</span></summary>
          ${d.properties.length
            ? html`<div class="section-content">
                ${d.properties.map(
                  (p) => html`
                    <div class="row">
                      <span class="row-name">${p.name}</span>
                      <span class="row-value">${this.#formatValue(p.value)}</span>
                      <span class="row-type">${p.type}</span>
                    </div>
                  `,
                )}
              </div>`
            : html`<div class="empty">No properties</div>`}
        </details>

        <!-- Tokens -->
        <details open>
          <summary>Design Tokens <span class="count">${d.tokens.length}</span></summary>
          ${d.tokens.length
            ? html`<div class="section-content">
                ${d.tokens.map(
                  (t) => html`
                    <div class="row">
                      ${t.hex
                        ? html`<span class="swatch" style="background:${t.hex}"></span>`
                        : nothing}
                      <span class="row-name">${t.name}</span>
                      <span class="row-value">${t.computed}</span>
                    </div>
                  `,
                )}
              </div>`
            : html`<div class="empty">No tokens</div>`}
        </details>

        <!-- Style Layers -->
        <details>
          <summary>Style Layers <span class="count">${d.styleLayers.length}</span></summary>
          ${d.styleLayers.length
            ? html`<div class="section-content">
                ${d.styleLayers.map(
                  (layer) => html`
                    <div class="layer-name">${layer.layer}</div>
                    <div class="layer-props">${layer.properties.join(", ") || "(empty)"}</div>
                  `,
                )}
              </div>`
            : html`<div class="empty">No style layers</div>`}
        </details>

        <!-- Slots -->
        <details>
          <summary>Slots <span class="count">${d.slots.length}</span></summary>
          ${d.slots.length
            ? html`<div class="section-content">
                ${d.slots.map(
                  (s) => html`
                    <div class="row">
                      <span class="row-name">${s.name}</span>
                      <span class="row-meta">${s.assignedNodes} nodes</span>
                    </div>
                  `,
                )}
              </div>`
            : html`<div class="empty">No slots</div>`}
        </details>

        <!-- Parts -->
        <details>
          <summary>CSS Parts <span class="count">${d.parts.length}</span></summary>
          ${d.parts.length
            ? html`<div class="section-content">
                ${d.parts.map(
                  (p) => html`
                    <div class="row">
                      <span class="row-name">::part(${p.name})</span>
                      <span class="row-meta">&lt;${p.tagName}&gt;</span>
                    </div>
                  `,
                )}
              </div>`
            : html`<div class="empty">No parts</div>`}
        </details>

        <!-- Shadow Summary -->
        <div class="shadow-summary">${d.shadowSummary}</div>
      </div>
    `;
  }

  #formatValue(value: unknown): string {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "string") return `"${value}"`;
    return String(value);
  }

  #onClose(): void {
    this.dispatchEvent(new Event("close-panel", { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "inspector-panel": InspectorPanelElement;
  }
}
