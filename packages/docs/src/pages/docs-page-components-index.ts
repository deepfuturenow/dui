import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";

@customElement("docs-page-components-index")
export class DocsPageComponentsIndex extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    h1 {
      font-size: var(--font-size-fluid-3xl, 2.5rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter, -0.03em);
      margin: 0 0 var(--space-2);
    }

    .subtitle {
      font-family: var(--font-mono);
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-8, 2rem);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .card {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      padding: var(--space-4);
      text-decoration: none;
      color: inherit;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .card:hover {
      border-color: var(--primary);
      box-shadow: 0 0 0 1px var(--primary);
    }

    .card-name {
      font-weight: 600;
      font-size: var(--font-size-base, 1rem);
      margin: 0 0 var(--space-1);
    }

    .card-tag {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-2);
    }

    .card-desc {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      margin: 0;
      line-height: var(--line-height-relaxed, 1.6);
    }
  `;

  get #uniqueComponents() {
    return componentRegistry.filter((c) => c.tagName !== "dui-accordion-item");
  }

  override render() {
    return html`
      <h1>Components</h1>
      <p class="subtitle">Unstyled web components · composable themes · built with Lit</p>

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
