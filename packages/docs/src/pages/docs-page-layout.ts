import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { componentRegistry, type ComponentMeta } from "../component-registry.ts";
import "./api-table.ts";

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

    .section-heading {
      font-size: var(--text-xl, 1.25rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tight, -0.01em);
      color: var(--foreground);
      margin: var(--space-14, 3.5rem) 0 var(--space-6);
      padding-top: var(--space-6);
      border-top: var(--border-width-medium, 2px) solid var(--border);
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
      ${metas.map((meta) =>
        metas.length > 1
          ? html`<h3 class="section-heading" style="font-size: var(--text-base);">&lt;${meta.tagName}&gt;</h3><api-table tag=${meta.tagName}></api-table>`
          : html`<api-table tag=${meta.tagName}></api-table>`
      )}
    `;
  }
}
