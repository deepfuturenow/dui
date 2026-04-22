import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("docs-page-progress")
export class DocsPageProgress extends LitElement {
  protected override createRenderRoot() { return this; }

  @state()
  accessor #demoValue = 33;

  #increment = () => {
    this.#demoValue = Math.min(100, this.#demoValue + 10);
  };

  override render() {

    return html`
      <docs-page-layout tag="dui-progress">
        <dui-docs-demo label="Values" demo-width="var(--space-60)">
          <div style="display: flex; flex-direction: column; gap: var(--space-4); width: 100%;">
            <div>
              <div style="font-size: var(--text-xs); color: var(--text-2); margin-bottom: var(--space-1);">0%</div>
              <dui-progress value="0"></dui-progress>
            </div>
            <div>
              <div style="font-size: var(--text-xs); color: var(--text-2); margin-bottom: var(--space-1);">33%</div>
              <dui-progress value="33"></dui-progress>
            </div>
            <div>
              <div style="font-size: var(--text-xs); color: var(--text-2); margin-bottom: var(--space-1);">66%</div>
              <dui-progress value="66"></dui-progress>
            </div>
            <div>
              <div style="font-size: var(--text-xs); color: var(--text-2); margin-bottom: var(--space-1);">100%</div>
              <dui-progress value="100"></dui-progress>
            </div>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Indeterminate" demo-width="var(--space-60)">
          <dui-progress style="width: 100%;"></dui-progress>
        </dui-docs-demo>

        <dui-docs-demo label="Interactive" demo-width="var(--space-60)">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); width: 100%;">
            <dui-progress value="${this.#demoValue}"></dui-progress>
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <dui-button size="sm" appearance="soft" @click="${this.#increment}">
                Increment (+10)
              </dui-button>
              <span style="font-size: var(--text-sm); color: var(--text-2);">
                ${this.#demoValue}%
              </span>
            </div>
          </div>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
