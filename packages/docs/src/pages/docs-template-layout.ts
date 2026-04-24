import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { templateRegistry, type TemplateMeta } from "../template-registry.ts";

/**
 * `<docs-template-layout>` — Shared layout wrapper for template doc pages.
 *
 * Renders the page title, description, a slot for demos, and an API table.
 * Usage:
 *   <docs-template-layout tag="dui-feed-item">
 *     <dui-docs-demo label="Basic">...</dui-docs-demo>
 *   </docs-template-layout>
 */
@customElement("docs-template-layout")
export class DocsTemplateLayout extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .title {
      font-size: var(--text-2xl, 1.5rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter, -0.02em);
      line-height: var(--line-height-tight, 1.25);
      margin: 0 0 var(--space-2);
      color: var(--foreground);
    }

    .description {
      font-size: var(--text-base, 0.9375rem);
      color: var(--text-2);
      line-height: var(--line-height-relaxed, 1.625);
      margin: 0 0 var(--space-8, 2rem);
    }

    .badge {
      display: inline-block;
      font-size: var(--text-xs, 0.75rem);
      font-weight: var(--font-weight-medium, 500);
      padding: var(--space-0_5) var(--space-2);
      border-radius: var(--radius-full);
      background: oklch(from var(--accent) l c h / 0.1);
      color: var(--accent-text);
      margin-bottom: var(--space-3);
    }

    .section-heading {
      font-size: var(--text-xl, 1.25rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tight, -0.01em);
      color: var(--foreground);
      margin: var(--space-14, 3.5rem) 0 var(--space-6);
      padding-top: var(--space-6);
      border-top: var(--border-width-medium, 2px) solid var(--border);
    }

    /* ── API table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--text-sm, 0.875rem);
      margin-bottom: var(--space-6);
    }

    th {
      text-align: left;
      font-weight: var(--font-weight-semibold, 600);
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width-medium, 2px) solid var(--border);
      color: var(--foreground);
    }

    td {
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
      color: var(--text-1);
      vertical-align: top;
    }

    code {
      font-family: var(--font-mono);
      font-size: var(--text-xs, 0.75rem);
      background: var(--surface-1);
      padding: var(--space-0_5) var(--space-1);
      border-radius: var(--radius-sm);
    }

    .dep-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1_5);
      margin-top: var(--space-4);
    }

    .dep-tag {
      font-family: var(--font-mono);
      font-size: var(--text-xs, 0.75rem);
      padding: var(--space-0_5) var(--space-2);
      border-radius: var(--radius-sm);
      border: var(--border-width-thin) solid var(--border);
      color: var(--text-2);
    }
  `;

  /** Template tag name, e.g. "dui-feed-item". */
  @property()
  accessor tag = "";

  get #meta(): TemplateMeta | undefined {
    return templateRegistry.find((t) => t.tagName === this.tag);
  }

  override render() {
    const meta = this.#meta;
    if (!meta) return html`<p>Template not found: ${this.tag}</p>`;

    return html`
      <span class="badge">Template</span>
      <h1 class="title">${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <slot></slot>

      <h3 class="section-heading">Properties</h3>
      ${meta.properties.length > 0 ? html`
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            ${meta.properties.map((p) => html`
              <tr>
                <td><code>${p.name}</code></td>
                <td><code>${p.type}</code></td>
                <td>${p.default ? html`<code>${p.default}</code>` : "—"}</td>
                <td>${p.description}</td>
              </tr>
            `)}
          </tbody>
        </table>
      ` : html`<p>No properties.</p>`}

      ${meta.slots.length > 0 ? html`
        <h3 class="section-heading">Slots</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Description</th></tr>
          </thead>
          <tbody>
            ${meta.slots.map((s) => html`
              <tr>
                <td><code>${s.name}</code></td>
                <td>${s.description}</td>
              </tr>
            `)}
          </tbody>
        </table>
      ` : nothing}

      ${meta.dependencies.length > 0 ? html`
        <h3 class="section-heading">Component Dependencies</h3>
        <p style="color: var(--text-2); font-size: var(--text-sm);">
          These DUI components are rendered internally by this template.
        </p>
        <div class="dep-list">
          ${meta.dependencies.map((d) => html`<span class="dep-tag">&lt;${d}&gt;</span>`)}
        </div>
      ` : nothing}
    `;
  }
}
