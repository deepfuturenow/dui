import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  componentRegistry,
  type ComponentMeta,
} from "../component-registry.ts";

/**
 * Derive the class hierarchy from a tag name.
 * dui-foo-bar → DuiFooBar › DuiFooBarPrimitive › LitElement
 */
function deriveHierarchy(tagName: string): string {
  const pascal = tagName
    .replace(/^dui-/, "")
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return `Dui${pascal} › Dui${pascal}Primitive › LitElement`;
}

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

    .hierarchy {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--text-3);
      margin-bottom: var(--space-6);
      letter-spacing: var(--letter-spacing-wide);
    }

    .hierarchy .sep {
      color: var(--text-3);
      opacity: 0.5;
      margin: 0 var(--space-1);
    }

    .api-section {
      border-top: var(--border-width-thin) solid var(--text-2);
      padding-top: var(--space-4);
      margin-top: var(--space-4);
    }

    .api-section-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-3);
      margin: 0 0 var(--space-2);
    }

    .api-section-label {
      font-size: var(--text-base);
      font-weight: 600;
      color: var(--foreground);
      margin: 0;
    }

    .primitive-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--text-2xs);
      font-weight: 500;
      letter-spacing: var(--letter-spacing-wider);
      text-transform: uppercase;
      color: var(--text-3);
      background: var(--surface-1);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-full);
      padding: var(--space-0_5) var(--space-2);
      text-decoration: none;
      transition: color var(--duration-fast) var(--ease-out-3),
                  border-color var(--duration-fast) var(--ease-out-3);
    }

    .primitive-badge:hover {
      color: var(--accent-text);
      border-color: var(--accent);
    }

    .section-note {
      font-size: var(--text-xs);
      color: var(--text-3);
      margin: 0 0 var(--space-3);
      line-height: var(--line-height-relaxed);
    }

    table {
      width: 100%;
      font-size: var(--text-sm, 0.875rem);
      border-collapse: collapse;
    }

    th {
      text-align: left;
      font-size: var(--text-sm, 0.875rem);
      font-weight: 400;
      color: var(--text-2);
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
      font-size: var(--text-xs, 0.75rem);
    }

    .chip {
      background-color: color-mix(in oklch, var(--info) 12%, transparent);
      border: var(--border-width-thin, 1px) solid color-mix(in oklch, var(--info) 25%, transparent);
      padding: var(--space-0_5) var(--space-1_5);
      border-radius: var(--radius-sm);
    }

    .source-label {
      font-size: var(--text-2xs);
      font-weight: 500;
      letter-spacing: var(--letter-spacing-wider);
      text-transform: uppercase;
      color: var(--text-3);
      white-space: nowrap;
    }
  `;

  /** Component tag name to render API for, e.g. "dui-button". */
  @property()
  accessor tag = "";

  get #meta(): ComponentMeta | undefined {
    return componentRegistry.find((c) => c.tagName === this.tag);
  }

  /** Build the primitives docs URL for this component */
  #primitivesUrl(tag: string): string {
    // dui-foo-bar → foo-bar
    const slug = tag.replace(/^dui-/, "");
    return `https://deepfuturenow.github.io/dui-primitives/#/components/${slug}`;
  }

  #renderPrimitiveBadge(tag: string) {
    return html`<a
      class="primitive-badge"
      href="${this.#primitivesUrl(tag)}"
      target="_blank"
      title="Defined on the primitive"
    >Primitive ↗</a>`;
  }

  override render() {
    const meta = this.#meta;
    if (!meta) return html`<p>Component not found: ${this.tag}</p>`;

    // Merge themeAttributes into properties
    const allProperties = [
      ...meta.properties.map((p) => ({ ...p, source: "primitive" as const })),
      ...(meta.themeAttributes ?? []).map((a) => ({
        name: a.name,
        type: a.values,
        default: undefined as string | undefined,
        description: a.description,
        source: "styled" as const,
      })),
    ];

    // Merge themeCssProperties into cssProperties
    const allCssProperties = [
      ...meta.cssProperties.map((c) => ({ ...c, source: "primitive" as const })),
      ...(meta.themeCssProperties ?? []).map((c) => ({
        ...c,
        source: "styled" as const,
      })),
    ];

    const hierarchy = deriveHierarchy(meta.tagName);

    return html`
      <div class="hierarchy">${hierarchy}</div>

      ${allProperties.length > 0
        ? html`
        <div class="api-section">
        <div class="api-section-header">
          <div class="api-section-label">Properties</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type / Values</th>
              <th>Default</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${allProperties.map(
              (p) => html`
              <tr>
                <td><code class="chip">${p.name}</code></td>
                <td><code>${p.type}</code></td>
                <td>${p.default ? html`<code>${p.default}</code>` : "—"}</td>
                <td>${p.description}</td>
                <td><span class="source-label">${p.source === "primitive" ? "primitive" : "styled"}</span></td>
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
        <div class="api-section-header">
          <div class="api-section-label">Events</div>
          ${this.#renderPrimitiveBadge(meta.tagName)}
        </div>
        <p class="section-note">Emitted by the underlying primitive.</p>
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
        <div class="api-section-header">
          <div class="api-section-label">Slots</div>
          ${this.#renderPrimitiveBadge(meta.tagName)}
        </div>
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

      ${allCssProperties.length > 0
        ? html`
        <div class="api-section">
        <div class="api-section-header">
          <div class="api-section-label">CSS Custom Properties</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${allCssProperties.map(
              (c) => html`
              <tr>
                <td><code class="chip">${c.name}</code></td>
                <td>${c.description}</td>
                <td><span class="source-label">${c.source === "primitive" ? "primitive" : "styled"}</span></td>
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
        <div class="api-section-header">
          <div class="api-section-label">CSS Parts</div>
          ${this.#renderPrimitiveBadge(meta.tagName)}
        </div>
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
