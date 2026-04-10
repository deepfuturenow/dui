/**
 * Inspector Panel — detail view for an inspected DUI component.
 * Shows: selector, events, properties, CSS parts, slots, shadow summary.
 *
 * Design tokens and style layers are in their own dedicated tabs.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { ComponentInspection } from "../lib/types.ts";

@customElement("dui-inspector-panel")
export class InspectorPanelElement extends LitElement {
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

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 4px 14px 10px;
    }

    .shadow-summary {
      padding: 4px 14px 10px;
      color: #6c7086;
    }

    .selector-row {
      padding: 4px 14px 8px;
      color: #585b70;
      font-size: 11px;
      border-bottom: 1px solid #313244;
      word-break: break-all;
    }

    .selector-row code {
      color: #89b4fa;
    }

    /* Event source badge */
    .event-source {
      font-size: 9px;
      color: #585b70;
      background: #313244;
      padding: 1px 4px;
      border-radius: 2px;
      flex-shrink: 0;
    }
  `;

  @property({ attribute: false })
  accessor data: ComponentInspection | null = null;

  override render(): TemplateResult {
    if (!this.data) return html`${nothing}`;
    const d = this.data;

    return html`
      <div class="body">
        <!-- Path & Selector -->
        <div class="selector-row">
          Path: <code>${d.path}</code>
        </div>
        <div class="selector-row">
          Selector: <code>${d.selector}</code>
        </div>

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

        <!-- CSS Parts -->
        <details open>
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
}

declare global {
  interface HTMLElementTagNameMap {
    "dui-inspector-panel": InspectorPanelElement;
  }
}
