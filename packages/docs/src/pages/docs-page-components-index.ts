import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { sectionStyles } from "./docs-section-styles.ts";

@customElement("docs-page-components-index")
export class DocsPageComponentsIndex extends LitElement {
  static override styles = [sectionStyles, css`
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: var(--space-3);
    }

    .card {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      padding: var(--space-4) var(--space-5);
      text-decoration: none;
      color: inherit;
      background: var(--surface-2);
      transition: border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease, transform var(--duration-fast) ease;
    }

    .card:hover {
      border-color: var(--text-2);
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }

    .card-name {
      font-weight: 600;
      font-size: var(--font-size-sm, 0.875rem);
      margin: 0 0 var(--space-0_5);
    }

    .card-tag {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
      margin: 0 0 var(--space-2);
    }

    .card-desc {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
      margin: 0;
      line-height: var(--line-height-relaxed, 1.625);
    }
  `];

  get #uniqueComponents() {
    return componentRegistry.filter((c) => c.tagName !== "dui-accordion-item");
  }

  override render() {
    return html`
      <h1 class="title">Components</h1>
      <p class="subtitle">Unstyled web components + composable themes. Built with Lit.</p>

      <div class="grid">
        ${this.#uniqueComponents.map((c) => {
          const slug = c.tagName.replace("dui-", "");
          return html`
            <a class="card" href="#/components/${slug}">
              <p class="card-name">${c.name}</p>
              <p class="card-tag">&lt;${c.tagName}&gt;</p>
              <p class="card-desc">${c.description}</p>
            </a>
          `;
        })}
      </div>
    `;
  }
}
