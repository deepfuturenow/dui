import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-progress-bar")
export class DocsPageProgressBar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-progress-bar">

        <dui-docs-demo label="Basic">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-progress-bar
              label="CPU Usage"
              .value=${68}
              .max=${100}
              description="4 cores, 2.4 GHz avg"
            ></dui-progress-bar>

            <dui-progress-bar
              label="Memory"
              .value=${12}
              .max=${32}
              value-text="12 GB / 32 GB"
              description="DDR5 ECC"
            ></dui-progress-bar>

            <dui-progress-bar
              label="Storage"
              .value=${37}
              .max=${50}
              value-text="37 GB / 50 GB"
              description="SSD volume /data"
            ></dui-progress-bar>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Various fill levels">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-progress-bar
              label="Nearly Empty"
              .value=${5}
              .max=${100}
            ></dui-progress-bar>

            <dui-progress-bar
              label="Quarter Full"
              .value=${25}
              .max=${100}
            ></dui-progress-bar>

            <dui-progress-bar
              label="Half Full"
              .value=${50}
              .max=${100}
            ></dui-progress-bar>

            <dui-progress-bar
              label="Nearly Full"
              .value=${95}
              .max=${100}
              description="Consider upgrading capacity"
            ></dui-progress-bar>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Custom value text">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-progress-bar
              label="API Quota"
              .value=${9500}
              .max=${10000}
              value-text="9,500 / 10,000"
              description="Resets in 2h 14m"
            ></dui-progress-bar>

            <dui-progress-bar
              label="Build Pipeline"
              .value=${3}
              .max=${5}
              value-text="Step 3 of 5"
              description="Running integration tests"
            ></dui-progress-bar>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With actions slot">
          <div style="max-width: 560px;">
            <dui-progress-bar
              label="Disk Usage"
              .value=${92}
              .max=${100}
              description="Critical — 8% remaining"
            >
              <div slot="actions">
                <dui-button size="sm" variant="outline">Clean Up</dui-button>
              </div>
            </dui-progress-bar>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
