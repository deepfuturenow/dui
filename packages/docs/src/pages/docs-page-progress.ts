import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-progress")
export class DocsPageProgress extends LitElement {
  protected override createRenderRoot() { return this; }

  @state()
  accessor #demoValue = 33;

  #increment = () => {
    this.#demoValue = Math.min(100, this.#demoValue + 10);
  };

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-progress")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Values">
        <div style="display: flex; flex-direction: column; gap: var(--space-4); width: 100%;">
          <div>
            <div style="font-size: var(--font-size-xs); color: var(--muted-foreground); margin-bottom: var(--space-1);">0%</div>
            <dui-progress value="0"></dui-progress>
          </div>
          <div>
            <div style="font-size: var(--font-size-xs); color: var(--muted-foreground); margin-bottom: var(--space-1);">33%</div>
            <dui-progress value="33"></dui-progress>
          </div>
          <div>
            <div style="font-size: var(--font-size-xs); color: var(--muted-foreground); margin-bottom: var(--space-1);">66%</div>
            <dui-progress value="66"></dui-progress>
          </div>
          <div>
            <div style="font-size: var(--font-size-xs); color: var(--muted-foreground); margin-bottom: var(--space-1);">100%</div>
            <dui-progress value="100"></dui-progress>
          </div>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Indeterminate">
        <dui-progress style="width: 100%;"></dui-progress>
      </dui-docs-demo>

      <dui-docs-demo label="Interactive">
        <div style="display: flex; flex-direction: column; gap: var(--space-3); width: 100%;">
          <dui-progress value="${this.#demoValue}"></dui-progress>
          <div class="row">
            <dui-button size="sm" @click="${this.#increment}">
              Increment (+10)
            </dui-button>
            <span style="font-size: var(--font-size-sm); color: var(--muted-foreground);">
              ${this.#demoValue}%
            </span>
          </div>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
