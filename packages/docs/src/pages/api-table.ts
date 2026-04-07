import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  componentRegistry,
  type ComponentMeta,
} from "../component-registry.ts";

/**
 * `<api-table>` — Renders API reference tables for a component's
 * properties, events, slots, CSS custom properties, and CSS parts.
 */
@customElement("api-table")
export class ApiTable extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .api-section {
      border-top: var(--border-width-thin) solid var(--muted-foreground);
      padding-top: var(--space-4);
      margin-top: var(--space-4);
    }

    .api-section-label {
      font-size: var(--font-size-md);
      font-weight: 600;
      color: var(--foreground);
      margin: 0 0 var(--space-2);
    }

    table {
      width: 100%;
      font-size: var(--font-size-sm, 0.875rem);
      border-collapse: collapse;
    }

    th {
      text-align: left;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 400;
      color: var(--muted-foreground);
      padding: var(--space-2) 0;
      padding-right: var(--space-4);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
    }

    td {
      padding: var(--space-2) 0;
      padding-right: var(--space-4);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
      vertical-align: top;
      line-height: var(--line-height-relaxed, 1.625);
    }

    tr:last-child td {
      border-bottom: none;
    }

    code {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
    }

    .chip {
      background-color: color-mix(in oklch, var(--info) 12%, transparent);
      border: var(--border-width-thin, 1px) solid color-mix(in oklch, var(--info) 25%, transparent);
      padding: var(--space-0_5) var(--space-1_5);
      border-radius: var(--radius-sm);
    }
  `;

  /** Component tag name to render API for, e.g. "dui-button". */
  @property()
  accessor tag = "";

  get #meta(): ComponentMeta | undefined {
    return componentRegistry.find((c) => c.tagName === this.tag);
  }

  override render() {
    const meta = this.#meta;
    if (!meta) return html`<p>Component not found: ${this.tag}</p>`;

    return html`
      ${meta.properties.length > 0
        ? html`
        <div class="api-section">
        <div class="api-section-label">Properties</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${meta.properties.map(
              (p) => html`
              <tr>
                <td><code class="chip">${p.name}</code></td>
                <td><code>${p.type}</code></td>
                <td>${p.default ? html`<code>${p.default}</code>` : "—"}</td>
                <td>${p.description}</td>
              </tr>
            `,
            )}
          </tbody>
        </table>
        </div>
      `
        : ""}
      ${meta.events.length > 0
        ? html`
        <div class="api-section">
        <div class="api-section-label">Events</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Detail</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${meta.events.map(
              (e) => html`
              <tr>
                <td><code class="chip">${e.name}</code></td>
                <td>${e.detail ? html`<code>${e.detail}</code>` : "—"}</td>
                <td>${e.description}</td>
              </tr>
            `,
            )}
          </tbody>
        </table>
        </div>
      `
        : ""}
      ${meta.slots.length > 0
        ? html`
        <div class="api-section">
        <div class="api-section-label">Slots</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${meta.slots.map(
              (s) => html`
              <tr>
                <td><code class="chip">${s.name}</code></td>
                <td>${s.description}</td>
              </tr>
            `,
            )}
          </tbody>
        </table>
        </div>
      `
        : ""}
      ${meta.cssProperties.length > 0
        ? html`
        <div class="api-section">
        <div class="api-section-label">CSS Custom Properties</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${meta.cssProperties.map(
              (c) => html`
              <tr>
                <td><code class="chip">${c.name}</code></td>
                <td>${c.description}</td>
              </tr>
            `,
            )}
          </tbody>
        </table>
        </div>
      `
        : ""}
      ${meta.cssParts && meta.cssParts.length > 0
        ? html`
        <div class="api-section">
        <div class="api-section-label">CSS Parts</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${meta.cssParts.map(
              (p) => html`
              <tr>
                <td><code class="chip">${p.name}</code></td>
                <td>${p.description}</td>
              </tr>
            `,
            )}
          </tbody>
        </table>
        </div>
      `
        : ""}
    `;
  }
}
