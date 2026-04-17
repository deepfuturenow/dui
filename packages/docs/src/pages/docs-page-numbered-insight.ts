import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-numbered-insight")
export class DocsPageNumberedInsight extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-numbered-insight">

        <dui-docs-demo label="Ranked findings with severity">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-numbered-insight
              ordinal="1"
              title="Naval activity surge near Strait of Hormuz"
              category="Maritime"
              severity="critical"
              description="Satellite imagery confirms 8 additional warships transiting the strait in the past 24 hours, significantly exceeding the 90-day moving average."
            ></dui-numbered-insight>

            <dui-numbered-insight
              ordinal="2"
              title="Unusual diplomatic communications detected"
              category="SIGINT"
              severity="high"
              description="Encrypted traffic between two embassies increased 400% overnight, coinciding with unscheduled cabinet meetings in both capitals."
            ></dui-numbered-insight>

            <dui-numbered-insight
              ordinal="3"
              title="Supply chain disruption risk elevated"
              category="Economic"
              severity="medium"
              description="Three major shipping companies have re-routed vessels away from the affected corridor, adding an estimated 4-day delay to European deliveries."
            ></dui-numbered-insight>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Category only (no severity)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-numbered-insight
              ordinal="1"
              title="Adopt server-side rendering for initial page load"
              category="Performance"
              description="Switching to SSR reduced time-to-first-byte by 62% in testing, significantly improving perceived load speed on mobile devices."
            ></dui-numbered-insight>

            <dui-numbered-insight
              ordinal="2"
              title="Consolidate duplicate API endpoints"
              category="Architecture"
              description="Four endpoints serve overlapping data. Merging them reduces maintenance burden and eliminates inconsistent caching behavior."
            ></dui-numbered-insight>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With action buttons">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-numbered-insight
              ordinal="1"
              title="Critical patch required for auth service"
              severity="critical"
              description="A privilege escalation vulnerability was identified in the token refresh flow. Immediate patching is recommended."
            >
              <dui-button slot="actions" variant="neutral" appearance="ghost" size="sm">View Details</dui-button>
              <dui-button slot="actions" variant="primary" size="sm">Apply Patch</dui-button>
            </dui-numbered-insight>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (title + description only)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-numbered-insight
              ordinal="1"
              title="Focus on core user journey first"
              description="The onboarding flow accounts for 80% of user drop-off. Prioritizing improvements here will have the highest impact."
            ></dui-numbered-insight>

            <dui-numbered-insight
              ordinal="2"
              title="Add offline support for mobile users"
              description="Analytics show 23% of mobile sessions experience connectivity interruptions. Service worker caching would dramatically improve reliability."
            ></dui-numbered-insight>

            <dui-numbered-insight
              ordinal="3"
              title="Migrate legacy payment integration"
              description="The current payment gateway reaches end-of-life in Q3. Early migration avoids forced downtime and unlocks improved fraud detection."
            ></dui-numbered-insight>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
