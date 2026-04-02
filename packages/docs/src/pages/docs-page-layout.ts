import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { componentRegistry, type ComponentMeta } from "../component-registry.ts";
import { renderApiTable } from "./page-utils.ts";

/**
 * `<docs-page-layout>` — Shared layout wrapper for all component doc pages.
 *
 * Renders the page title, description, a slot for demos, and the API table.
 * Usage:
 *   <docs-page-layout tag="dui-button">
 *     <dui-docs-demo label="Variants">...</dui-docs-demo>
 *   </docs-page-layout>
 */
@customElement("docs-page-layout")
export class DocsPageLayout extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter, -0.03em);
      margin: 0 0 var(--space-2);
    }

    .description {
      font-size: var(--font-size-sm);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-8, 2rem);
    }

    .section-heading {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 600;
      letter-spacing: var(--letter-spacing-wider, 0.05em);
      color: var(--primary);
      margin: var(--space-12) 0 var(--space-4);
    }

    .api-section-label {
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--secondary-foreground);
      margin: var(--space-4) 0 var(--space-2);
    }

    .api-table {
      width: 100%;
      font-size: var(--font-size-sm, 0.875rem);
      margin-bottom: var(--space-6, 1.5rem);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
    }

    .api-table th {
      text-align: left;
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider, 0.05em);
      color: var(--muted-foreground);
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
    }

    .api-table td {
      padding: var(--space-1_5) var(--space-3);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
      vertical-align: top;
    }

    .api-table tr:last-child td {
      border-bottom: none;
    }

    .api-table code {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      background: var(--muted);
      border-radius: var(--radius-sm, 0.25rem);
    }
  `;

  /** Primary component tag name, e.g. "dui-button". */
  @property()
  accessor tag = "";

  /** Additional tag names whose API tables should also be shown. */
  @property({ type: Array })
  accessor additionalTags: string[] = [];

  get #metas(): ComponentMeta[] {
    const tags = [this.tag, ...this.additionalTags];
    return tags
      .map((t) => componentRegistry.find((c) => c.tagName === t))
      .filter((m): m is ComponentMeta => m !== undefined);
  }

  override render() {
    const metas = this.#metas;
    const primary = metas[0];
    if (!primary) return html`<p>Component not found: ${this.tag}</p>`;

    return html`
      <h1 class="title">${primary.name}</h1>
      <p class="description">${primary.description}</p>
      <slot></slot>
      <h2 class="section-heading">API Reference</h2>
      ${metas.map((meta) =>
        metas.length > 1
          ? html`<h3 class="section-heading" style="font-size: var(--font-size-base);">&lt;${meta.tagName}&gt;</h3>${renderApiTable(meta)}`
          : renderApiTable(meta)
      )}
    `;
  }
}
