import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-headline-item")
export class DocsPageHeadlineItem extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-headline-item">

        <dui-docs-demo label="Basic">
          <div style="display:flex; flex-direction:column; gap: var(--space-1); max-width: 560px;">
            <dui-headline-item
              title="Security Council Approves New Sanctions Resolution"
              source="Reuters"
              timestamp="3 min ago"
            ></dui-headline-item>

            <dui-headline-item
              title="Central Bank Holds Interest Rates Steady at 5.25%"
              source="Bloomberg"
              timestamp="12 min ago"
            ></dui-headline-item>

            <dui-headline-item
              title="Hurricane Warning Issued for Gulf Coast Region Affecting Multiple States"
              source="AP News"
              timestamp="28 min ago"
            ></dui-headline-item>

            <dui-headline-item
              title="Tech Stocks Rally After Earnings Beat Expectations"
              source="CNBC"
              timestamp="1 hr ago"
            ></dui-headline-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With links">
          <div style="display:flex; flex-direction:column; gap: var(--space-1); max-width: 560px;">
            <dui-headline-item
              title="Major Trade Agreement Reached Between Pacific Nations"
              source="Financial Times"
              timestamp="14:23 UTC"
              href="https://example.com/trade"
            ></dui-headline-item>

            <dui-headline-item
              title="New Climate Report Warns of Accelerating Ice Loss"
              source="Nature"
              timestamp="09:15 UTC"
              href="https://example.com/climate"
            ></dui-headline-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (title only)">
          <div style="display:flex; flex-direction:column; gap: var(--space-1); max-width: 560px;">
            <dui-headline-item
              title="System maintenance window begins at 02:00 UTC"
            ></dui-headline-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Source or timestamp only">
          <div style="display:flex; flex-direction:column; gap: var(--space-1); max-width: 560px;">
            <dui-headline-item
              title="International Summit Opens in Geneva"
              timestamp="2 hr ago"
            ></dui-headline-item>

            <dui-headline-item
              title="Quarterly Earnings Report Released"
              source="Bloomberg"
            ></dui-headline-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With actions slot">
          <div style="display:flex; flex-direction:column; gap: var(--space-1); max-width: 560px;">
            <dui-headline-item
              title="Breaking: Emergency Session Called at UN Headquarters"
              source="Reuters"
              timestamp="Just now"
            >
              <dui-button slot="actions" size="sm" variant="outline">Read</dui-button>
            </dui-headline-item>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
